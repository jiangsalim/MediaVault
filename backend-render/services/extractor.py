import yt_dlp
import httpx
import io

async def extract_audio(url: str, format: str = "mp3"):
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'ignoreerrors': True,
        'geo_bypass': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if not info:
                raise Exception("Could not fetch video info - video may be unavailable")
            
            title = info.get('title', 'audio')
            if title:
                title = title[:80]
                safe_title = "".join(c for c in title if c.isalnum() or c in ' _-').strip()
            else:
                safe_title = "audio"
            
            filename = f"{safe_title}.{format}"
            
            # Get the actual audio URL
            audio_url = None
            formats = info.get('formats', [])
            
            # First try: best audio-only format
            for f in formats:
                if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                    audio_url = f.get('url', '')
                    if audio_url:
                        break
            
            # Second try: any format with audio
            if not audio_url:
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('url'):
                        audio_url = f.get('url', '')
                        break
            
            # Third try: the direct url from info
            if not audio_url:
                audio_url = info.get('url', '')
            
            if not audio_url:
                raise Exception("Cannot extract audio URL from this video")
            
            async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
                response = await client.get(audio_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                })
                if response.status_code != 200:
                    raise Exception(f"Download failed with status {response.status_code}")
                audio_bytes = io.BytesIO(response.content)
            
            mime_type = "audio/mpeg" if format == "mp3" else "audio/mp4"
            return audio_bytes, filename, mime_type
            
    except Exception as e:
        raise Exception(f"Audio extraction failed: {str(e)}")

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
            if not info:
                return ''
            formats = info.get('formats', [])
            for f in formats:
                if f.get('acodec') != 'none' and f.get('vcodec') == 'none' and f.get('url'):
                    return f.get('url', '')
            return info.get('url', '')
    except:
        return ''

async def get_video_formats(video_id: str):
    """Get all available formats with real file sizes from YouTube."""
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
            if not info:
                return []
            
            formats = []
            seen = set()
            raw_formats = info.get('formats', [])
            
            for f in raw_formats:
                acodec = f.get('acodec', 'none')
                vcodec = f.get('vcodec', 'none')
                ext = f.get('ext', 'mp4')
                filesize = f.get('filesize') or f.get('filesize_approx')
                abr = f.get('abr', 0) or 0
                height = f.get('height', 0) or 0
                
                # Audio-only formats
                if acodec != 'none' and vcodec == 'none':
                    key = f"audio_{abr}_{ext}"
                    if key not in seen and abr > 0:
                        seen.add(key)
                        formats.append({
                            'id': f"{ext}_{int(abr)}",
                            'type': 'audio',
                            'ext': ext,
                            'bitrate': int(abr),
                            'filesize': filesize,
                            'label': f"{ext.upper()} {int(abr)}kbps",
                        })
                
                # Video formats (progressive - has both audio and video)
                elif acodec != 'none' and vcodec != 'none' and height > 0:
                    key = f"video_{height}"
                    if key not in seen:
                        seen.add(key)
                        formats.append({
                            'id': f"{height}p",
                            'type': 'video',
                            'ext': ext,
                            'quality': f"{height}p",
                            'filesize': filesize,
                            'label': f"{height}p (Video + Audio)",
                        })
            
            return formats
    except:
        return []
