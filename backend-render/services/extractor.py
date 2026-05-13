import io
import yt_dlp

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
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        audio_url = info.get('url')
        title = info.get('title', 'audio')
        ext = format if format else 'mp3'
        filename = f"{title}.{ext}"

        # For now return a placeholder — real streaming needs requests
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(audio_url)
            audio_bytes = io.BytesIO(response.content)

        mime_type = f"audio/{format}" if format != "mp3" else "audio/mpeg"
        return audio_bytes, filename, mime_type
