import os
from flask import Flask
from flask_migrate import Migrate
from app.core.extensions import db, jwt, redis_client  
from app.auth.routes import auth_bp
from app.core.config import PORT
from app.auth.oauth import init_oauth
from flask_cors import CORS
from dotenv import load_dotenv  
import logging
import json_log_formatter
import sys
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware

load_dotenv()

os.makedirs('/var/log/auth-service', exist_ok=True)

formatter = json_log_formatter.JSONFormatter()
json_handler = logging.StreamHandler()
json_handler.setFormatter(formatter)

file_handler = logging.FileHandler('/var/log/auth-service/app.log')
file_handler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(json_handler)
logger.addHandler(file_handler)
logger.setLevel(logging.INFO)

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'postgresql://postgres:password@localhost:5432/user_db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'secret-key')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'unique-and-secret-key')

db.init_app(app)  
jwt.init_app(app) 
migrate = Migrate(app, db)  
init_oauth(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return redis_client.get(f"revoked_token:{jti}") is not None  

app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/health', methods=['GET'])
def health_check():
    return {"message": "User Service is running"}, 200

app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

logging.info("Auth Service started")

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'True') == 'True', host='0.0.0.0', port=PORT)
