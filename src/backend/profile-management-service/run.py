from app import create_app
from app.config import HOST, PORT, DEBUG
from app.models.profile import db
import logging
import json_log_formatter
import os

os.makedirs('/var/log/profile-service', exist_ok=True)

formatter = json_log_formatter.JSONFormatter()
json_handler = logging.StreamHandler()
json_handler.setFormatter(formatter)

file_handler = logging.FileHandler('/var/log/profile-service/app.log')
file_handler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(json_handler)
logger.addHandler(file_handler)
logger.setLevel(logging.INFO)

app = create_app()
with app.app_context():
    db.create_all()

@app.route('/health', methods=['GET'])
def health_check():
    return {"message": "Service is running"}, 200

logging.info("Profile Management Service started")

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
