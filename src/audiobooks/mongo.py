import json
from pymongo import MongoClient
from dotenv import load_dotenv 
import os 

load_dotenv()

MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

mongo_url = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@cluster0.ufjw6qu.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(mongo_url)

db = client["audiobooks_db"]  
collection = db["books"]      

with open("librivox_with_chapters.json", "r", encoding="utf-8") as f:
    audiobook_data = json.load(f)

result = collection.insert_many(audiobook_data)

print(f"Inserted {len(result.inserted_ids)} records into MongoDB")
