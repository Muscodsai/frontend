module.exports = {
    testEnvironment: 'jsdom', // Ensures the environment is a browser-like environment
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Transform .ts and .tsx files with ts-jest
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // Ensure Jest knows about .tsx files
};
