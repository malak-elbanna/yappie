from flask import request, jsonify
from app.models.profile import db, UserProfile
from app.services.MQ import channel
import logging

profile_not_found = "Profile not found."

def get_info(user_id):
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    
    if not profile:
        # change the new user to the real name from the other db
        profile = UserProfile(user_id=user_id, name="New User")
        db.session.add(profile)
        db.session.commit()

    logging.info("User info retrieved", extra={"user_id": str(user_id)})
    return jsonify({
        "name": profile.name,
        "favorite_books": profile.favorite_books,
        "bio": profile.bio,
        "preferences": profile.preferences,
    })

def edit_name(user_id):
    data = request.get_json()

    updated_name = data.get('name')
    if not updated_name:
        return jsonify({"error": "New name is required."}), 400
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        logging.info("User profile isn't found", extra={"user_id": str(user_id)})
        return jsonify({"error": profile_not_found}), 404
    profile.name = updated_name
    db.session.commit()

    logging.info("User name edited", extra={"user_id": str(user_id)})
    return jsonify({"message": "Name is updated successfully."}), 200

def remove_favorite_book(user_id):
    data = request.get_json()
    book_cover = data.get('book_cover')
    if not book_cover:
        return jsonify({"error": "No book selected."}), 400
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        logging.info("User profile isn't found", extra={"user_id": str(user_id)})
        return jsonify({"error": profile_not_found}), 404
    
    if book_cover in profile.favorite_books:
        profile.favorite_books.remove(book_cover)
        db.session.commit()
    logging.info("Favorite book removed", extra={"user_id": str(user_id)})
    return jsonify({"message": f"{book_cover} removed from favorites."}), 200

def add_favorite_book(user_id):
    data = request.get_json()
    book_cover = data.get('book_cover')
    if not book_cover:
        return jsonify({"error": "No book selected."}), 400
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        logging.info("User profile isn't found", extra={"user_id": str(user_id)})
        return jsonify({"error": profile_not_found}), 404
    if profile.favorite_books is None:
        profile.favorite_books = []
    
    if book_cover not in profile.favorite_books:
        profile.favorite_books.append(book_cover)
        db.session.commit()
        logging.info("Favorite book added", extra={
            "user_id": str(user_id),
            "favorites_count": len(profile.favorite_books)
        })
        return jsonify({"message": f"{book_cover} added to favorites"}), 200
    else:
        return jsonify({"message": f"{book_cover} is already in favorites"}), 200

def get_favorite_books(user_id):
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        logging.info("User profile is not found", extra={"user_id": str(user_id)})
        return jsonify({"error": profile_not_found}), 404
    return jsonify({
        "favorite_books": profile.favorite_books
    }), 200

def edit_bio(user_id):
    data = request.get_json()
    updated_bio = data.get('bio')
    if not updated_bio:
        return jsonify({"error": "No new bio provided."}), 400
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        logging.info("User profile isn't found", extra={"user_id": str(user_id)})
        return jsonify({"error": profile_not_found}), 404
    profile.bio = updated_bio
    db.session.commit()

    logging.info("User bio edited", extra={"user_id": str(user_id)})
    return jsonify({"message": "Bio is updated successfully."}), 200

def add_preference(user_id):
    try:
        data = request.get_json()
        content_type = data.get('type')
    
        genre = data.get('genre')
        email = data.get('email')
        if not email:
            return jsonify({"error": "No email."}), 400

        if content_type != "audiobooks":
            return jsonify({"error": "Type must be 'audiobooks'"}), 400
    
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            logging.info("User profile isn't found", extra={"user_id": str(user_id)})
            return jsonify({"error": profile_not_found}), 404
        if not profile.preferences:
            profile.preferences = {}
    
        if "audiobooks" not in profile.preferences:
            profile.preferences["audiobooks"] = []
    
        if genre not in profile.preferences["audiobooks"]:
            profile.preferences["audiobooks"].append(genre)
            logging.info('message: ' + genre)
            channel.basic_publish(exchange='jobs',routing_key='BIND',body=email + '/' + genre.lower())
            db.session.commit()
    
        logging.info("New preference added", extra={"user_id": str(user_id)})
        return jsonify({"message": "New preference is added successfully."}), 200
    except:
        return jsonify({"message": "error occurred"}), 400

def remove_preference(user_id):
    data = request.get_json()
    content_type = data.get('type')
    genre = data.get('genre')

    if content_type not in ["audiobooks", "podcasts"]:
        return jsonify({"error": "Type must be 'audiobooks' or 'podcasts'"}), 400
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        logging.info("User profile isn't found", extra={"user_id": str(user_id)})
        return jsonify({"error": profile_not_found}), 404
    
    if profile.preferences and genre in profile.preferences.get(content_type, []):
        profile.preferences[content_type].remove(genre)
        db.session.commit()

        logging.info("Preference removed", extra={"user_id": str(user_id)})
        return jsonify({"message": f"{genre} removed successfully."}), 200
    else:
        logging.info("Failed to remove preference", extra={"user_id": str(user_id)})
        return jsonify({"error": f"Failed removing {genre}."}), 404