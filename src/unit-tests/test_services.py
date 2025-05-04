import pytest
from app.auth.services import validate_password

def test_validate_password_success():
    assert validate_password("StrongPass1!") is True

def test_validate_password_failure():
    assert validate_password("weak") is False
