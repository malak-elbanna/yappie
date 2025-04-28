import pytest
import time
import requests

BOOK_ID = "67f6fff64f5a80cc372aea52"
REVIEW = "wow amazinggg"

@pytest.fixture(scope="module")
def auth_url():
    return "http://localhost:5000"

@pytest.fixture(scope="module")
def reviews_url():
    return "http://localhost:5003"

@pytest.fixture
def test_register_user(auth_url):
    email = f"testuser{int(time.time())}@example.com"
    password = f"securePassword{int(time.time())}$"
    name = "Test User"

    response = requests.post(
        f"{auth_url}/auth/register",
        json={"email": email, "name": name, "password": password}
    )
    assert response.status_code == 201
    user_data = response.json()
    yield user_data['id'], email, password, name

@pytest.fixture
def test_create_review(auth_url, reviews_url, test_register_user):
    user_id, email, password, name = test_register_user
    login_response = requests.post(
        f"{auth_url}/auth/login",
        json={"email": email, "password": password}
    )
    assert login_response.status_code == 201

    token = login_response.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}

    review_data = {
        "audiobookId": BOOK_ID,
        "userId": user_id,
        "rating": 5,
        "comment": REVIEW
    }
    review_response = requests.post(
        f"{reviews_url}/reviews",
        json=review_data,
        headers=headers
    )
    assert review_response.status_code == 201