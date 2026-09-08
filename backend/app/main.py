import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.resumes import router as resumes_router
from app.api.assessments import router as assessments_router
from app.api.brainzone import router as brainzone_router
from app.api.communication import router as communication_router
from app.api.mentors import router as mentors_router
from app.api.onboarding import router as onboarding_router
from app.api.problems import router as problems_router
from app.api.readiness import router as readiness_router
from app.api.recommendations import router as recommendations_router

app = FastAPI(
    title="PlaceMentor AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(resumes_router)
api_router.include_router(assessments_router)
api_router.include_router(brainzone_router)
api_router.include_router(communication_router)
api_router.include_router(mentors_router)
api_router.include_router(onboarding_router)
api_router.include_router(problems_router)
api_router.include_router(readiness_router)
api_router.include_router(recommendations_router)

app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "message": "PlaceMentor AI Backend Running 🚀"
    }