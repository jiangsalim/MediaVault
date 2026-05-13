import yt_dlp
import httpx
import io
import urllib.parse

async def extract_audio(url: str, format: str = "mp3"):
    # Try multiple approaches to extract audio
    ydl_opts_list = [
        # Approach 1: Standard extraction
        {
            'format': 'bestaudio/best',
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'ignoreerrors': True,
            'geo_bypass': True,
            'extractor_args': {'youtube': {'skip': ['hls', 'dash']}},
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-us,en;q=0.5',
            }
        },
        # Approach 2: Mobile user agent
        {
            'format': 'bestaudio/best',
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
            'ignoreerrors': True,
            'geo_bypass': True,
            'http_headers': {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            }
        },
        # Approach 3: Minimal options
        {
            'format': 'bestaudio/best',
            'quiet': True,
            'no_warnings': True,
            'nocheckcertificate': True,
        }
    ]

    last_error = None

    for idx, ydl_opts in enumerate(ydl_opts_list):
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if info:
                    return await process_info(info, format)
        except Exception as e:
            last_error = str(e)
            continue

    # If all yt-dlp attempts fail, try direct HTTP approach
    try:
        video_id = extract_video_id(url)
        if video_id:
            async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
                # Try to get the video page directly
                page_url = f"https://www.youtube.com/watch?v={video_id}"
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                }
                response = await client.get(page_url, headers=headers)
                if response.status_code == 200:
                    raise Exception("YouTube page reached but cannot extract audio. Video may be restricted in this region.")
    except Exception as e:
        last_error = str(e)

    raise Exception(f"Cannot access this video. It may be geo-restricted or unavailable. Try a different song.")

async def process_info(info, format):
    title = info.get('title', 'audio')
    if title:
        title = title[:80]
        safe_title = "".join(c for c in title if c.isalnum() or c in ' _-').strip()
    else:
        safe_title = "audio"
    
    filename = f"{safe_title}.{format}"
    
    audio_url = None
    formats = info.get('formats', [])
    
    for f in formats:
        if f.get('acodec') != 'none' and f.get('vcodec') == 'none' and f.get('url'):
            audio_url = f.get('url', '')
            break
    
    if not audio_url:
        for f in formats:
            if f.get('acodec') != 'none' and f.get('url'):
                audio_url = f.get('url', '')
                break
    
    if not audio_url:
        audio_url = info.get('url', '')
    
    if not audio_url:
        raise Exception("Cannot extract audio URL from this video")
    
    async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
        response = await client.get(audio_url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
        })
        if response.status_code != 200:
            raise Exception(f"Download failed with status {response.status_code}")
        audio_bytes = io.BytesIO(response.content)
    
    mime_type = "audio/mpeg" if format == "mp3" else "audio/mp4"
    return audio_bytes, filename, mime_type

def extract_video_id(url):
    import re
    patterns = [
        r'youtu\.be/([a-zA-Z0-9_-]{11})',
        r'[?&]v=([a-zA-Z0-9_-]{11})',
        r'/embed/([a-zA-Z0-9_-]{11})',
        r'/shorts/([a-zA-Z0-9_-]{11})',
        r'/watch/([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

async def get_audio_stream(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return info.get('url', '') if info else ''
    except:
        return ''

async def get_video_formats(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'extract_flat': False,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if not info: return []
            formats = []
            seen = set()
            for f in info.get('formats', []):
                acodec = f.get('acodec', 'none')
                vcodec = f.get('vcodec', 'none')
                ext = f.get('ext', 'mp4')
                filesize = f.get('filesize') or f.get('filesize_approx')
                abr = f.get('abr', 0) or 0
                if acodec != 'none' and vcodec == 'none' and abr > 0:
                    key = f"audio_{int(abr)}_{ext}"
                    if key not in seen:
                        seen.add(key)
                        formats.append({
                            'id': f"{ext}_{int(abr)}",
                            'type': 'audio',
                            'ext': ext,
                            'bitrate': int(abr),
                            'filesize': filesize,
                            'label': f"{ext.upper()} {int(abr)}kbps",
                        })
            return formats
    except:
        return []
