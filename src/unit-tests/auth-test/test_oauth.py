import pytest
from unittest.mock import patch, MagicMock
from app.auth.oauth import init_oauth, google_login_redirect, google_callback_handler
@pytest.fixture
def app():
    """Mock the Flask app."""
    from flask import Flask
    app = Flask(__name__)
    return app

def test_init_oauth(app):
    """Test OAuth initialization"""
    with patch('app.auth.oauth.OAuth') as MockOAuth:
        mock_oauth = MockOAuth.return_value
        init_oauth(app)
        assert mock_oauth.register.called
        # Check if 'google' provider is registered with the correct URL
        args, kwargs = mock_oauth.register.call_args
        assert kwargs['client_id'] == 'google-client-id'
        assert kwargs['client_secret'] == 'google-client-secret'
