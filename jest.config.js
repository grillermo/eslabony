const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    coverageProvider: 'v8',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    // Default transformIgnorePatterns matches node_modules but next/jest handles most
    testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);
