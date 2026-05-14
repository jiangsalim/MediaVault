from fastapi import APIRouter, Query
from services.extractor import search_music, get_trending, get_channel_details

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
    # yt-dlp doesn't support pagination well, just search again
    try:
        results = await search_music(q, limit=limit)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e), "data": {"videos": []}}

@router.get("/song/{video_id}")
async def song_detail(video_id: str):
    import httpx, re
    from services.extractor import get_video_details, parse_duration
    
    try:
        # Get video info via yt-dlp
        import yt_dlp
        url = f"https://www.youtube.com/watch?v={video_id}"
        ydl_opts = {'quiet': True, 'no_warnings': True, 'skip_download': True}
        
        def get_info():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                return ydl.extract_info(url, download=False)
        
        import asyncio
        loop = asyncio.get_event_loop()
        info = await loop.run_in_executor(None, get_info)
        
        snippet = {
            "title": info.get("title", ""),
            "artist": info.get("uploader", "") or info.get("channel", ""),
            "channelId": info.get("channel_id", ""),
            "description": info.get("description", "") or "",
            "thumbnail": info.get("thumbnail", "") or f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
            "publishedAt": info.get("upload_date", ""),
        }
        video_data = {
            "duration": info.get("duration", 0) or 0,
            "views": info.get("view_count", 0) or 0,
            "likes": info.get("like_count", 0) or 0,
        }
        
        # Channel info
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
                related_results = await search_music(f"{artist} songs", limit=16)
                for v in related_results.get("videos", []):
                    if v.get("id") != video_id:
                        related.append({
                            "id": v.get("id", ""),
                            "title": v.get("title", ""),
                            "artist": v.get("artist", ""),
                            "thumbnail": v.get("thumbnail", ""),
                        })
            except:
                pass
        
        return {"success": True, "data": {
            "id": video_id,
            **snippet,
            **video_data,
            "channel": channel_data,
            "related": related[:16],
        }}
    except Exception as e:
        return {"success": False, "error": str(e), "data": None}

@router.get("/channels/trending")
async def trending_channels():
    try:
        results = await search_music("trending music 2026", limit=30)
        channel_ids = list(set(v.get("channelId", "") for v in results.get("videos", []) if v.get("channelId")))
        if channel_ids:
            channels = await get_channel_details(channel_ids[:20])
            channel_list = sorted(channels.values(), key=lambda c: c.get("subscriberCount", 0), reverse=True)[:8]
            return {"success": True, "data": channel_list}
        return {"success": True, "data": []}
    except:
        return {"success": True, "data": []}

@router.get("/trending")
async def trending(region: str = Query("UG")):
    try:
        results = await get_trending(region)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/suggest")
async def suggest(q: str = Query(...)):
    import json as j, re
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q={q}", timeout=10)
            text = resp.text
            match = re.search(r'\["([^"]+)",(\[.*?\]),', text)
            if match:
                suggestions = j.loads(match.group(2))
                return {"success": True, "data": suggestions}
    except: pass
    return {"success": True, "data": []}

@router.get("/download/audio/{video_id}")
async def download_audio(video_id: str):
    return {
        "success": True,
        "redirectUrl": f"https://www.y2mate.com/youtube/{video_id}",
    }

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version":"1.0.0","versionCode":1,"apkUrl":"https://apkpure.com/mediavault/download","apkSizeBytes":8500000,"isMandatory":False}
