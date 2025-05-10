from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import redis

db = SQLAlchemy()
jwt = JWTManager()

redis_client = redis.StrictRedis(host="redis", port=6379, db=0, decode_responses=True)
