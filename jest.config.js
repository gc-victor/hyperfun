process.env.NODE_PATH = 'node_modules';

module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'jest.tsconfig.json',
        },
    },
    preset: 'ts-jest',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/examples/'],
};
