import sys
import os
import pytest
from unittest.mock import MagicMock
from flask import Flask

# Add project root to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

# Create a fake MongoDB client fixture
@pytest.fixture(autouse=True)
def mock_mongo(monkeypatch):
    class FakeMongo:
        def __init__(self):
            self.cx = {
                "audiobooks_db": {
                    "audiobooks": MagicMock()
                }
            }
    fake_mongo = FakeMongo()
    # Patch the 'mongo' object used in your controller
    import controllers.audiobook_controller as controller
    monkeypatch.setattr(controller, "mongo", fake_mongo)

# Create a fixture for Flask app setup with the correct template folder
@pytest.fixture
def app():
    # Get the absolute path of the test file's directory
    test_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Navigate up one level from tests to content-management-service, then to templates
    template_folder = os.path.abspath(os.path.join(test_dir, '..', 'templates'))
    
    # Print path for debugging
    print(f"Looking for templates in: {template_folder}")
    
    app = Flask(__name__, template_folder=template_folder)
    app.config['TESTING'] = True
    app.config['SERVER_NAME'] = 'localhost'  # Add this line to help with URL building
    
    # Register routes that might be used by url_for in your code
    @app.route('/audiobooks')
    def audiobooks():
        pass
        
    @app.route('/audiobooks/<id>')
    def audiobook_details(id):
        pass
    
    # Add any other routes your code might be using with url_for
    
    with app.app_context():  # This ensures the app context is active for url_for
        yield app  # Flask app is yielded here

# Mock render_template completely to avoid template loading
@pytest.fixture
def mock_render_template(monkeypatch):
    mock = MagicMock(return_value='mocked_template')
    import flask
    monkeypatch.setattr(flask, 'render_template', mock)
    return mock

# Mock url_for to prevent routing errors
@pytest.fixture
def mock_url_for(monkeypatch):
    def fake_url_for(endpoint, **kwargs):
        # Just return a fake URL that includes the endpoint
        return f"/fake/{endpoint}"
    
    import flask
    monkeypatch.setattr(flask, 'url_for', fake_url_for)