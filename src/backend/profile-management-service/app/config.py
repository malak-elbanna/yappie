from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:password@profile-db:5432/profile_db")
