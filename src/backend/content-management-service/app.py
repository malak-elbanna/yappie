from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from routes.audiobook_routes import audiobook_bp
from services.db import init_db
from dotenv import load_dotenv
import os


load_dotenv(dotenv_path="c:/Users/Dell/yappie2/yappie/src/frontend/.env")

app = Flask(__name__)

# More comprehensive CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:5173",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Configure MongoDB URI
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb+srv://mernazalat:6iWYsts5MnAVwYLb@cluster0.ufjw6qu.mongodb.net/audiobooks_db?retryWrites=true&w=majority")

# Initialize Flask-PyMongo
mongo = PyMongo(app)
db = mongo.db



@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        # Fetch unique categories from the database
        categories = db.books.distinct("category")
        return jsonify({"categories": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/books', methods=['GET'])
def get_books_by_category():
    try:
        category = request.args.get('category')  # Get the category from query params
        books = list(db.books.find({"category": category}, {"_id": 1, "title": 1, "author": 1, "category": 1}))
        return jsonify({"books": books}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

init_db(app)
app.register_blueprint(audiobook_bp, url_prefix="/api/content")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)