from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY, JSON

db = SQLAlchemy()

class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    favorite_books = db.Column(ARRAY(db.String), default=[])
    favorite_podcasts = db.Column(ARRAY(db.String), default=[])
    bio = db.Column(db.Text, default="")
    preferences = db.Column(JSON, default={})
