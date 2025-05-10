const { create, publish } = require('@controllers/notificationController');
const Notification = require('@models/notification');
const Subscription = require('@models/subscription');

jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({
      assertExchange: jest.fn().mockResolvedValue(true),
      publish: jest.fn(),
      close: jest.fn()
    })
  })
}));

jest.mock('@models/notification', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('@models/subscription', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('@logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

beforeAll(async () => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Notification Controller', () => {
  describe('create() - notifications', () => {
    it('should add notification to existing user', async () => {
      const mockUser = {
        email: 'test@example.com',
        notifications: [{ message: 'old', link: '', date: expect.any(Date) }],
        save: jest.fn().mockResolvedValue(true)
      };
      Notification.findOne.mockResolvedValue(mockUser);

      const req = { 
        body: { 
          type: 'notification',
          email: 'test@example.com', 
          notification: { 
            message: 'new',
            link: '',
            date: expect.any(Date)
          } 
        } 
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await create(req, res);

      expect(mockUser.notifications).toEqual([
        { message: 'old', link: '', date: expect.any(Date) },
        { message: 'new', link: '', date: expect.any(Date) }
      ]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should handle database errors when creating notification', async () => {
      Notification.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { 
        body: { 
          type: 'notification',
          email: 'test@example.com', 
          notification: { 
            message: 'new',
            link: '',
            date: expect.any(Date)
          } 
        } 
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
      await create(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('create() - subscriptions', () => {
    it('should create new subscription', async () => {
      // Enhanced mock setup
      const mockCreatedSubscription = {
        email: 'new@example.com',
        subscriptions: [{ topic: 'sub1', key: [] }],
        save: jest.fn().mockResolvedValue(true)
      };
      
      Subscription.findOne.mockResolvedValue(null);
      Subscription.create.mockResolvedValue(mockCreatedSubscription);

      const req = { 
        body: { 
          type: 'subscription',
          email: 'new@example.com', 
          subscription: { topic: 'sub1' } 
        } 
      };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
      
      await create(req, res);

      expect(Subscription.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        subscriptions: [{ topic: 'sub1', key: [] }]
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedSubscription);
    });

    it('should handle existing user subscriptions', async () => {
      const mockUser = {
        email: 'exists@example.com',
        subscriptions: [{ topic: 'old', key: [] }],
        save: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };
      
      Subscription.findOne.mockResolvedValue(mockUser);
      
      const req = { 
        body: { 
          type: 'subscription',
          email: 'exists@example.com', 
          subscription: { topic: 'new' } 
        } 
      };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
      
      await create(req, res);
      
      expect(mockUser.subscriptions).toEqual([
        { topic: 'old', key: [] },
        { topic: 'new', key: [] }
      ]);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('publish()', () => {
    it('should send message to RabbitMQ', async () => {
      const amqp = require('amqplib');
      const mockChannel = await (await amqp.connect()).createChannel();
      
      const req = { 
        body: { 
          author: 'user1', 
          title: 'Test' 
        } 
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await publish(req, res);

      expect(mockChannel.publish).toHaveBeenCalledWith(
        'notification',
        'user1',
        Buffer.from('Test')
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle RabbitMQ connection errors', async () => {
      const amqp = require('amqplib');
      amqp.connect.mockRejectedValue(new Error('Connection failed'));
      
      const req = { 
        body: { 
          author: 'user1', 
          title: 'Test' 
        } 
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
      await publish(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});