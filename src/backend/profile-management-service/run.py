from app import create_app
from app.config import HOST, PORT, DEBUG

app = create_app()

@app.route('/health', methods=['GET'])
def health_check():
    return {"message": "Service is running"}, 200

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
