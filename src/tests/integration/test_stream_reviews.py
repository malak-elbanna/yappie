import pytest
import requests
import time

BOOK_ID = "67f6fff64f5a80cc372aea52"
CHAPTER_INDEX = 1
REVIEW = "wow amazinggg"

@pytest.fixture(scope="module")
def auth_url():
    return "http://localhost:5000"

@pytest.fixture(scope="module")
def reviews_url():
    return "http://localhost:5003"

@pytest.fixture(scope="module")
def stream_url():
    return "http://localhost:8080"

@pytest.fixture
def test_user(auth_url):
    email = f"exampleuser1{int(time.time())}@example.com"
    password = "securePassword1$2"
    name = "Test user"

    reg_res = requests.post(
        f"{auth_url}/auth/register",
        json={"email": email, "name": name, "password": password}
    )
    assert reg_res.status_code == 201
    
    return {"email": email, "password": password}

@pytest.fixture
def auth_token(test_user, auth_url):
    login_res = requests.post(
        f"{auth_url}/auth/login",
        json={"email": test_user['email'], "password": test_user['password']}
    )
    assert login_res.status_code == 200
    data = login_res.json()

    assert 'access_token' in data
    assert 'user_id' in data
    
    return {
        "token": data['access_token'],
        "user_id": data['user_id'],
        "headers": {"Authorization": f"Bearer {data['access_token']}"}
    }

def test_get_books(auth_token, stream_url):
    res = requests.get(
        f"{stream_url}/books",
        headers=auth_token['headers']
    )
    assert res.status_code == 200

def test_playback(auth_token, stream_url):
    res_save = requests.post(
        f"{stream_url}/playback/{auth_token['user_id']}/{BOOK_ID}/{CHAPTER_INDEX}",
        json={"position": 1},
        headers=auth_token['headers']
    )
    assert res_save.status_code == 200
    
    res_get = requests.get(
        f"{stream_url}/playback/{auth_token['user_id']}/{BOOK_ID}/{CHAPTER_INDEX}",
        headers=auth_token['headers']
    )
    assert res_get.status_code == 200

def test_download(auth_token, stream_url):
    res = requests.get(
        f"{stream_url}/download/{BOOK_ID}/{CHAPTER_INDEX}",
        headers=auth_token['headers']
    )
    assert res.status_code == 200

def test_stream(auth_token, stream_url):
    res = requests.get(
        f"{stream_url}/stream/{BOOK_ID}/{CHAPTER_INDEX}",
        headers=auth_token['headers']
    )
    assert res.status_code == 200

def test_review(auth_token, reviews_url):
    review_res = requests.post(
        f"{reviews_url}/reviews",
        json={
            "audiobookId": BOOK_ID,
            "userId": auth_token['user_id'],
            "rating": 5,
            "comment": REVIEW
        },
        headers=auth_token['headers']
    )
    assert review_res.status_code == 201
    assert review_res.json()['message'] == "Review added"