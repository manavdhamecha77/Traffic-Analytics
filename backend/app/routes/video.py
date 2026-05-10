from fastapi import APIRouter, UploadFile, File, Form
from app.services.tracking import process_video

router = APIRouter()

@router.post("/process-video")
async def process_video_api(
    file: UploadFile = File(...),
    start_frame: int = Form(0),
    end_frame: int = Form(300)
):

    result = await process_video(
        file,
        start_frame,
        end_frame
    )

    return result