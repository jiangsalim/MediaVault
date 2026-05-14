import os
import httpx
from typing import Optional

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

async def search_music(query: str, platform: str = "youtube", limit: int = 25):
    """Basic search using yt-dlp or fallback to YouTube API"""
    if YOUTUBE_API_KEY:
        return await search_youtube_api(query, limit)
    # Fallback: use existing yt-dlp based search
    return {"videos": []}

async def search_youtube_api(query: str, limit: int = 25):
    """Search YouTube using Data API v3"""
    url = f"{YOUTUBE_API_BASE}/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": min(limit, 50),
        "key": YOUTUBE_API_KEY,
        "videoCategoryId": "10",  # Music category
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
            "description": snippet.get("description", "")[:200],
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "publishedAt": snippet.get("publishedAt", ""),
        })
    
    # Get video details (duration, views) for these IDs
    if videos:
        video_ids = [v["id"] for v in videos]
        details = await get_video_details(video_ids)
        for v in videos:
            d = details.get(v["id"], {})
            v["duration"] = parse_duration(d.get("duration", ""))
            v["views"] = int(d.get("viewCount", 0)) if d.get("viewCount") else 0
            v["likes"] = int(d.get("likeCount", 0)) if d.get("likeCount") else 0
    
    return {"videos": videos}

async def get_video_details(video_ids: list[str]) -> dict:
    """Get video statistics"""
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
        result[item["id"]] = {
            "duration": item.get("contentDetails", {}).get("duration", ""),
            "viewCount": item.get("statistics", {}).get("viewCount", "0"),
            "likeCount": item.get("statistics", {}).get("likeCount", "0"),
        }
    return result

async def get_channel_details(channel_ids: list[str]) -> dict:
    """Get channel statistics and branding"""
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
    """Get related videos for a given video"""
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
    """Get trending music videos"""
    if not YOUTUBE_API_KEY:
        return {"videos": []}
    
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
    import re
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    h = int(match.group(1) or 0)
    m = int(match.group(2) or 0)
    s = int(match.group(3) or 0)
    return h * 3600 + m * 60 + s
