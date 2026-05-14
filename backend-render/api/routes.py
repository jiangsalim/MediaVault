from fastapi import APIRouter, Query
from services.extractor import (
    search_music,
    get_trending,
    get_channel_details,
    get_related_videos,
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
async def search_next(
    q: str = Query(...),
    page_token: str = Query(...),
    limit: int = Query(25),
):
    """Load more results for pagination/infinite scroll"""
    import os
    import httpx
    
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
    
    url = f"{YOUTUBE_API_BASE}/search"
    params = {
        "part": "snippet",
        "q": q,
        "type": "video",
        "maxResults": min(limit, 50),
        "pageToken": page_token,
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
    
    return {
        "success": True,
        "data": {
            "videos": videos,
            "nextPageToken": data.get("nextPageToken", ""),
        },
    }

@router.get("/song/{video_id}")
async def song_detail(video_id: str):
    """Get full song details + related videos"""
    import os
    import httpx
    from services.extractor import parse_duration
    
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
    
    # Get video details
    details = await get_video_details([video_id])
    video_data = details.get(video_id, {})
    
    # Get snippet
    url = f"{YOUTUBE_API_BASE}/videos"
    params = {
        "part": "snippet",
        "id": video_id,
        "key": YOUTUBE_API_KEY,
    }
    
    snippet = {}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
        if data.get("items"):
            s = data["items"][0]["snippet"]
            snippet = {
                "title": s.get("title", ""),
                "artist": s.get("channelTitle", ""),
                "channelId": s.get("channelId", ""),
                "description": s.get("description", ""),
                "thumbnail": s.get("thumbnails", {}).get("high", {}).get("url", ""),
                "publishedAt": s.get("publishedAt", ""),
            }
    
    # Get related videos
    related = await get_related_videos(video_id)
    
    # Get channel info
    channel_id = snippet.get("channelId", "")
    channel_data = {}
    if channel_id:
        channels = await get_channel_details([channel_id])
        channel_data = channels.get(channel_id, {})
    
    return {
        "success": True,
        "data": {
            "id": video_id,
            **snippet,
            "duration": video_data.get("duration", 0),
            "views": video_data.get("viewCount", 0),
            "likes": video_data.get("likeCount", 0),
            "channel": channel_data,
            "related": related,
        },
    }

@router.get("/channels/trending")
async def trending_channels():
    """Get trending music channels with real subscriber counts"""
    import os
    import httpx
    
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
    
    # Get trending music videos first
    url = f"{YOUTUBE_API_BASE}/videos"
    params = {
        "part": "snippet",
        "chart": "mostPopular",
        "regionCode": "UG",
        "videoCategoryId": "10",
        "maxResults": 30,
        "key": YOUTUBE_API_KEY,
    }
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=15)
        data = resp.json()
    
    # Collect unique channel IDs
    channel_ids = list(set(
        item.get("snippet", {}).get("channelId", "")
        for item in data.get("items", [])
    ))
    
    # Get full channel details
    channels_map = await get_channel_details(channel_ids[:20])
    
    # Convert to list and sort by subscribers
    channels = sorted(
        channels_map.values(),
        key=lambda c: c.get("subscriberCount", 0),
        reverse=True,
    )[:8]
    
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
    return {
        "version": "1.0.0",
        "versionCode": 1,
        "apkUrl": "https://apkpure.com/mediavault/download",
        "apkSizeBytes": 8500000,
        "isMandatory": False,
    }
