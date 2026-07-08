import asyncio
from app.database.mongodb import db

async def test():
    collections = await db.list_collection_names()
    print("Connected successfully!")
    print("Collections:", collections)

asyncio.run(test())