import pytest
import requests

REVIEW = "testing review"
BOOK_ID = "67f6fff64f5a80cc372aea52"

@pytest.fixture(scope="module")
def notification_url(): 
    return "http://localhost:4000"

@pytest.fixture(scope="module")
def reviews_url():
    return "http://localhost:5003"

def test_create_review(auth_token, reviews_url):
    res = requests.post(
        f"{reviews_url}/reviews",
        json={
            "audiobookId": BOOK_ID,
            "userId": auth_token['user_id'],
            "rating": 5,
            "comment": REVIEW
        },
        headers=auth_token['headers']
    )
    assert res.status_code == 201

def test_create_notification(auth_token, notification_url):
    res = requests.post(
        f"{notification_url}/notification",
        json={
            "email": auth_token['email'],
            "notification": {
                "message": "Your review has been posted successfully",
            }
        }
    )
    assert res.status_code == 201

def test_get_notifications(notification_url):
    res = requests.get(
        f"{notification_url}/notification"
    )
    assert res.status_code == 200

