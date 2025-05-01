module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|scss|sass)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleDirectories: ["node_modules", "<rootDir>/"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
  };
  