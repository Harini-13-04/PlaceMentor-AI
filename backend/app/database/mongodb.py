from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URL, DB_NAME

client = AsyncIOMotorClient(MONGO_URL)

db = client[DB_NAME]

users_collection = db["users"]
resumes_collection = db["resumes"]
communication_sessions_collection = db["communication_sessions"]
gd_rooms_collection = db["gd_rooms"]
gd_evaluations_collection = db["gd_evaluations"]