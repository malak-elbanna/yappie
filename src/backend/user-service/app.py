import os
from flask import Flask, jsonify, request, send_from_directory
from flask_pymongo import PyMongo
from pymongo import MongoClient
from extensions import jwt, redis_client  
from auth import auth_bp, init_oauth  
from flask_cors import CORS
from dotenv import load_dotenv  
import random
from werkzeug.utils import secure_filename
from bson import ObjectId

load_dotenv()

# Configure upload settings
UPLOAD_FOLDER = 'uploads/covers'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

# Configure upload settings
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

mongo_uri = os.getenv('MONGODB_URI')
print(f"Attempting to connect to MongoDB with URI: {mongo_uri}")

try:
    # Connect using pymongo directly first to test
    client = MongoClient(mongo_uri)
    client.admin.command('ping')
    print("Successfully pinged MongoDB!")
    
    # Get the audiobooks_db database
    db = client.audiobooks_db
    print(f"Connected to database: {db.name}")
    
    # If connection successful, set up Flask-PyMongo
    app.config['MONGO_URI'] = mongo_uri
    app.config['MONGO_DBNAME'] = 'audiobooks_db'  # Specify the database name
    mongo = PyMongo(app)
    print("Flask-PyMongo setup complete!")
except Exception as e:
    print(f"Error connecting to MongoDB: {str(e)}")
    raise e

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'secret-key')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'unique-and-secret-key')

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

@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        # Test MongoDB connection using the global client
        db_names = client.list_database_names()
        collections = db.list_collection_names()
        books_count = db.books.count_documents({})
        
        return jsonify({
            "connection": "success",
            "databases": db_names,
            "collections": collections,
            "books_count": books_count,
            "current_database": db.name
        })
    except Exception as e:
        print(f"Database Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/list-books', methods=['GET'])
def list_books():
    try:
        books_collection = db.books
        all_books = list(books_collection.find({}))
        
        # Convert ObjectId to string for each book
        for book in all_books:
            book['_id'] = str(book['_id'])
            
        return jsonify({
            "total_books": len(all_books),
            "books": all_books
        })
    except Exception as e:
        print(f"Error listing books: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/random-books', methods=['GET'])
def get_random_books():
    try:
        books_collection = db.books
        all_books = list(books_collection.find({}))  # Include _id
        
        if not all_books:
            # Return empty list if no books found
            return jsonify([])
        
        # Convert ObjectId to string for each book
        for book in all_books:
            book['_id'] = str(book['_id'])
            
        # Select 5 random books or all books if less than 5
        random_books = random.sample(all_books, min(5, len(all_books)))
        
        return jsonify(random_books)
    except Exception as e:
        print(f"Error fetching books: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route('/api/books/<book_id>', methods=['GET'])
def get_book_details(book_id):
    try:
        # Convert string ID to ObjectId
        book = db.books.find_one({'_id': ObjectId(book_id)})
        
        if not book:
            return jsonify({"error": "Book not found"}), 404
            
        # Convert ObjectId to string for JSON serialization
        book['_id'] = str(book['_id'])
        
        # Add default values for missing fields
        book_data = {
            'title': book.get('title', ''),
            'author': book.get('author', ''),
            'description': book.get('description', ''),
            'category': book.get('category', ''),
            'language': book.get('language', ''),
            'totaltime': book.get('totaltime', ''),
            'url_librivox': book.get('url_librivox', ''),
            'url_rss': book.get('url_rss', ''),
            'cover_url': book.get('cover_url', None),
            'chapters': book.get('chapters', []),
            'ratings': {
                'average': 4.3,  # You can replace with actual rating calculation
                'total': 1283,   # You can replace with actual count
                'story': 4.2,    # You can replace with actual rating
                'narration': 4.5 # You can replace with actual rating
            },
            'narrator': book.get('narrator', 'Steve Higgins'),  # Replace with actual narrator field
            'publisher': book.get('publisher', 'Bloomsbury')    # Replace with actual publisher field
        }
        
        return jsonify(book_data)
    except Exception as e:
        print(f"Error fetching book details: {str(e)}")
        return jsonify({"error": str(e)}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/covers/<filename>')
def serve_cover(filename):
    """Serve uploaded cover images"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/books/<book_id>/cover', methods=['POST'])
def upload_cover(book_id):
    """Upload a cover image for a specific book"""
    try:
        if 'cover' not in request.files:
            return jsonify({"error": "No cover file provided"}), 400
            
        file = request.files['cover']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        # Create a secure filename using book_id and original extension
        extension = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{book_id}.{extension}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(filepath)
        
        # Update the book record with the cover URL
        cover_url = f"/uploads/covers/{filename}"
        db.books.update_one(
            {'_id': ObjectId(book_id)},
            {'$set': {'cover_url': cover_url}}
        )
        
        return jsonify({
            "message": "Cover uploaded successfully",
            "cover_url": cover_url
        })
    except Exception as e:
        print(f"Error uploading cover: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'True') == 'True', host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
