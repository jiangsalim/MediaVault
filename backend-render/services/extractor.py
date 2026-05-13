import io
import yt_dlp
import httpx

async def extract_audio(url: str, format: str = "mp3"):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': format,
            'preferredquality': '128',
        }],
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'ignoreerrors': True,
        'no_color': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            audio_url = info.get('url', '')
            title = info.get('title', 'audio')
            filename = f"{title[:50]}.{format}"
            if not audio_url:
                formats = info.get('formats', [])
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        audio_url = f.get('url', '')
                        break
            if not audio_url:
                raise Exception("No audio URL found")
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(audio_url)
                audio_bytes = io.BytesIO(response.content)
            mime_type = "audio/mpeg" if format == "mp3" else "audio/mp4"
            return audio_bytes, filename, mime_type
    except Exception as e:
        raise e

async def get_audio_stream(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'ignoreerrors': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            audio_url = info.get('url', '')
            if not audio_url:
                formats = info.get('formats', [])
                for f in formats:
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                        audio_url = f.get('url', '')
                        break
            return audio_url
    except:
        return ''
