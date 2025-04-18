import os
from datetime import timedelta

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', 'google-client-id')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', 'google-client-secret')

JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  
