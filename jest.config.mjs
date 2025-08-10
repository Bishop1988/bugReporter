// ✅ ESM (jest.config.mjs)
export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/resources/js/setupTests.js"],
    testMatch: [
        "<rootDir>/resources/js/**/__tests__/**/*.(js|jsx|ts|tsx)",
        "<rootDir>/resources/js/**/?(*.)(test|spec).(js|jsx|ts|tsx)",
    ],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/resources/js/$1",
    },
};
