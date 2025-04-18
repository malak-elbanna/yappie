from flask import request, jsonify
from app.models.profile import db, UserProfile

profile_not_found = "Profile not found."

def get_info(user_id):
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    
    if not profile:
        # change the new user to the real name from the other db
        profile = UserProfile(user_id=user_id, name="New User")
        db.session.add(profile)
        db.session.commit()

    return jsonify({
        "name": profile.name,
        "favorite_books": profile.favorite_books,
        "favorite_podcasts": profile.favorite_podcasts,
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
        return jsonify({"error": profile_not_found}), 404
    profile.name = updated_name
    db.session.commit()

    return jsonify({"message": "Name is updated successfully."}), 200

def remove_favorite_book(user_id):
    data = request.get_json()
    book = data.get('book')
    if not book:
        return jsonify({"error": "No book selected."}), 400
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": profile_not_found}), 404
    if profile.favorite_books and book in profile.favorite_books:
        profile.favorite_books.remove(book)
        db.session.commit()
    return jsonify({"message": f"{book} removed from favorites."}), 200

def remove_favorite_podcast(user_id):
    data = request.get_json()
    podcast = data.get('podcast')
    if not podcast:
        return jsonify({"error": "No podcast selected."}), 400
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": profile_not_found}), 404
    if profile.favorite_podcasts and podcast in profile.favorite_podcasts:
        profile.favorite_podcasts.remove(podcast)
        db.session.commit()
    return jsonify({"message": f"{podcast} removed from favorites."}), 200

def edit_bio(user_id):
    data = request.get_json()
    updated_bio = data.get('bio')
    if not updated_bio:
        return jsonify({"error": "No new bio provided."}), 400
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": profile_not_found}), 404
    profile.bio = updated_bio
    db.session.commit()
    return jsonify({"message": "Bio is updated successfully."}), 200

def add_preference(user_id):
    data = request.get_json()
    content_type = data.get('type')
    genre = data.get('genre')

    if content_type != "audiobooks":
        return jsonify({"error": "Type must be 'audiobooks'"}), 400
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": profile_not_found}), 404
    if not profile.preferences:
        profile.preferences = {}
    
    if "audiobooks" not in profile.preferences:
        profile.preferences["audiobooks"] = []
    
    if genre not in profile.preferences["audiobooks"]:
        profile.preferences["audiobooks"].append(genre)
        db.session.commit()
    
    return jsonify({"message": "New preference is added successfully."}), 200

def remove_preference(user_id):
    data = request.get_json()
    content_type = data.get('type')
    genre = data.get('genre')

    if content_type not in ["audiobooks", "podcasts"]:
        return jsonify({"error": "Type must be 'audiobooks' or 'podcasts'"}), 400
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": profile_not_found}), 404
    
    if profile.preferences and genre in profile.preferences.get(content_type, []):
        profile.preferences[content_type].remove(genre)
        db.session.commit()
        return jsonify({"message": f"{genre} removed successfully."}), 200
    else:
        return jsonify({"error": f"Failed removing {genre}."}), 404