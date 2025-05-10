import sys
import os
import pytest
from unittest.mock import MagicMock
from flask import Flask

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

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
    import controllers.audiobook_controller as controller
    monkeypatch.setattr(controller, "mongo", fake_mongo)

@pytest.fixture
def app():
    test_dir = os.path.dirname(os.path.abspath(__file__))
    
    template_folder = os.path.abspath(os.path.join(test_dir, '..', 'templates'))
    
    print(f"Looking for templates in: {template_folder}")
    
    app = Flask(__name__, template_folder=template_folder)
    app.config['TESTING'] = True
    app.config['SERVER_NAME'] = 'localhost'  
    
    @app.route('/audiobooks')
    def audiobooks():
        pass
        
    @app.route('/audiobooks/<id>')
    def audiobook_details(id):
        pass
    
    
    with app.app_context(): 
        yield app  
@pytest.fixture
def mock_render_template(monkeypatch):
    mock = MagicMock(return_value='mocked_template')
    import flask
    monkeypatch.setattr(flask, 'render_template', mock)
    return mock

@pytest.fixture
def mock_url_for(monkeypatch):
    def fake_url_for(endpoint, **kwargs):
        return f"/fake/{endpoint}"
    
    import flask
    monkeypatch.setattr(flask, 'url_for', fake_url_for)