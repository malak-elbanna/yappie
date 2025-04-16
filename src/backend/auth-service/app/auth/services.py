from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies
from models import User, db
from app.core.extensions import redis_client
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

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token}), 200

def login_admin_user(data):
    admin = User.query.filter_by(email=data['email']).first()
    if not admin or not admin.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    if not admin.check_authority():
        return jsonify({"message": "Unauthorized access"}), 403

    token = create_access_token(identity=str(admin.id))
    return jsonify({"access_token": token}), 200

def revoke_token(request):
    try:
        jwt_identity = get_jwt_identity()
        jti = get_jwt()["jti"]
        exp_timestamp = get_jwt()["exp"]
        current_timestamp = datetime.datetime.utcnow().timestamp()
        ttl = int(exp_timestamp - current_timestamp)

        redis_client.setex(f"revoked_token:{jti}", ttl, "revoked")

        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            oauth_token = auth_header.split(" ")[1]
            requests.post(
                'https://oauth2.googleapis.com/revoke',
                params={'token': oauth_token},
                headers={'content-type': 'application/x-www-form-urlencoded'}
            )

        response = jsonify({"message": "Successfully logged out"})
        unset_jwt_cookies(response)
        return response, 200
    except Exception:
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
