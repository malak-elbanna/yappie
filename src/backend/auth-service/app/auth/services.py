from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required
from app.models.user import User
from app.core.extensions import redis_client, db
import datetime
import re
import requests
import os

def register_user(data):
    if 'name' not in data or not data['name']:
        return jsonify({"error": "Name is required"}), 400

    password = data.get('password', '')
    if not validate_password(password):
        return jsonify({
            "error": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
        }), 400

    user = User(email=data['email'], name=data['name'])
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify(message="User registered"), 201

def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={
        'name': user.name,
        'email': user.email
    })
    refresh_token = create_refresh_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_id": user.id
    }), 200

def login_admin_user(data):
    admin = User.query.filter_by(email=data['email']).first()
    if not admin or not admin.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    if not admin.check_authority():
        return jsonify({"message": "Unauthorized access"}), 403

    access_token = create_access_token(identity=str(admin.id))
    refresh_token = create_refresh_token(identity=str(admin.id))
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200

@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200

def revoke_token(request):
    try:
        jwt_identity = str(get_jwt_identity())  
        jti = get_jwt()["jti"]
        exp_timestamp = get_jwt()["exp"]
        current_timestamp = datetime.datetime.utcnow().timestamp()
        ttl = int(exp_timestamp - current_timestamp)

        redis_client.setex(f"revoked_token:{jti}", ttl, "revoked")

        response = jsonify({"message": "Successfully logged out"})
        unset_jwt_cookies(response)
        return response, 200
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({"error": "Invalid or missing token"}), 401

def validate_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True
