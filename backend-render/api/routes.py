from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.extractor import extract_audio, get_audio_stream, get_video_formats
from services.search import search_music, get_trending

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str
    format: str = "mp3"

@router.get("/search")
async def search(q: str = Query(...), platform: str = Query("youtube"), limit: int = Query(25)):
    try:
        results = await search_music(q, platform, limit)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e), "data": {"videos": []}}

@router.get("/formats/{video_id}")
async def get_formats(video_id: str):
    """Get all available download formats with real file sizes."""
    try:
        formats = await get_video_formats(video_id)
        return {"success": True, "data": {"video_id": video_id, "formats": formats}}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/download/audio")
async def download_audio_get(url: str = Query(...), format: str = Query("mp3")):
    try:
        audio_bytes, filename, mime_type = await extract_audio(url, format)
        return StreamingResponse(
            audio_bytes,
            media_type=mime_type,
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/download/audio")
async def download_audio_post(request: DownloadRequest):
    try:
        audio_bytes, filename, mime_type = await extract_audio(request.url, request.format)
        return StreamingResponse(
            audio_bytes,
            media_type=mime_type,
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/trending")
async def trending(region: str = Query("UG")):
    try:
        results = await get_trending(region)
        return {"success": True, "data": results}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.get("/latest-version")
async def latest_version():
    return {"version":"1.0.0","versionCode":1,"apkUrl":"https://apkpure.com/mediavault/download","apkSizeBytes":8500000,"isMandatory":False}
