from fastapi import APIRouter, Query # type: ignore
from services.extractor import search_music, get_trending, get_channel_details, get_video_details

router = APIRouter()

@router.get("/search")
async def search(q: str = Query(...), platform: str = Query("youtube"), limit: int = Query(25)):
    try:
        results, _ = await search_music(q, platform, limit)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e), "data": {"videos": []}}

@router.get("/search/next")
async def search_next(q: str = Query(...), page_token: str = Query(...), limit: int = Query(25)):
    try:
        results, _ = await search_music(q, limit=limit)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e), "data": {"videos": []}}

@router.get("/song/{video_id}")
async def song_detail(video_id: str):
    """oEmbed for basic info + API for stats"""
    import httpx  # type: ignore

    snippet = {"title": "", "artist": "", "channelId": "", "description": "", "thumbnail": "", "publishedAt": ""}
    video_data = {"duration": 0, "views": 0, "likes": 0}
    channel_data = {}
    related = []

    # METHOD 1: oEmbed for basic info (free)
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.youtube.com/oembed",
                params={"url": "https://www.youtube.com/watch?v=" + video_id, "format": "json"},
                timeout=10
            )
            data = resp.json()
            snippet["title"] = data.get("title", "")
            snippet["artist"] = data.get("author_name", "")
            snippet["thumbnail"] = "https://i.ytimg.com/vi/" + video_id + "/hqdefault.jpg"
    except: pass

    # METHOD 2: YouTube API for stats + channel (uses keys)
    try:
        stats = await get_video_details([video_id])
        if stats and video_id in stats:
            video_data = stats[video_id]
        
        if snippet.get("channelId"):
            channels = await get_channel_details([snippet["channelId"]])
            if channels:
                channel_data = channels.get(snippet["channelId"], {})
    except: pass

    # METHOD 3: Related via search (free)
    artist = snippet.get("artist", "")
    if artist:
        try:
            related_results, _ = await search_music(artist + " songs", limit=16)
            for v in related_results.get("videos", []):
                if v.get("id") != video_id:
                    related.append({"id": v.get("id", ""), "title": v.get("title", ""), "artist": v.get("artist", ""), "thumbnail": v.get("thumbnail", "")})
        except: pass

    if snippet["title"]:
        return {"success": True, "data": {"id": video_id, **snippet, **video_data, "channel": channel_data, "related": related[:16]}}

    # Ultimate fallback: search
    try:
        results, _ = await search_music(video_id, limit=1)
        if results.get("videos"):
            v = results["videos"][0]
            return {"success": True, "data": {
                "id": video_id, "title": v.get("title", ""), "artist": v.get("artist", ""),
                "channelId": v.get("channelId", ""), "description": v.get("description", ""),
                "thumbnail": v.get("thumbnail", ""), "publishedAt": v.get("publishedAt", ""),
                "duration": v.get("duration", 0), "views": v.get("views", 0), "likes": v.get("likes", 0),
                "channel": {}, "related": [],
            }}
    except: pass

    return {"success": False, "error": "All methods failed", "data": None}

@router.get("/channels/trending")
async def trending_channels():
    """YouTube API ONLY for channel details"""
    try:
        # First get trending videos via free method
        results, _ = await search_music("trending music 2026", limit=30)
        channel_ids = list(set(v.get("channelId", "") for v in results.get("videos", []) if v.get("channelId")))
        if channel_ids:
            # Use API keys ONLY for channel details
            channels = await get_channel_details(channel_ids[:20])
            channel_list = sorted(channels.values(), key=lambda c: c.get("subscriberCount", 0), reverse=True)[:8]
            if channel_list and channel_list[0].get("subscriberCount", 0) > 0:
                return {"success": True, "data": channel_list}
        
        # Fallback: build basic channel cards from search results
        channel_map = {}
        for v in results.get("videos", []):
            cid = v.get("channelId", "")
            artist = v.get("artist", "")
            if cid and cid not in channel_map:
                channel_map[cid] = {"id": cid, "title": artist or cid, "subscriberCount": 0, "thumbnail": v.get("thumbnail", ""), "videoCount": 0, "customUrl": ""}
        fallback = list(channel_map.values())[:8]
        return {"success": True, "data": fallback}
    except:
        return {"success": True, "data": []}

@router.get("/trending")
async def trending(region: str = Query("UG")):
    try:
        results, _ = await get_trending(region)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/suggest")
@router.get("/suggest")
async def suggest(q: str = Query(...)):
    import json
    try:
        import httpx as hx  # type: ignore
        async with hx.AsyncClient() as client:
            resp = await client.get("https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=" + q, timeout=10)
            text = resp.text
            text = text.replace("window.google.ac.h(", "").rstrip(")")
            data = json.loads(text)
            suggestions = [s[0] for s in data[1]]
            return {"success": True, "data": suggestions[:8]}
    except: pass
    return {"success": True, "data": []}
    return {"success": True, "redirectUrl": "https://www.y2mate.com/youtube/" + video_id}

@router.get("/health")
async def health(): return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version":"1.0.0","versionCode":1,"apkUrl":"https://apkpure.com/mediavault/download","apkSizeBytes":8500000,"isMandatory":False}

@router.get("/stream/{video_id}")
async def stream_video(video_id: str):
    """Get direct video stream URL using yt-dlp"""
    import asyncio
    try:
        ydl_opts = {'quiet': True, 'no_warnings': True, 'format': 'best[height<=720]', 'get-url': True}
        def run():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # type: ignore
                return ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        loop = asyncio.get_event_loop()
        info = await loop.run_in_executor(None, run)
        return {"success": True, "streamUrl": info.get("url", ""), "title": info.get("title", "")}
    except Exception as e:
        return {"success": False, "error": str(e)}
    
