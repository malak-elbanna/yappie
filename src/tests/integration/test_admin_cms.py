import pytest
import requests

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="securepass"

@pytest.fixture(scope="module")
def auth_url():
    return "http://localhost:5000"

@pytest.fixture(scope="module")
def cms_url():
    return "http://localhost:5001"

def test_login_add_delete_book(auth_url, cms_url):
    login_res = requests.post(
        f"{auth_url}/auth/login-admin",
        json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
    )
    assert login_res.status_code == 200
    token = login_res.json()['access_token']
    
    headers= {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    cms_add_res = requests.post(
        f"{cms_url}",
        data={
            "title": "Book 1",
            "author": "Author",
            "language": "English" 
        },
        headers=headers
    )
    assert cms_add_res.status_code == 201
    book_id = cms_add_res.json()['_id']

    cms_delete_book = requests.delete(
        f"{cms_url}/{book_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert cms_delete_book.status_code == 200
