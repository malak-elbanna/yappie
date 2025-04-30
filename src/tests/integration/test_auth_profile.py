import pytest
import requests
import time

email = f"testuser{int(time.time())}@example.com"
password = "securePassword123$"

@pytest.fixture(scope="module")
def auth_url():
    return "http://localhost:5000"

@pytest.fixture(scope="module")
def profile_url():
    return "http://localhost:5005"

def test_register_user(auth_url):
    name = "Test User"
    response = requests.post(
        f"{auth_url}/auth/register",
        json={"email": email, "name": name, "password": password}
    )
    assert response.status_code == 201

def test_login_edit_profile(auth_url, profile_url):
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

    get_info_res = requests.get(
        f"{profile_url}/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_info_res.status_code == 200

    edit_bio_res = requests.put(
        f"{profile_url}/{user_id}/edit-bio",
        json={
            "bio": "New Bio"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert edit_bio_res.status_code == 200

    add_pref_res = requests.put(
        f"{profile_url}/{user_id}/add-preference",
        json={
            "type": "audiobooks",
            "genre": "Fantasy"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert add_pref_res.status_code == 200

    remove_pref_res = requests.put(
        f"{profile_url}/{user_id}/remove-preference",
        json={
            "type": "audiobooks",
            "genre": "Fantasy"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert remove_pref_res.status_code == 200

