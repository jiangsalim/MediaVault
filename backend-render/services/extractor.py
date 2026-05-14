import os, re, io, json, random, asyncio
import httpx, yt_dlp

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
INVIDIOUS_INSTANCES = [
    "https://yewtu.be",
    "https://vid.puffyan.us",
    "https://invidious.flokinet.to",
]

_cache = {}

async def search_music(query: str, platform: str = "youtube", limit: int = 25):
    cache_key = f"search_{query}_{limit}"
    if cache_key in _cache:
        return _cache[cache_key]
    
    methods = [
        ("API", search_via_api),
        ("Invidious", search_via_invidious),
        ("RSS", search_via_rss),
        ("yt-dlp", search_via_ytdlp),
    ]
    
    for name, method in methods:
        try:
            result = await method(query, limit)
            if result and len(result.get("videos", [])) > 0:
                print(f"✅ Search via {name}: {len(result['videos'])} results")
                _cache[cache_key] = (result, name)
                if len(_cache) > 100:
                    oldest = next(iter(_cache))
                    del _cache[oldest]
                return (result, name)
        except Exception as e:
            print(f"❌ {name} failed: {e}")
            continue
    
    return ({"videos": [], "nextPageToken": ""}, "none")

async def search_via_api(query: str, limit: int = 25):
    url = f"{YOUTUBE_API_BASE}/search"
    params = {"part": "snippet", "q": query, "type": "video", "maxResults": min(limit, 50), "key": get_api_key()}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=10)
        data = resp.json()
    if "error" in data:
        params["key"] = get_api_key()
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=10)
            data = resp.json()
        if "error" in data:
            return {"videos": [], "nextPageToken": ""}
    videos = []
    for item in data.get("items", []):
        vid = item.get("id", {}).get("videoId", "")
        snippet = item.get("snippet", {})
        videos.append({"id": vid, "title": snippet.get("title", ""), "artist": snippet.get("channelTitle", ""), "channelId": snippet.get("channelId", ""), "description": snippet.get("description", "")[:200], "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""), "publishedAt": snippet.get("publishedAt", ""), "duration": 0, "views": 0, "likes": 0})
    return {"videos": videos, "nextPageToken": data.get("nextPageToken", "")}

async def search_via_invidious(query: str, limit: int = 25):
    instance = random.choice(INVIDIOUS_INSTANCES)
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{instance}/api/v1/search", params={"q": query, "type": "video"}, timeout=10)
        data = resp.json()
    videos = []
    for item in data[:limit]:
        vid = item.get("videoId", "")
        videos.append({"id": vid, "title": item.get("title", ""), "artist": item.get("author", ""), "channelId": item.get("authorId", ""), "description": item.get("description", "")[:200], "thumbnail": f"https://i.ytimg.com/vi/{vid}/mqdefault.jpg", "publishedAt": item.get("publishedText", ""), "duration": item.get("lengthSeconds", 0) or 0, "views": item.get("viewCount", 0) or 0, "likes": 0})
    return {"videos": videos, "nextPageToken": ""}

async def search_via_rss(query: str, limit: int = 25):
    import xml.etree.ElementTree as ET
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://www.youtube.com/feeds/videos.xml?q={query.replace(' ', '+')}", timeout=10, follow_redirects=True)
        text = resp.text
    root = ET.fromstring(text)
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    videos = []
    for entry in root.findall("atom:entry", ns)[:limit]:
        vid = entry.find("atom:id", ns).text.split(":")[-1] if entry.find("atom:id", ns) is not None else ""
        title = entry.find("atom:title", ns).text if entry.find("atom:title", ns) is not None else ""
        author = entry.find("atom:author/atom:name", ns)
        videos.append({"id": vid, "title": title, "artist": author.text if author is not None else "", "channelId": "", "description": "", "thumbnail": f"https://i.ytimg.com/vi/{vid}/mqdefault.jpg", "publishedAt": "", "duration": 0, "views": 0, "likes": 0})
    return {"videos": videos, "nextPageToken": ""}

async def search_via_ytdlp(query: str, limit: int = 25):
    ydl_opts = {'quiet': True, 'no_warnings': True, 'extract_flat': True, 'skip_download': True}
    def run():
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            return ydl.extract_info(f"ytsearch{limit}:{query}", download=False)
    loop = asyncio.get_event_loop()
    info = await loop.run_in_executor(None, run)
    videos = []
    for entry in info.get("entries", []) if info else []:
        if entry:
            videos.append({"id": entry.get("id", ""), "title": entry.get("title", ""), "artist": entry.get("channel", "") or entry.get("uploader", ""), "channelId": entry.get("channel_id", ""), "description": (entry.get("description", "") or "")[:200], "thumbnail": f"https://i.ytimg.com/vi/{entry.get('id', '')}/mqdefault.jpg", "publishedAt": str(entry.get("upload_date", "")), "duration": entry.get("duration", 0) or 0, "views": entry.get("view_count", 0) or 0, "likes": entry.get("like_count", 0) or 0})
    return {"videos": videos, "nextPageToken": ""}

async def get_channel_details(channel_ids: list) -> dict:
    try:
        url = f"{YOUTUBE_API_BASE}/channels"
        params = {"part": "snippet,statistics", "id": ",".join(channel_ids), "key": get_api_key()}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=10)
            data = resp.json()
        result = {}
        for item in data.get("items", []):
            cid = item["id"]
            s = item.get("snippet", {})
            st = item.get("statistics", {})
            result[cid] = {"id": cid, "title": s.get("title", ""), "thumbnail": s.get("thumbnails", {}).get("medium", {}).get("url", ""), "subscriberCount": int(st.get("subscriberCount", 0)), "videoCount": int(st.get("videoCount", 0)), "customUrl": s.get("customUrl", "")}
        if result: return result
    except: pass
    return {cid: {"id": cid, "title": cid, "subscriberCount": 0, "thumbnail": ""} for cid in channel_ids}

async def get_video_details(video_ids: list) -> dict:
    try:
        url = f"{YOUTUBE_API_BASE}/videos"
        params = {"part": "contentDetails,statistics", "id": ",".join(video_ids), "key": get_api_key()}
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=10)
            data = resp.json()
        result = {}
        for item in data.get("items", []):
            c = item.get("contentDetails", {})
            s = item.get("statistics", {})
            result[item["id"]] = {"duration": parse_duration(c.get("duration", "")), "views": int(s.get("viewCount", 0)) if s.get("viewCount") else 0, "likes": int(s.get("likeCount", 0)) if s.get("likeCount") else 0}
        return result
    except: return {}

async def get_trending(region: str = "UG"):
    result, _ = await search_music("trending music", limit=25)
    return result, "search"

def parse_duration(d: str) -> int:
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', d)
    if not m: return 0
    return int(m.group(1) or 0)*3600 + int(m.group(2) or 0)*60 + int(m.group(3) or 0)
