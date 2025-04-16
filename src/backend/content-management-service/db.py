from flask_pymongo import PyMongo
from config import MONGO_URI

mongo = PyMongo()

def init_db(app):
    app.config['MONGO_URI'] = MONGO_URI
    
    if not app.config['MONGO_URI']:
        raise ValueError("MONGO_URI must be set in configuration")
    
    mongo.init_app(app)
