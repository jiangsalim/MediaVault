from fastapi import APIRouter, Query
from services.extractor import (
    search_music,
    get_trending,
    get_channel_details,
    get_video_details,
)

router = APIRouter()

@router.get("/search")
async def search(q: str = Query(...), platform: str = Query("youtube"), limit: int = Query(25)):
    try:
        results = await search_music(q, platform, limit)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e), "data": {"videos": []}}

@router.get("/search/next")
async def search_next(q: str = Query(...), page_token: str = Query(...), limit: int = Query(25)):
    import os, httpx
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyDgQGhyPpKM7QIJWZomw61RbVbeB9kBkng")
    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
    
    url = f"{YOUTUBE_API_BASE}/search"
    params = {"part": "snippet", "q": q, "type": "video", "maxResults": min(limit, 50), "pageToken": page_token, "key": YOUTUBE_API_KEY}
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    videos = []
    for item in data.get("items", []):
        vid = item.get("id", {}).get("videoId", "")
        snippet = item.get("snippet", {})
        videos.append({"id": vid, "title": snippet.get("title", ""), "artist": snippet.get("channelTitle", ""), "channelId": snippet.get("channelId", ""), "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", "")})
    
    return {"success": True, "data": {"videos": videos, "nextPageToken": data.get("nextPageToken", "")}}

@router.get("/song/{video_id}")
async def song_detail(video_id: str):
    import os, httpx, re
    
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyDgQGhyPpKM7QIJWZomw61RbVbeB9kBkng")
    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
    
    url = f"{YOUTUBE_API_BASE}/videos"
    params = {"part": "snippet,contentDetails,statistics", "id": video_id, "key": YOUTUBE_API_KEY}
    
    snippet = {}
    video_data = {}
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
        if data.get("items"):
            item = data["items"][0]
            s = item["snippet"]
            snippet = {"title": s.get("title", ""), "artist": s.get("channelTitle", ""), "channelId": s.get("channelId", ""), "description": s.get("description", ""), "thumbnail": s.get("thumbnails", {}).get("high", {}).get("url", ""), "publishedAt": s.get("publishedAt", "")}
            content = item.get("contentDetails", {})
            stats = item.get("statistics", {})
            video_data = {"duration": parse_duration_local(content.get("duration", "")), "views": int(stats.get("viewCount", 0)) if stats.get("viewCount") else 0, "likes": int(stats.get("likeCount", 0)) if stats.get("likeCount") else 0}
    
    # Channel
    channel_id = snippet.get("channelId", "")
    channel_data = {}
    if channel_id:
        channels = await get_channel_details([channel_id])
        channel_data = channels.get(channel_id, {})
    
    # Related videos via artist search
    related = []
    artist = snippet.get("artist", "")
    if artist:
        try:
            search_url = f"{YOUTUBE_API_BASE}/search"
            sp = {"part": "snippet", "q": f"{artist} songs", "type": "video", "maxResults": 20, "key": YOUTUBE_API_KEY}
            async with httpx.AsyncClient() as client:
                sr = await client.get(search_url, params=sp, timeout=15)
                sd = sr.json()
                for item in sd.get("items", []):
                    vid = item.get("id", {}).get("videoId", "")
                    if vid != video_id:
                        snip = item.get("snippet", {})
                        related.append({"id": vid, "title": snip.get("title", ""), "artist": snip.get("channelTitle", ""), "channelId": snip.get("channelId", ""), "thumbnail": snip.get("thumbnails", {}).get("medium", {}).get("url", "")})
        except:
            pass
    
    return {"success": True, "data": {"id": video_id, **snippet, **video_data, "channel": channel_data, "related": related[:16]}}

def parse_duration_local(d: str) -> int:
    import re
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', d)
    if not m: return 0
    return int(m.group(1) or 0)*3600 + int(m.group(2) or 0)*60 + int(m.group(3) or 0)

@router.get("/channels/trending")
async def trending_channels():
    import os, httpx
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyDgQGhyPpKM7QIJWZomw61RbVbeB9kBkng")
    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
    
    channel_ids = set()
    async with httpx.AsyncClient() as client:
        for query in ["trending music 2026", "top hits"]:
            url = f"{YOUTUBE_API_BASE}/search"
            params = {"part": "snippet", "q": query, "type": "video", "maxResults": 20, "key": YOUTUBE_API_KEY}
            resp = await client.get(url, params=params, timeout=15)
            data = resp.json()
            for item in data.get("items", []):
                cid = item.get("snippet", {}).get("channelId", "")
                if cid: channel_ids.add(cid)
    
    channels_map = await get_channel_details(list(channel_ids)[:20])
    channels = sorted(channels_map.values(), key=lambda c: c.get("subscriberCount", 0), reverse=True)[:8]
    return {"success": True, "data": channels}

@router.get("/trending")
async def trending(region: str = Query("UG")):
    try:
        results = await get_trending(region)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version":"1.0.0","versionCode":1,"apkUrl":"https://apkpure.com/mediavault/download","apkSizeBytes":8500000,"isMandatory":False}

@router.get("/download/audio/{video_id}")
async def download_audio(video_id: str):
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://loader.to/api/card/?url=https://www.youtube.com/watch?v={video_id}&format=mp3", timeout=15)
            data = resp.json()
            if data.get("success"):
                return {"success": True, "downloadUrl": data.get("url", ""), "format": "mp3"}
        return {"success": True, "fallback": True, "youtubeUrl": f"https://youtube.com/watch?v={video_id}"}
    except:
        return {"success": True, "fallback": True, "youtubeUrl": f"https://youtube.com/watch?v={video_id}"}

@router.get("/suggest")
async def suggest(q: str = Query(...)):
    """Get search suggestions from YouTube"""
    import httpx
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q={q}",
                timeout=10
            )
            # Response is JSONP format: window.google.ac.h(["q", [...], ...])
            text = resp.text
            # Extract the array part
            import json, re
            match = re.search(r'\["([^"]+)",(\[.*?\]),', text)
            if match:
                suggestions = json.loads(match.group(2))
                return {"success": True, "data": suggestions}
    except:
        pass
    
    return {"success": True, "data": []}
