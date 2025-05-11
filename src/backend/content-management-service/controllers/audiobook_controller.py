import json
from flask import request, jsonify, render_template, redirect, url_for
from services.db import mongo
from services.Minio_upload import *
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from gridfs import GridFS
import logging
import os
from services.MQ import channel





ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'm4a', 'mp3'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

not_found = "audiobook not found"

def get_collection():
    db = mongo.cx["audiobooks_db"]
    return db["books"]

def add_page():
    return render_template("addBook.html")

def get_audiobooks():
    collection = get_collection()
    result = list(collection.find())
    for audiobook in result:
        audiobook["_id"] = str(audiobook["_id"])
    return render_template("home.html", result=result)

from bson.errors import InvalidId

def get_audiobook(id):
    collection = get_collection()
    try:
        obj_id = ObjectId(id)
    except InvalidId:
        return jsonify({"error": f"'{id}' is not a valid ObjectId"}), 400

    result = collection.find_one({"_id": obj_id})
    if result:
        result["_id"] = str(result["_id"])
        return jsonify(result), 200
    else:
        return jsonify({"error": not_found}), 404

def add_audiobook():
    db = mongo.cx["audiobooks_db"]
    fs = GridFS(db)
    
    id = db.books.count_documents({}) + 1
    
    data = request.form.to_dict()
    files = request.files
    if 'cover_image' in files:
        cover_image = files['cover_image']
        if cover_image and allowed_file(cover_image.filename):
            MinioUpload('audiobooks',str(id) + os.path.splitext(cover_image.filename)[1] ,cover_image)
            data['cover_url'] ='http://localhost:9000/audiobooks/'+str(id) + os.path.splitext(cover_image.filename)[1]
    if 'audio_file' in files:
        audio_file = files['audio_file']
        if audio_file and allowed_file(audio_file.filename):
            
            # audio_id = fs.put(audio_file, filename=secure_filename(audio_file.filename))
            # size = os.fstat(audio_file.fileno()).st_size
            
            hls_export_upload(audio_file,str(id))

            data['audio_url'] = 'http://localhost:9000/audiobooks/'+str(id)+'.m3u8'

    result = db.books.insert_one(data)
    if not data.get('category'): data['category'] = ''
    routing_key = f"{data['author']}.{data['category']}.{data['language']}".lower()
    channel.basic_publish(exchange='notifications',routing_key=routing_key,body=data['title'])
    logging.info("Audiobook added", extra={"audiobook_id": str(result.inserted_id)})
    return jsonify({"_id": str(result.inserted_id)}), 201

def update_audiobook(id):
    db = mongo.cx["audiobooks_db"]
    fs = GridFS(db)

    data = request.get_json()
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
    logging.info("Audiobook updated", extra={"audiobook_id": str(id)})
    return jsonify({"message": "audiobook updated"}), 200


def delete_audiobook(id):
    collection = get_collection()
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        logging.info("Audiobook deleted", extra={"audiobook_id": str(id)})
        return jsonify({"message": "audiobook deleted"}), 200
    else:
        logging.error("Failed to delete audiobook", extra={"audiobook_id": str(id)})
        return jsonify({"error": not_found}), 404

def get_audiobook_update(id):
    collection = get_collection()
    book = collection.find_one({"_id": ObjectId(id)})
    if book:
        return render_template('updateBook.html', book=book)
    else:
        return "Book not found", 404

def update_chapter(id):
    collection = get_collection()
    data = request.get_json()
    try:
        result = collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {f"chapters.{data['chapterIndex']}.title": data['title']}}
        )
        if result.modified_count:
            logging.info("Chapter updated", extra={"chapter_id": str(id)})
            return jsonify({"message": "chapter updated"}), 200
        else:
            logging.error("Failed to update chapter", extra={"chapter_id": str(id)})
            return jsonify({"error": "failed to update chapter"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500