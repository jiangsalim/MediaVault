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
        'extract_flat': False,
        'geo_bypass': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            title = info.get('title', 'audio')[:50]
            safe_title = "".join(c for c in title if c.isalnum() or c in ' _-').strip()
            filename = f"{safe_title}.{format}"
            audio_url = info.get('url', '')
            if not audio_url:
                formats = info.get('formats', [])
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        audio_url = f.get('url', '')
                        break
            if not audio_url:
                formats = info.get('formats', [])
                for f in formats:
                    if f.get('url'):
                        audio_url = f.get('url', '')
                        break
            if not audio_url:
                raise Exception("Cannot extract audio URL - video may be restricted")
            async with httpx.AsyncClient(timeout=60, follow_redirects=True) as client:
                response = await client.get(audio_url)
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
            return info.get('url', '')
    except:
        return ''
