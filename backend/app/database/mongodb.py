from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URL, DB_NAME

client = AsyncIOMotorClient(MONGO_URL)

db = client[DB_NAME]

users_collection = db["users"]
resumes_collection = db["resumes"]
coding_submissions_collection = db["coding_submissions"]
user_problems_collection = db["user_problems"]
assessment_attempts_collection = db["assessment_attempts"]
brain_zone_progress_collection = db["brain_zone_progress"]
learner_profiles_collection = db["learner_profiles"]
communication_sessions_collection = db["communication_sessions"]
gd_rooms_collection = db["gd_rooms"]
gd_evaluations_collection = db["gd_evaluations"]
aptitude_progress_collection = db["aptitude_progress"]

