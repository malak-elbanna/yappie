const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const { fetchUserProfile } = require('../../../backend/notification-service/client/profileClient');

describe('Profile Service Contract', () => {
  const provider = new Pact({
    consumer: 'NotificationService',
    provider: 'ProfileService',
    port: 1234,
    pactfileWriteMode: 'update',
    logLevel: 'warn',
    dir: path.resolve(__dirname, '../../pacts'), 
  });

  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  it('GET /profile/{id} returns user data', async () => {
    await provider.addInteraction({
      state: 'user exists',
      uponReceiving: 'request for user profile',
      withRequest: {
        method: 'GET',
        path: '/profile/123'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { id: 123, name: 'John Doe' }
      }
    });

    const response = await fetchUserProfile('123');
    expect(response).toEqual({ id: 123, name: 'John Doe' });
  });
});