import pytest
import requests

BOOK_ID = "67f6fff64f5a80cc372aea52"
CHAPTER_INDEX = 1

@pytest.fixture(scope="module")
def profile_url():
    return "http://localhost:5005"

@pytest.fixture(scope="module")
def stream_url():
    return "http://localhost:8080"

def test_get_info(auth_token, profile_url):
    get_info_res = requests.get(
        f"{profile_url}/{auth_token['user_id']}",
        headers=auth_token['headers']
    )
    assert get_info_res.status_code == 200

def test_edit_bio(auth_token, profile_url):
    edit_bio_res = requests.put(
        f"{profile_url}/{auth_token['user_id']}/edit-bio",
        json={
            "bio": "New Bio"
        },
        headers=auth_token['headers']
    )
    assert edit_bio_res.status_code == 200

def test_add_preference(auth_token, profile_url):
    add_pref_res = requests.put(
        f"{profile_url}/{auth_token['user_id']}/add-preference",
        json={
            "type": "audiobooks",
            "genre": "Fantasy"
        },
        headers=auth_token['headers']
    )
    assert add_pref_res.status_code == 200

def test_remove_preference(auth_token, profile_url):
    remove_pref_res = requests.put(
        f"{profile_url}/{auth_token['user_id']}/remove-preference",
        json={
            "type": "audiobooks",
            "genre": "Fantasy"
        },
        headers=auth_token['headers']
    )
    assert remove_pref_res.status_code == 200

def test_get_books(auth_token, stream_url):
    res = requests.get(
        f"{stream_url}/books",
        headers=auth_token['headers']
    )
    assert res.status_code == 200

def test_stream(auth_token, stream_url):
    res = requests.get(
        f"{stream_url}/stream/{BOOK_ID}/{CHAPTER_INDEX}",
        headers=auth_token['headers']
    )
    assert res.status_code == 200