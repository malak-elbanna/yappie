import pytest
import os

if __name__ == '__main__':
    pytest.main([
        'src/contract-tests/providers/profile-service/',
        '-v',
        '--pact-url=src/contract-tests/pacts/notification_service-profile_service.json'
    ])