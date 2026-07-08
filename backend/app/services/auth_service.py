from app.database.mongodb import users_collection
from app.models.user import User
from app.core.security import hash_password


async def create_user(full_name: str, email: str, password: str):

    existing_user = await users_collection.find_one({"email": email})

    if existing_user:
        return None

    user = User(
        full_name=full_name,
        email=email,
        password=hash_password(password),
    )

    await users_collection.insert_one(user.model_dump())

    return user