module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    "coveragePathIgnorePatterns": [
      "<rootDir>/src/Contract/EventFetcher/eventFetcher.ts",
  ],
  };