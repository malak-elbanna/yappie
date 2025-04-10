import os
from flask import Flask, jsonify
from flask_pymongo import PyMongo
from extensions import jwt, redis_client  
from auth import auth_bp, init_oauth  
from flask_cors import CORS
from dotenv import load_dotenv  
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = os.getenv('MONGODB_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'secret-key')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'unique-and-secret-key')

mongo = PyMongo(app)
jwt.init_app(app) 
init_oauth(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return redis_client.get(f"revoked_token:{jti}") is not None  

app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/health', methods=['GET'])
def health_check():
    return {"message": "User Service is running"}, 200

@app.route('/api/random-books', methods=['GET'])
def get_random_books():
    try:
        # Get all books from MongoDB
        books_collection = mongo.db.books
        all_books = list(books_collection.find({}, {'_id': 0}))  # Exclude MongoDB _id
        
        if not all_books:
            # Return empty list if no books found
            return jsonify([])
        
        # Select 5 random books or all books if less than 5
        random_books = random.sample(all_books, min(5, len(all_books)))
        
        return jsonify(random_books)
    except Exception as e:
        print(f"Error fetching books: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'True') == 'True', host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
