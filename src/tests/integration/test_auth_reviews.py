import pytest
import time
import requests

BOOK_ID = "67f6fff64f5a80cc372aea52"
REVIEW = "wow amazinggg"
email = f"testuser{int(time.time())}@example.com"
password = "securePassword123$"

@pytest.fixture(scope="module")
def auth_url():
    return "http://localhost:5000"

@pytest.fixture(scope="module")
def reviews_url():
    return "http://localhost:5003"

def test_register_user(auth_url):
    name = "Test User"
    response = requests.post(
        f"{auth_url}/auth/register",
        json={"email": email, "name": name, "password": password}
    )
    assert response.status_code == 201


def test_review_creation(auth_url, reviews_url):
    login_res = requests.post(
        f"{auth_url}/auth/login",
        json={
            "email": email,
            "password": password
        }
    )
    assert login_res.status_code == 200
    token = login_res.json()['access_token']
    user_id = login_res.json()['user_id']

    review_res = requests.post(
        f"{reviews_url}/reviews",
        json={
            "audiobookId": BOOK_ID,
            "userId": user_id,
            "rating": 5,
            "comment": REVIEW
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert review_res.status_code == 201
    
    review_data = review_res.json()
    assert review_data['message'] == "Review added"