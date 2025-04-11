from flask import request, jsonify, render_template, redirect, url_for
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
    return render_template("home.html", result=result)

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
    # Get the data from the form
    data = request.form

    # Prepare the updated data dictionary with all the fields
    updated_data = {
        "title": data.get("title"),
        "author": data.get("author"),
        "description": data.get("description"),
        "language": data.get("language"),
        "url_rss": data.get("url_rss"),
        "url_librivox": data.get("url_librivox"),
        "totaltime": data.get("totaltime"),
        "cover_url": data.get("cover_url"),
        "chapters": data.get("chapters"),
        "category": data.get("category")
    }

    # Update the audiobook in the database using the provided ID
    collection = get_collection()
    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_data}
    )

    # Redirect to the route that displays all audiobooks or the updated book's detail page
    return redirect(url_for('audiobook_bp.get_audiobooks'))

def delete_audiobook(id):
    collection = get_collection()
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "audiobook deleted"}), 200
    else:
        return jsonify({"error": not_found}), 404

def get_audiobook_update(id):
    collection = get_collection()
    book = collection.find_one({"_id": ObjectId(id)})
    if book:
        return render_template('updateBook.html', book=book)
    else:
        return "Book not found", 404