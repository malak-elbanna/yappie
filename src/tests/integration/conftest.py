import pytest
import os
import requests
from typing import Dict

@pytest.fixture(scope="session")
def credentials():
    return {
        "email": f"testuser{os.getpid()}@example.com",
        "password": "securePassword$123",
        "name": "Test User"
    }

@pytest.fixture(scope="session")
def auth_url():
    return "http://localhost:5000"

@pytest.fixture(scope="session")
def register(credentials, auth_url):
    res = requests.post(
        f"{auth_url}/auth/register",
        json=credentials
    )
    assert res.status_code == 201
    yield credentials

@pytest.fixture(scope="session")
def auth_token(auth_url, register) -> Dict[str, str]:
    res = requests.post(
        f"{auth_url}/auth/login",
        json={
            "email": register['email'],
            "password": register['password']
        }
    )
    assert res.status_code == 200
    token = res.json()
    return {
        "token": token['access_token'],
        "headers": {"Authorization": f"Bearer {token['access_token']}"},
        "user_id": token['user_id'],
        "email": register['email']
    }
