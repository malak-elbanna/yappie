import pytest
import requests
import time

BOOK_ID = "67f6fff64f5a80cc372aea52"
CHAPTER_INDEX = 1
REVIEW = "wow amazinggg"

@pytest.fixture(scope="module")
def reviews_url():
    return "http://localhost:5003"

@pytest.fixture(scope="module")
def stream_url():
    return "http://localhost:8080"


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