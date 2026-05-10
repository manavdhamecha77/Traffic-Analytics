import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.video import router as video_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_router)

# Ensure the static directory exists and use absolute path
static_dir = os.path.join(os.getcwd(), "outputs")
os.makedirs(static_dir, exist_ok=True)

app.mount(
    "/outputs",
    StaticFiles(directory=static_dir),
    name="outputs"
)