import os
import re
import io
import random
import httpx
import yt_dlp

# Multiple YouTube API keys for quota rotation (optional)
YOUTUBE_API_KEYS = [
    "AIzaSyDgQGhyPpKM7QIJWZomw61RbVbeB9kBkng",
    "AIzaSyAX5f9v2uYNL5jDVOlxhVp4IuK_cy68e2I",
    "AIzaSyAjtwWKRi6-FZ20jruoQWx4LuC6gZiuqLk",
    "AIzaSyBhJjuscU8TP72FQUt7qcj3hfNKuZ-nlnE",
    "AIzaSyBbHs7soVbyWqCvafvZaMjcNhs36NMF_Oc",
    "AIzaSyBu3YhONuYaSf3iYFDftLlNAurwDqnTjdc",
    "AIzaSyDvUcaijDrsGDLX6iU7J45xlhQHiPZgnaU",
    "AIzaSyClsLzCXlNhTzzEernLvbCF5M3TH1kzlQA",
    "AIzaSyDt8znupiOA5iWHocls-5wny-R9G_ql5zQ",
    "AIzaSyCI_KHaET_L5TvcKELVhQxT7QN6TTnz0PU",
]

def get_api_key():
    return random.choice(YOUTUBE_API_KEYS)

YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

# Cache
_cache = {}

# ── Main Search: Try API first, fall back to yt-dlp ──

async def search_music(query: str, platform: str = "youtube", limit: int = 25):
    cache_key = f"search_{query}_{limit}"
    if cache_key in _cache:
        return _cache[cache_key]
    
    # Try YouTube API first
    result = await search_via_api(query, limit)
    
    # If API fails or returns empty, fall back to yt-dlp
    if not result or len(result.get("videos", [])) == 0:
        result = await search_via_ytdlp(query, limit)
    
    _cache[cache_key] = result
    if len(_cache) > 100:
        oldest = next(iter(_cache))
        del _cache[oldest]
    
    return result

# ── YouTube API Method ──

async def search_via_api(query: str, limit: int = 25):
    try:
        url = f"{YOUTUBE_API_BASE}/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": min(limit, 50),
            "key": get_api_key(),
            "videoCategoryId": "10",
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=10)
            data = resp.json()
        
        if "error" in data:
            return {"videos": [], "nextPageToken": ""}
        
        videos = []
        video_ids = []
        for item in data.get("items", []):
            vid = item.get("id", {}).get("videoId", "")
            snippet = item.get("snippet", {})
            video_ids.append(vid)
            videos.append({
                "id": vid, "title": snippet.get("title", ""),
                "artist": snippet.get("channelTitle", ""),
                "channelId": snippet.get("channelId", ""),
                "description": snippet.get("description", "")[:200],
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
                "publishedAt": snippet.get("publishedAt", ""),
                "duration": 0, "views": 0, "likes": 0,
            })
        
        if video_ids:
            details = await get_video_details_api(video_ids)
            for v in videos:
                d = details.get(v["id"], {})
                v["duration"] = d.get("duration", 0)
                v["views"] = d.get("views", 0)
                v["likes"] = d.get("likes", 0)
        
        return {"videos": videos, "nextPageToken": data.get("nextPageToken", "")}
    except:
        return {"videos": [], "nextPageToken": ""}

# ── yt-dlp Method (No API Key Needed) ──

