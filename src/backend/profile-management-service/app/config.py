from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://pmsuser:pmspass@profile-db:5432/profile_db")
