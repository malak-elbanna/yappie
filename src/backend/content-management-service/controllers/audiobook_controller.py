from flask import request, jsonify
from services.db import mongo
from bson.objectid import ObjectId

def add_audiobook():
    data = request.get_json()
    db = mongo.cx["audiobooks_db"]
    collection = db["books"]
    result = collection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201