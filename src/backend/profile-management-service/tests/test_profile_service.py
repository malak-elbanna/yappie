import pytest
from unittest.mock import patch, MagicMock
import requests
import json
from concurrent.futures import ThreadPoolExecutor

USER_ID = "123"
NEW_NAME = "Updated User"
NEW_BIO = "This is my updated bio."
BOOK_TITLE = "The Great Adventure"
PREFERENCE = {"type": "audiobooks", "genre": "Fantasy"}
INVALID_TOKEN = "invalid_token_123"

@pytest.fixture(scope="module")
def profile_url():
    return "http://localhost:5005"

@pytest.fixture(scope="module")
def auth_token():
    return {
        "user_id": USER_ID,
        "headers": {"Authorization": "Bearer your_valid_token"}
    }

@pytest.fixture
def mock_requests():
    with patch('requests.get') as mock_get, \
         patch('requests.put') as mock_put:
        yield mock_get, mock_put


def test_empty_name(mock_requests, auth_token, profile_url):
    _, mock_put = mock_requests
    
    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.json.return_value = {"error": "Name cannot be empty"}
    mock_put.return_value = mock_response
    
    response = requests.put(
        f"{profile_url}/{auth_token['user_id']}/edit-name",
        json={"name": ""}, 
        headers=auth_token['headers']
    )
    
    assert response.status_code == 400
    assert "error" in response.json()

def test_null_bio(mock_requests, auth_token, profile_url):
    _, mock_put = mock_requests
    
    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.json.return_value = {"error": "Bio cannot be null"}
    mock_put.return_value = mock_response
    
    response = requests.put(
        f"{profile_url}/{auth_token['user_id']}/edit-bio",
        json={"bio": None},  
        headers=auth_token['headers']
    )
    
    assert response.status_code == 400
    assert "error" in response.json()

# Invalid Authentication
def test_invalid_token(mock_requests, profile_url):
    mock_get, _ = mock_requests
    
    mock_response = MagicMock()
    mock_response.status_code = 401
    mock_response.json.return_value = {"error": "Invalid token"}
    mock_get.return_value = mock_response
    
    invalid_headers = {"Authorization": f"Bearer {INVALID_TOKEN}"}
    response = requests.get(
        f"{profile_url}/{USER_ID}",
        headers=invalid_headers
    )
    
    assert response.status_code == 401
    assert response.json()['error'] == "Invalid token"

def test_rate_limiting(mock_requests, auth_token, profile_url):
    mock_get, _ = mock_requests
    
    mock_response = MagicMock()
    mock_response.status_code = 429
    mock_response.json.return_value = {"error": "Too many requests"}
    mock_get.return_value = mock_response
    
    response = requests.get(
        f"{profile_url}/{auth_token['user_id']}",
        headers=auth_token['headers']
    )
    
    assert response.status_code == 429
    assert "error" in response.json()

def test_concurrent_requests(mock_requests, auth_token, profile_url):
    mock_get, _ = mock_requests
    
    mock_responses = [
        MagicMock(status_code=200, json=lambda: {"name": f"User{i}"})
        for i in range(5)
    ]
    mock_get.side_effect = mock_responses
    
    def make_request(i):
        return requests.get(
            f"{profile_url}/{auth_token['user_id']}",
            headers=auth_token['headers']
        )
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(make_request, i) for i in range(5)]
        results = [f.result() for f in futures]
    
    assert len(results) == 5
    assert all(r.status_code == 200 for r in results)
    assert mock_get.call_count == 5


