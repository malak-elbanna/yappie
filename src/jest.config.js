module.exports = {
   roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],  
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/backend/notification-service/models/$1',
    '^@logger$': '<rootDir>/src/backend/notification-service/logger',
    '^@controllers/(.*)$': '<rootDir>/src/backend/notification-service/controllers/$1',
  }
};