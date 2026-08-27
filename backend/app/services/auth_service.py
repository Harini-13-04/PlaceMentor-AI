from app.database.mongodb import users_collection
from app.models.user import User
from app.core.security import hash_password, verify_password


async def create_user(full_name: str, email: str, password: str):
    existing_user = await users_collection.find_one({"email": email.lower().strip()})

    if existing_user:
        return None

    user = User(
        full_name=full_name.strip(),
        email=email.lower().strip(),
        password=hash_password(password),
    )

    await users_collection.insert_one(user.model_dump())
    return user


async def authenticate_user(email: str, password: str):
    user_dict = await users_collection.find_one({"email": email.lower().strip()})
    if not user_dict:
        return None
    if not verify_password(password, user_dict.get("password", "")):
        return None
    return user_dict