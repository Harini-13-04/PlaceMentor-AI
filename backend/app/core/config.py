import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://placementor_admin:PlaceMentor%402026%23@myatlasclusteredu.12mxqk0.mongodb.net/?appName=myAtlasClusterEDU")
DB_NAME = os.getenv("DB_NAME", "placementor")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

SECRET_KEY = os.getenv("SECRET_KEY", "d88bae1b269d698ce339c2ccb2e0d8ff380266513b17930a9c5bbef7b3505f7e")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))