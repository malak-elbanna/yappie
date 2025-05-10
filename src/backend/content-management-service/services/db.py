from flask_pymongo import PyMongo
from config import MONGO_URI

mongo = PyMongo()

def init_db(app):
    app.config["MONGO_URI"] = MONGO_URI
    mongo.init_app(app)