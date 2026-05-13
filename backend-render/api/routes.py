from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.extractor import extract_audio
from services.search import search_music, get_trending

router = APIRouter()

class DownloadRequest(BaseModel):
    url: str
    format: str = "mp3"

@router.get("/search")
async def search(q: str = Query(...), platform: str = Query("youtube"), limit: int = Query(20)):
    results = await search_music(q, platform, limit)
    return {"success": True, "data": results}

@router.post("/download/audio")
async def download_audio(request: DownloadRequest):
    audio_bytes, filename, mime_type = await extract_audio(request.url, request.format)
    return StreamingResponse(
        audio_bytes,
        media_type=mime_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/trending")
async def trending(region: str = Query("UG")):
    results = await get_trending(region)
    return {"success": True, "data": results}

@router.get("/health")
async def health():
    return {"status": "healthy", "service": "MediaVault API"}

@router.get("/latest-version")
async def latest_version():
    return {
        "version": "1.0.0",
        "versionCode": 1,
        "apkUrl": "https://apkpure.com/mediavault/download",
        "apkSizeBytes": 8500000,
        "isMandatory": False
    }
