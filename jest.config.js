module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  testMatch: ['**/app/**/*.test.(js|ts)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};