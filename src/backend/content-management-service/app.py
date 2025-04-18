from flask import Flask
from flask_cors import CORS
from routes.audiobook_routes import audiobook_bp
from services.db import init_db
from config import HOST, PORT, DEBUG, MONGO_URI, SECRET_KEY

app = Flask(__name__)

app.config.update(
    SECRET_KEY=SECRET_KEY,
    MONGO_URI=MONGO_URI,
    HOST=HOST,
    PORT=PORT,
    DEBUG=DEBUG
)

CORS(app)
init_db(app)

app.register_blueprint(audiobook_bp)

@app.route('/health', methods=['GET'])
def health_check():
    return {"message": "CMS is running"}, 200


if __name__ == '__main__':
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])