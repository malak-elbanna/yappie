from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:password@profile-db:5432/profile_db")
DEBUG = os.getenv('DEBUG', 'TRUE')
PORT = int(os.getenv('PORT', '5001'))
HOST = os.getenv('HOST', '0.0.0.0')