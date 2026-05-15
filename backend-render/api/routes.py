from fastapi import APIRouter, Query
from services.extractor import search_music, get_trending, get_channel_details, get_video_details

router = APIRouter()

@router.get("/search")
async def search(q: str = Query(...), platform: str = Query("youtube"), limit: int = Query(25)):
    try:
        results, method_used = await search_music(q, platform, limit)
        return {"success": True, "data": results, "method": method_used}
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
    """Try API first. If API is down, use yt-dlp (same method that search used). Skip Invidious/RSS for details."""
    import httpx, random, os, re
    
    api_keys = [
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
    
    # ── METHOD 1: YouTube API ──
    for _ in range(3):
        try:
            key = random.choice(api_keys)
            YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
            
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    f"{YOUTUBE_API_BASE}/videos",
                    params={"part": "snippet,contentDetails,statistics", "id": video_id, "key": key},
                    timeout=10
                )
                data = resp.json()
            
            if "error" in data:
                continue
            
            if data.get("items"):
                item = data["items"][0]
                s = item["snippet"]
                c = item.get("contentDetails", {})
                st = item.get("statistics", {})
                
                snippet = {
                    "title": s.get("title", ""), "artist": s.get("channelTitle", ""),
                    "channelId": s.get("channelId", ""), "description": s.get("description", ""),
                    "thumbnail": s.get("thumbnails", {}).get("high", {}).get("url", ""),
                    "publishedAt": s.get("publishedAt", ""),
                }
                video_data = {
                    "duration": parse_duration_local(c.get("duration", "")),
                    "views": int(st.get("viewCount", 0)) if st.get("viewCount") else 0,
                    "likes": int(st.get("likeCount", 0)) if st.get("likeCount") else 0,
                }
                
                channel_id = s.get("channelId", "")
                channel_data = {}
                if channel_id:
                    channels = await get_channel_details([channel_id])
                    channel_data = channels.get(channel_id, {})
                
                # Related via search (uses same method as homepage)
                artist = s.get("channelTitle", "")
                related = []
                if artist:
                    related_results, _ = await search_music(f"{artist} songs", limit=16)
                    for v in related_results.get("videos", []):
                        if v.get("id") != video_id:
                            related.append({
                                "id": v.get("id", ""), "title": v.get("title", ""),
                                "artist": v.get("artist", ""), "thumbnail": v.get("thumbnail", ""),
                            })
                
                print(f"✅ Song via API: {snippet['title'][:50]}")
                return {"success": True, "data": {"id": video_id, **snippet, **video_data, "channel": channel_data, "related": related[:16]}}
        except:
            continue
    
    # ── METHOD 2: Invidious (no API key, no bot detection) ──
    import random
    INVIDIOUS = ["https://inv.nadeko.net", "https://yewtu.be", "https://iv.ggtyler.dev"]
    for _ in range(3):
        try:
            instance = random.choice(INVIDIOUS)
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"{instance}/api/v1/videos/{video_id}", timeout=10)
                data = resp.json()
            
            snippet = {
                "title": data.get("title", ""),
                "artist": data.get("author", ""),
                "channelId": data.get("authorId", ""),
                "description": data.get("description", "") or "",
                "thumbnail": (data.get("videoThumbnails", [{}])[-1].get("url", "") if data.get("videoThumbnails") else f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"),
                "publishedAt": data.get("publishedText", ""),
            }
            video_data = {"duration": data.get("lengthSeconds", 0) or 0, "views": data.get("viewCount", 0) or 0, "likes": data.get("likeCount", 0) or 0}
            channel_id = snippet.get("channelId", "")
            channel_data = {}
            if channel_id:
                channels = await get_channel_details([channel_id])
                channel_data = channels.get(channel_id, {})
            related = []
            for r in data.get("recommendedVideos", [])[:16]:
                related.append({"id": r.get("videoId", ""), "title": r.get("title", ""), "artist": r.get("author", ""), "thumbnail": (r.get("videoThumbnails", [{}])[-1].get("url", "") if r.get("videoThumbnails") else f"https://i.ytimg.com/vi/{r.get("videoId","")}/mqdefault.jpg")})
            print(f"✅ Song via Invidious: {snippet["title"][:50]}")
            return {"success": True, "data": {"id": video_id, **snippet, **video_data, "channel": channel_data, "related": related[:16]}}
        except:
            continue
    
    return {"success": False, "error": "All methods failed", "data": None}

def parse_duration_local(d: str) -> int:
    import re
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', d)
    if not m: return 0
    return int(m.group(1) or 0)*3600 + int(m.group(2) or 0)*60 + int(m.group(3) or 0)

@router.get("/channels/trending")
@router.get("/channels/trending")
async def trending_channels():
    """Try API first, then yt-dlp fallback for channels"""
    import random
    
    # ── METHOD 1: YouTube API ──
    api_keys = [
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
    
    try:
        import httpx
        key = random.choice(api_keys)
        YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"
        
        # Get trending music videos
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{YOUTUBE_API_BASE}/videos",
                params={"part": "snippet", "chart": "mostPopular", "regionCode": "UG", "videoCategoryId": "10", "maxResults": 30, "key": key},
                timeout=10
            )
            data = resp.json()
        
        if "error" not in data:
            channel_ids = list(set(item.get("snippet", {}).get("channelId", "") for item in data.get("items", [])))
            if channel_ids:
                channels = await get_channel_details(channel_ids[:20])
                channel_list = sorted(channels.values(), key=lambda c: c.get("subscriberCount", 0), reverse=True)[:8]
                if channel_list:
                    print(f"✅ Channels via API: {len(channel_list)} found")
                    return {"success": True, "data": channel_list}
    except:
        pass
    
    # ── METHOD 2: yt-dlp search + extract channels ──
    try:
        results, method = await search_music("trending music 2026", limit=30)
        channel_ids = list(set(v.get("channelId", "") for v in results.get("videos", []) if v.get("channelId")))
        if channel_ids:
            channels = await get_channel_details(channel_ids[:20])
            channel_list = sorted(channels.values(), key=lambda c: c.get("subscriberCount", 0), reverse=True)[:8]
            if channel_list:
                print(f"✅ Channels via yt-dlp: {len(channel_list)} found")
                return {"success": True, "data": channel_list}
    except:
        pass
    
    return {"success": True, "data": []}
async def trending(region: str = Query("UG")):
    try:
        results, _ = await get_trending(region)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/suggest")
@router.get("/suggest")
@router.get("/suggest")
async def suggest(q: str = Query(...)):
    """Get clean search suggestions — Google API first, then clean yt-dlp suggestions"""
    import json as j, re
    
    # ── METHOD 1: Google Suggest API (clean autocomplete phrases) ──
    try:
        import httpx as hx
        async with hx.AsyncClient() as client:
            resp = await client.get(f"https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q={q}", timeout=10)
            text = resp.text
            match = re.search(r'["([^"]+)",([.*?]),', text)
            if match:
                suggestions = j.loads(match.group(2))
                if suggestions:
                    return {"success": True, "data": suggestions[:8]}
    except:
        pass
    
    # ── METHOD 2: Clean yt-dlp suggestions (artists/songs matching query) ──
    try:
        results, _ = await search_music(q, limit=8)
        suggestions = []
        seen = set()
        for v in results.get("videos", []):
            artist = v.get("artist", "")
            title = v.get("title", "")
            # Use artist names and short phrases as suggestions
            if artist and artist.lower() not in seen:
                seen.add(artist.lower())
                suggestions.append(artist)
            elif title and len(title) < 60 and title.lower() not in seen:
                seen.add(title.lower())
                suggestions.append(title[:60])
            if len(suggestions) >= 8:
                break
        if suggestions:
            return {"success": True, "data": suggestions}
    except:
        pass
    
    return {"success": True, "data": []}
    return {"success": True, "redirectUrl": f"https://www.y2mate.com/youtube/{video_id}"}

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version":"1.0.0","versionCode":1,"apkUrl":"https://apkpure.com/mediavault/download","apkSizeBytes":8500000,"isMandatory":False}
