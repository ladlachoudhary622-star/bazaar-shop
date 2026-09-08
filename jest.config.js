module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: ['server/**/*.js', '!server/**/tests/**'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60,
        },
    },
    testMatch: ['**/tests/**/*.test.js'],
};
