from authlib.integrations.flask_client import OAuth
import os
from app.core.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from flask_jwt_extended import create_access_token, create_refresh_token

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
    from app.models.user import User
    from app.core.extensions import db
    from flask import redirect
    from flask_jwt_extended import create_access_token, create_refresh_token

    token = oauth.google.authorize_access_token()
    user_info = oauth.google.get('userinfo').json()
    email = user_info['email']

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, name=user_info.get('name', ''), password_hash=None)
        db.session.add(user)
        db.session.commit()

    user_id = str(user.id)
    access_token = create_access_token(identity=str(user.id), additional_claims={
        'name': user.name,
        'email': user.email
    })
    refresh_token = create_refresh_token(identity=user_id)
    
    return redirect(f"http://localhost:5173/dashboard?access_token={access_token}&refresh_token={refresh_token}")
