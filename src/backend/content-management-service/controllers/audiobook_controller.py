import json
from flask import request, jsonify, render_template, redirect, url_for
from services.db import mongo
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from gridfs import GridFS
from config import DATABASE_NAME, COLLECTION

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'm4a', 'mp3'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

not_found = "audiobook not found"

def get_collection():
    db = mongo.cx[DATABASE_NAME]
    return db[COLLECTION]

def add_page():
    return render_template("addBook.html")

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
    db = mongo.cx[DATABASE_NAME]
    fs = GridFS(db)

    data = request.form.to_dict()
    files = request.files
    if 'cover_image' in files:
        cover_image = files['cover_image']
        if cover_image and allowed_file(cover_image.filename):
            cover_id = fs.put(cover_image, filename=secure_filename(cover_image.filename))
            data['cover_id'] = str(cover_id) 
    if 'audio_file' in files:
        audio_file = files['audio_file']
        if audio_file and allowed_file(audio_file.filename):
            audio_id = fs.put(audio_file, filename=secure_filename(audio_file.filename))
            data['audio_id'] = str(audio_id)
    result = db.books.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201


def update_audiobook(id):
    db = mongo.cx[DATABASE_NAME]
    fs = GridFS(db)

    data = request.form.to_dict()
    files = request.files
    if 'cover_image' in files:
        cover_image = files['cover_image']
        if cover_image and allowed_file(cover_image.filename):
            cover_id = fs.put(cover_image, filename=secure_filename(cover_image.filename))
            data['cover_id'] = str(cover_id) 

    if 'audio_file' in files:
        audio_file = files['audio_file']
        if audio_file and allowed_file(audio_file.filename):
            audio_id = fs.put(audio_file, filename=secure_filename(audio_file.filename))
            data['audio_id'] = str(audio_id)
    
    db.books.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "audiobook updated"}), 200


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