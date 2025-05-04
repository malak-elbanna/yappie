import os
from dotenv import load_dotenv
from app.core.extensions import db
from flask_bcrypt import generate_password_hash
from app.models.user import User
from main import app
import logging

load_dotenv()

def create_admin():
    with app.app_context():
        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")
        admin_name = os.getenv("ADMIN_NAME", "Admin")

        if not admin_email or not admin_password:
            print("wrong credentials")
            return

        if User.query.filter_by(email=admin_email).first():
            print("admin exists")
            return

        hashed_password = generate_password_hash(admin_password).decode("utf-8")
        admin = User(
            email=admin_email,
            password_hash=hashed_password,
            name=admin_name,
            admin=True
        )
        db.session.add(admin)
        db.session.commit()
        print("admin created")
        
        logging.info("Adming created", extra={"user_id": admin.id})

if __name__ == "__main__":
    create_admin()
