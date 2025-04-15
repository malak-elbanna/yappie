from authlib.integrations.flask_client import OAuth
import os
from app.core.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

oauth = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    oauth.register(
        'google',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        api_base_url='https://www.googleapis.com/oauth2/v3/',
        client_kwargs={'scope': 'openid email profile'},
    )

def google_login_redirect():
    redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')
    return oauth.google.authorize_redirect(redirect_uri)

def google_callback_handler():
    from models.user import User, db
    from flask import redirect
    from flask_jwt_extended import create_access_token

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
