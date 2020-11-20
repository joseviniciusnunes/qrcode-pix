module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    forceExit: true,
    testTimeout: 10000,
    collectCoverageFrom: ['src/*.ts'],
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testMatch: ['**/**.test.ts'],
};
