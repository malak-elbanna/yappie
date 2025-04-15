from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies, get_jwt
from models import User, db
from authlib.integrations.flask_client import OAuth
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
import requests
import datetime
from extensions import redis_client  
import re  
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)

oauth = None  

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if 'name' not in data or not data['name']:
        return jsonify({"error": "Name is required"}), 400

    password = data.get('password', '')
    if not validate_password(password):
        return jsonify({"error": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."}), 400

    user = User(email=data['email'], name=data['name'])
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify(message="User registered"), 201

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

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token})

@auth_bp.route('/login-admin', methods=['POST'])
def login_admin():
    data = request.get_json()
    admin = User.query.filter_by(email=data['email']).first()
    if not admin or not admin.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    if not admin.check_authority():
        return jsonify({"message": "Unauthorized access"}), 403
    token = create_access_token(identity=str(admin.id))
    return jsonify({"access_token": token}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
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
    except Exception as e:
        return jsonify({"error": "Invalid or missing token"}), 401

def init_oauth(app):
    global oauth
    oauth = OAuth(app)
    oauth.register(
        'google',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        api_base_url='https://www.googleapis.com/oauth2/v3/',
        client_kwargs={'scope': 'openid email profile'},
    )

@auth_bp.route('/google-login')
def google_login():
    redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route('/google-callback')
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.get('userinfo').json()
    email = user_info['email']
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, name=user_info.get('name', ''), password_hash=None)
        db.session.add(user)
        db.session.commit()
    access_token = create_access_token(identity=user.id)
    return redirect(f"http://localhost:5173/dashboard?token={access_token}")