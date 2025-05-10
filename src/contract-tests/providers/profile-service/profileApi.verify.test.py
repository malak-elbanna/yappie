from pact import Verifier
import subprocess
import pytest

@pytest.fixture(scope='module')
def provider_service():
    proc = subprocess.Popen([
        'flask', 'run', '--port', '5000'
    ], cwd='src/backend/profile-management-service')
    yield
    proc.terminate()

def test_profile_service_contract(provider_service):
    verifier = Verifier(
        provider='ProfileService',
        provider_base_url='http://localhost:5000'
    )

    success, _ = verifier.verify_pacts(
        'src/contract-tests/pacts/notification_service-profile_service.json',
        provider_states_setup_url='http://localhost:5000/_pact/provider_states'
    )
    assert success == 0