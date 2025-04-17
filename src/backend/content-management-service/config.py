import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY', 'secure_secret_key')
DEBUG = os.getenv('DEBUG', 'TRUE')
PORT = int(os.getenv('PORT', '5001'))
HOST = os.getenv('HOST', '0.0.0.0')
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'audiobooks_db')
COLLECTION = os.getenv('COLLECTION', 'books')