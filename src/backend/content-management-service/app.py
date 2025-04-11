from flask import Flask
from flask_cors import CORS
from routes.audiobook_routes import audiobook_bp
from services.db import init_db
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# More comprehensive CORS configuration
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb+srv://salmaayman:LgFYRUMZ3iuGPyzD@cluster0.ufjw6qu.mongodb.net/?retryWrites=true&w=majority")

init_db(app)
app.register_blueprint(audiobook_bp)

@app.route('/health', methods=['GET'])
def health_check():
    return {"message": "CMS is running"}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)