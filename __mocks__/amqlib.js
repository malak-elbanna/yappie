const mockChannel = {
  assertExchange: jest.fn().mockResolvedValue(true),
  publish: jest.fn(),
  close: jest.fn()
};

module.exports = {
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue(mockChannel)
  })
};