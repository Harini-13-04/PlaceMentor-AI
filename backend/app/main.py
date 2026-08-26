from fastapi import FastAPI, APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router

app = FastAPI(
    title="PlaceMentor AI",
    version="1.0.0"
)

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(users_router)
app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "message": "PlaceMentor AI Backend Running 🚀"
    }