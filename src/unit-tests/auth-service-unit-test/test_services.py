# import pytest
# from unittest.mock import MagicMock, patch
# from src.backend.auth-service.auth import (
#     hash_password, verify_password,
#     generate_jwt, decode_jwt,
#     register_user, login_user,
#     get_user_by_email
# )

# # --------- PASSWORD UTILS ---------

# def test_hash_password_returns_hashed_string():
#     password = "mySecret123"
#     hashed = hash_password(password)
#     assert isinstance(hashed, str)
#     assert hashed != password
#     assert hashed.startswith("$2b$")  # bcrypt prefix


# def test_verify_password_correct_and_incorrect():
#     password = "test123"
#     hashed = hash_password(password)
#     assert verify_password(password, hashed) is True
#     assert verify_password("wrong", hashed) is False


# # --------- JWT UTILS ---------

# def test_generate_and_decode_jwt():
#     payload = {"user_id": 1}
#     token = generate_jwt(payload)
#     decoded = decode_jwt(token)
#     assert decoded["user_id"] == 1
#     assert "exp" in decoded


# def test_decode_jwt_invalid_token():
#     with pytest.raises(Exception):
#         decode_jwt("invalid.token.string")


# # --------- SERVICE FUNCTIONS ---------

# @patch("src.backend.auth-service.app.auth.Session")
# @patch("src.backend.auth-service.app.auth.get_user_by_email")
# def test_register_user_success(mock_get_user_by_email, mock_session):
#     # Simulate email not already registered
#     mock_get_user_by_email.return_value = None
#     mock_db = MagicMock()
#     mock_session.return_value = mock_db

#     user_data = {"email": "test@example.com", "password": "123456", "username": "merna"}
#     user = register_user(user_data, mock_db)

#     assert user.email == user_data["email"]
#     assert hasattr(user, "id")
#     mock_db.add.assert_called_once()
#     mock_db.commit.assert_called_once()


# @patch("src.backend.auth-service.app.auth.get_user_by_email")
# def test_register_user_already_exists(mock_get_user_by_email):
#     mock_get_user_by_email.return_value = MagicMock(email="test@example.com")
#     mock_db = MagicMock()

#     with pytest.raises(ValueError, match="User already exists"):
#         register_user({"email": "test@example.com", "password": "123"}, mock_db)


# @patch("src.backend.auth-service.app.auth.get_user_by_email")
# def test_login_user_success(mock_get_user_by_email):
#     # Fake user with matching password
#     fake_user = MagicMock()
#     fake_user.password = hash_password("123456")
#     fake_user.id = 42
#     fake_user.email = "merna@example.com"
#     mock_get_user_by_email.return_value = fake_user

#     token = login_user({"email": fake_user.email, "password": "123456"})
#     decoded = decode_jwt(token)
#     assert decoded["user_id"] == fake_user.id


# @patch("src.backend.auth-service.app.auth.get_user_by_email")
# def test_login_user_invalid_password(mock_get_user_by_email):
#     fake_user = MagicMock()
#     fake_user.password = hash_password("correctpass")
#     mock_get_user_by_email.return_value = fake_user

#     with pytest.raises(ValueError, match="Invalid password"):
#         login_user({"email": "x@example.com", "password": "wrongpass"})


# @patch("src.backend.auth-service.app.auth.get_user_by_email")
# def test_login_user_not_found(mock_get_user_by_email):
#     mock_get_user_by_email.return_value = None
#     with pytest.raises(ValueError, match="User not found"):
#         login_user({"email": "notfound@example.com", "password": "any"})


# # --------- HELPER FUNCTION ---------

# @patch("src.backend.auth-service.app.auth.Session")
# def test_get_user_by_email_found(mock_session):
#     mock_db = MagicMock()
#     user_mock = MagicMock(email="user@example.com")
#     mock_db.query().filter().first.return_value = user_mock
#     mock_session.return_value = mock_db

#     result = get_user_by_email("user@example.com")
#     assert result.email == "user@example.com"


# @patch("src.backend.auth-service.app.auth.Session")
# def test_get_user_by_email_not_found(mock_session):
#     mock_db = MagicMock()
#     mock_db.query().filter().first.return_value = None
#     mock_session.return_value = mock_db

#     result = get_user_by_email("unknown@example.com")
#     assert result is None
