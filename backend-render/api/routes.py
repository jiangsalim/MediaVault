from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse, RedirectResponse
from services.extractor import search_music, get_trending, get_channel_details, get_video_details
import re
import os
import asyncio
import yt_dlp
import httpx

router = APIRouter()

# ============================================================
# SEARCH ENDPOINTS
# ============================================================
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
    snippet = {"title": "", "artist": "", "channelId": "", "description": "", "thumbnail": "", "publishedAt": ""}
    video_data = {"duration": 0, "views": 0, "likes": 0}
    channel_data = {}
    related = []

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

    try:
        stats = await get_video_details([video_id])
        if stats and video_id in stats:
            video_data = stats[video_id]
        if snippet.get("channelId"):
            channels = await get_channel_details([snippet["channelId"]])
            if channels:
                channel_data = channels.get(snippet["channelId"], {})
    except: pass

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
    try:
        results, _ = await search_music("trending music 2026", limit=30)
        channel_ids = list(set(v.get("channelId", "") for v in results.get("videos", []) if v.get("channelId")))
        if channel_ids:
            channels = await get_channel_details(channel_ids[:20])
            channel_list = sorted(channels.values(), key=lambda c: c.get("subscriberCount", 0), reverse=True)[:8]
            if channel_list and channel_list[0].get("subscriberCount", 0) > 0:
                return {"success": True, "data": channel_list}
        channel_map = {}
        for v in results.get("videos", []):
            cid = v.get("channelId", "")
            artist = v.get("artist", "")
            if cid and cid not in channel_map:
                channel_map[cid] = {"id": cid, "title": artist or cid, "subscriberCount": 0, "thumbnail": v.get("thumbnail", ""), "videoCount": 0, "customUrl": ""}
        return {"success": True, "data": list(channel_map.values())[:8]}
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
    import json
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get("https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=" + q, timeout=10)
            text = resp.text.replace("window.google.ac.h(", "").rstrip(")")
            data = json.loads(text)
            return {"success": True, "data": [s[0] for s in data[1]][:8]}
    except: pass
    return {"success": True, "data": []}

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version": "1.0.0", "versionCode": 1, "apkUrl": "https://apkpure.com/mediavault/download", "apkSizeBytes": 8500000, "isMandatory": False}

@router.get("/stream/{video_id}")
async def stream_video(video_id: str):
    try:
        ydl_opts = {
            'quiet': True, 'no_warnings': True,
            'format': 'best[height<=720]', 'get-url': True,
            'http_headers': {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
            'extractor_args': {'youtube': {'player_client': ['web', 'android', 'ios']}},
        }
        def run():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                return ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        info = await asyncio.get_event_loop().run_in_executor(None, run)
        return {"success": True, "streamUrl": info.get("url", ""), "title": info.get("title", "")}
    except Exception as e:
        return {"success": False, "error": str(e)}

# ============================================================
# DOWNLOAD: Redirect to Y2mate
# ============================================================
Y2MATE_BASE = "https://v27.www-y2mate.com"

@router.get("/download/mp3/{video_id}")
async def download_mp3(video_id: str):
    """Redirect to Y2mate for MP3 download"""
    return RedirectResponse(
        f"{Y2MATE_BASE}/convert/?videoId={video_id}",
        status_code=302
    )

@router.get("/download/video/{video_id}")
async def download_video(video_id: str, quality: str = Query("720")):
    """Redirect to Y2mate for MP4 download"""
    return RedirectResponse(
        f"{Y2MATE_BASE}/convert/?videoId={video_id}",
        status_code=302
    )