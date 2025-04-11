from flask_pymongo import PyMongo

mongo = PyMongo()

def init_db(app):
    app.config["MONGO_URI"] = "mongodb+srv://salmaayman:LgFYRUMZ3iuGPyzD@cluster0.ufjw6qu.mongodb.net/yappie?retryWrites=true&w=majority"
    mongo.init_app(app)