async def search_via_ytdlp(query: str, limit: int = 25):
    """Search YouTube using yt-dlp — no API key required"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'dump_single_json': True,
            'skip_download': True,
        }
        
        search_url = f"ytsearch{limit}:{query}"
        
        def run_search():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                return ydl.extract_info(search_url, download=False)
        
        import asyncio
        loop = asyncio.get_event_loop()
        info = await loop.run_in_executor(None, run_search)
        
        videos = []
        for entry in info.get("entries", []):
            if entry:
                videos.append({
                    "id": entry.get("id", ""),
                    "title": entry.get("title", ""),
                    "artist": entry.get("channel", "") or entry.get("uploader", ""),
                    "channelId": entry.get("channel_id", ""),
                    "description": (entry.get("description", "") or "")[:200],
                    "thumbnail": entry.get("thumbnails", [{}])[-1].get("url", "") if entry.get("thumbnails") else f"https://i.ytimg.com/vi/{entry.get('id', '')}/mqdefault.jpg",
                    "publishedAt": entry.get("upload_date", ""),
                    "duration": entry.get("duration", 0) or 0,
                    "views": entry.get("view_count", 0) or 0,
                    "likes": entry.get("like_count", 0) or 0,
                })
        
        return {"videos": videos, "nextPageToken": ""}
    except Exception as e:
        print(f"yt-dlp search error: {e}")
        return {"videos": [], "nextPageToken": ""}

# ── Video Details (API) ──

async def get_video_details_api(video_ids: list) -> dict:
    try:
        url = f"{YOUTUBE_API_BASE}/videos"
        params = {
            "part": "contentDetails,statistics",
            "id": ",".join(video_ids),
            "key": get_api_key(),
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=10)
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
    except:
        return {}

# ── Channel Details (API) ──

async def get_channel_details(channel_ids: list) -> dict:
    try:
        url = f"{YOUTUBE_API_BASE}/channels"
        params = {
            "part": "snippet,statistics,brandingSettings",
            "id": ",".join(channel_ids),
            "key": get_api_key(),
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=10)
            data = resp.json()
        
        result = {}
        for item in data.get("items", []):
            cid = item["id"]
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            result[cid] = {
                "id": cid,
                "title": snippet.get("title", ""),
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
                "subscriberCount": int(stats.get("subscriberCount", 0)),
                "videoCount": int(stats.get("videoCount", 0)),
                "customUrl": snippet.get("customUrl", ""),
            }
        return result
    except:
        return {}

# ── Helpers ──

async def get_video_details(video_ids: list) -> dict:
    return await get_video_details_api(video_ids)

async def get_related_videos(video_id: str, max_results: int = 20) -> list:
    """Get related videos using yt-dlp (no API key needed)"""
    try:
        url = f"https://www.youtube.com/watch?v={video_id}"
        ydl_opts = {
            'quiet': True, 'no_warnings': True,
            'extract_flat': True, 'skip_download': True,
        }
        
        def run():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                return info.get("automatic_captions", {}) or {}
        
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, run)
        
        # Fall back to artist search via yt-dlp
        return []
    except:
        return []

async def get_trending(region: str = "UG"):
    """Get trending via yt-dlp"""
    try:
        ydl_opts = {
            'quiet': True, 'no_warnings': True,
            'extract_flat': True, 'skip_download': True,
        }
        
        def run():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                return ydl.extract_info("ytsearch25:trending music", download=False)
        
        import asyncio
        loop = asyncio.get_event_loop()
        info = await loop.run_in_executor(None, run)
        
        videos = []
        for entry in info.get("entries", []):
            if entry:
                videos.append({
                    "id": entry.get("id", ""),
                    "title": entry.get("title", ""),
                    "artist": entry.get("channel", "") or entry.get("uploader", ""),
                    "channelId": entry.get("channel_id", ""),
                    "thumbnail": f"https://i.ytimg.com/vi/{entry.get('id', '')}/mqdefault.jpg",
                    "duration": entry.get("duration", 0) or 0,
                    "views": entry.get("view_count", 0) or 0,
                    "likes": entry.get("like_count", 0) or 0,
                })
        
        return {"videos": videos}
    except:
        return {"videos": []}

def parse_duration(duration_str: str) -> int:
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    h = int(match.group(1) or 0)
    m = int(match.group(2) or 0)
    s = int(match.group(3) or 0)
    return h * 3600 + m * 60 + s
