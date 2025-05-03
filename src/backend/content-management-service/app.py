from flask import Flask
from flask_cors import CORS
from routes.audiobook_routes import audiobook_bp
from services.db import init_db
from config import HOST, PORT, DEBUG, MONGO_URI, SECRET_KEY
import logging
import json_log_formatter
import os
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware

os.makedirs('/var/log/cms-service', exist_ok=True)

formatter = json_log_formatter.JSONFormatter()
json_handler = logging.StreamHandler()
json_handler.setFormatter(formatter)

file_handler = logging.FileHandler('/var/log/cms-service/app.log')
file_handler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(json_handler)
logger.addHandler(file_handler)
logger.setLevel(logging.INFO)

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

app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

logging.info("Content Management Service started")

if __name__ == '__main__':
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])