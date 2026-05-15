from fastapi import APIRouter, Query
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
    """Get song details from YouTube oEmbed + search for related"""
    import httpx

    # METHOD 1: YouTube oEmbed API (free, no key needed)
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.youtube.com/oembed",
                params={"url": "https://www.youtube.com/watch?v=" + video_id, "format": "json"},
                timeout=10
            )
            data = resp.json()
            title = data.get("title", "")
            artist = data.get("author_name", "")
            
            # Search for related using the artist name
            related = []
            if artist:
                related_results, _ = await search_music(artist + " songs", limit=16)
                for v in related_results.get("videos", []):
                    if v.get("id") != video_id:
                        related.append({
                            "id": v.get("id", ""), "title": v.get("title", ""),
                            "artist": v.get("artist", ""), "thumbnail": v.get("thumbnail", ""),
                        })

            return {"success": True, "data": {
                "id": video_id,
                "title": title,
                "artist": artist,
                "channelId": "",
                "description": "",
                "thumbnail": "https://i.ytimg.com/vi/" + video_id + "/hqdefault.jpg",
                "publishedAt": "",
                "duration": 0,
                "views": 0,
                "likes": 0,
                "channel": {"id": "", "title": artist, "subscriberCount": 0, "thumbnail": ""},
                "related": related[:16],
            }}
    except Exception as e:
        pass

    # METHOD 2: Search fallback
    try:
        results, _ = await search_music(video_id, limit=1)
        if results.get("videos"):
            v = results["videos"][0]
            related = []
            artist = v.get("artist", "")
            if artist:
                related_results, _ = await search_music(artist + " songs", limit=16)
                for r in related_results.get("videos", []):
                    if r.get("id") != video_id:
                        related.append({"id": r.get("id", ""), "title": r.get("title", ""), "artist": r.get("artist", ""), "thumbnail": r.get("thumbnail", "")})
            return {"success": True, "data": {
                "id": video_id, "title": v.get("title", ""), "artist": v.get("artist", ""),
                "channelId": v.get("channelId", ""), "description": v.get("description", ""),
                "thumbnail": v.get("thumbnail", ""), "publishedAt": v.get("publishedAt", ""),
                "duration": v.get("duration", 0), "views": v.get("views", 0), "likes": v.get("likes", 0),
                "channel": {"id": v.get("channelId", ""), "title": v.get("artist", ""), "subscriberCount": 0, "thumbnail": ""},
                "related": related[:16],
            }}
    except:
        pass

    return {"success": False, "error": "All methods failed", "data": None}

@router.get("/channels/trending")
async def trending_channels():
    try:
        results, _ = await search_music("trending music 2026", limit=30)
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
        results, _ = await get_trending(region)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/suggest")
async def suggest(q: str = Query(...)):
    import json, re
    try:
        import httpx as hx
        async with hx.AsyncClient() as client:
            resp = await client.get("https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=" + q, timeout=10)
            text = resp.text
            match = re.search(r'\["([^"]+)",(\[.*?\])', text)
            if match:
                return {"success": True, "data": json.loads(match.group(2))}
    except: pass
    return {"success": True, "data": []}

@router.get("/download/audio/{video_id}")
async def download_audio(video_id: str):
    return {"success": True, "redirectUrl": "https://www.y2mate.com/youtube/" + video_id}

@router.get("/health")
async def health(): return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version":"1.0.0","versionCode":1,"apkUrl":"https://apkpure.com/mediavault/download","apkSizeBytes":8500000,"isMandatory":False}
