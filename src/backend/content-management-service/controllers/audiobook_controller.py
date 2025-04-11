from flask import request, jsonify
from services.db import mongo
from bson.objectid import ObjectId

not_found = "audiobook not found"

def get_collection():
    db = mongo.cx["audiobooks_db"]
    return db["books"]

def get_audiobooks():
    collection = get_collection()
    result = list(collection.find())
    for audiobook in result:
        audiobook["_id"] = str(audiobook["_id"])
    return jsonify(result), 200

def get_audiobook(id):
    collection = get_collection()
    result = collection.find_one({"_id": ObjectId(id)})
    if result:
        result["_id"] = str(result["_id"])
        return jsonify(result), 200
    else:
        return jsonify({"error": not_found}), 404

def add_audiobook():
    data = request.get_json()
    collection = get_collection()
    result = collection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201

def update_audiobook(id):
    collection = get_collection()
    data = request.get_json()
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "audiobook updated"}), 200
    else:
        return jsonify({"error": not_found}), 404

def delete_audiobook(id):
    collection = get_collection()
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "audiobook deleted"}), 200
    else:
        return jsonify({"error": not_found}), 404