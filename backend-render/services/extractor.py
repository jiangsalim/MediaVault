import os
import re
import httpx
from typing import Optional

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyDgQGhyPpKM7QIJWZomw61RbVbeB9kBkng")
YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

async def search_music(query: str, platform: str = "youtube", limit: int = 25):
    return await search_youtube_api(query, limit)

async def search_youtube_api(query: str, limit: int = 25):
    url = f"{YOUTUBE_API_BASE}/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": min(limit, 50),
        "key": YOUTUBE_API_KEY,
        "videoCategoryId": "10",
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    videos = []
    video_ids = []
    for item in data.get("items", []):
        vid = item.get("id", {}).get("videoId", "")
        snippet = item.get("snippet", {})
        video_ids.append(vid)
        videos.append({
            "id": vid,
            "title": snippet.get("title", ""),
            "artist": snippet.get("channelTitle", ""),
            "channelId": snippet.get("channelId", ""),
            "description": snippet.get("description", "")[:200],
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "publishedAt": snippet.get("publishedAt", ""),
            "duration": 0,
            "views": 0,
            "likes": 0,
        })
    
    # Get video details
    if video_ids:
        details = await get_video_details(video_ids)
        for v in videos:
            d = details.get(v["id"], {})
            v["duration"] = d.get("duration", 0)
            v["views"] = d.get("views", 0)
            v["likes"] = d.get("likes", 0)
    
    return {"videos": videos, "nextPageToken": data.get("nextPageToken", "")}

async def get_video_details(video_ids: list) -> dict:
    url = f"{YOUTUBE_API_BASE}/videos"
    params = {
        "part": "contentDetails,statistics",
        "id": ",".join(video_ids),
        "key": YOUTUBE_API_KEY,
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    result = {}
    for item in data.get("items", []):
        content = item.get("contentDetails", {})
        stats = item.get("statistics", {})
        result[item["id"]] = {
            "duration": parse_duration(content.get("duration", "")),
            "views": int(stats.get("viewCount", 0)) if stats.get("viewCount") else 0,
            "likes": int(stats.get("likeCount", 0)) if stats.get("likeCount") else 0,
        }
    return result

async def get_channel_details(channel_ids: list) -> dict:
    url = f"{YOUTUBE_API_BASE}/channels"
    params = {
        "part": "snippet,statistics,brandingSettings",
        "id": ",".join(channel_ids),
        "key": YOUTUBE_API_KEY,
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    result = {}
    for item in data.get("items", []):
        cid = item["id"]
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        branding = item.get("brandingSettings", {}).get("channel", {})
        
        result[cid] = {
            "id": cid,
            "title": snippet.get("title", ""),
            "description": snippet.get("description", "")[:300],
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "banner": branding.get("image", {}).get("bannerExternalUrl", ""),
            "subscriberCount": int(stats.get("subscriberCount", 0)),
            "videoCount": int(stats.get("videoCount", 0)),
            "viewCount": int(stats.get("viewCount", 0)),
            "country": snippet.get("country", ""),
            "customUrl": snippet.get("customUrl", ""),
            "publishedAt": snippet.get("publishedAt", ""),
        }
    return result

async def get_related_videos(video_id: str, max_results: int = 20) -> list:
    url = f"{YOUTUBE_API_BASE}/search"
    params = {
        "part": "snippet",
        "relatedToVideoId": video_id,
        "type": "video",
        "maxResults": min(max_results, 50),
        "key": YOUTUBE_API_KEY,
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    videos = []
    for item in data.get("items", []):
        vid = item.get("id", {}).get("videoId", "")
        snippet = item.get("snippet", {})
        videos.append({
            "id": vid,
            "title": snippet.get("title", ""),
            "artist": snippet.get("channelTitle", ""),
            "channelId": snippet.get("channelId", ""),
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
        })
    return videos

async def get_trending(region: str = "UG"):
    url = f"{YOUTUBE_API_BASE}/videos"
    params = {
        "part": "snippet,contentDetails,statistics",
        "chart": "mostPopular",
        "regionCode": region,
        "videoCategoryId": "10",
        "maxResults": 25,
        "key": YOUTUBE_API_KEY,
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    videos = []
    for item in data.get("items", []):
        vid = item["id"]
        snippet = item.get("snippet", {})
        content = item.get("contentDetails", {})
        stats = item.get("statistics", {})
        
        videos.append({
            "id": vid,
            "title": snippet.get("title", ""),
            "artist": snippet.get("channelTitle", ""),
            "channelId": snippet.get("channelId", ""),
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "duration": parse_duration(content.get("duration", "")),
            "views": int(stats.get("viewCount", 0)),
            "likes": int(stats.get("likeCount", 0)),
        })
    
    return {"videos": videos}

def parse_duration(duration_str: str) -> int:
    """Convert ISO 8601 duration to seconds"""
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    h = int(match.group(1) or 0)
    m = int(match.group(2) or 0)
    s = int(match.group(3) or 0)
    return h * 3600 + m * 60 + s
