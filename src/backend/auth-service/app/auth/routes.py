from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, unset_jwt_cookies
from .services import register_user, login_user, login_admin_user, revoke_token, validate_password
from .oauth import oauth, google_login_redirect, google_callback_handler

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return register_user(request.get_json())

@auth_bp.route('/login', methods=['POST'])
def login():
    return login_user(request.get_json())

@auth_bp.route('/login-admin', methods=['POST'])
def login_admin():
    return login_admin_user(request.get_json())

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return revoke_token(request)

@auth_bp.route('/google-login')
def google_login():
    return google_login_redirect()

@auth_bp.route('/google-callback')
def google_callback():
    return google_callback_handler()
