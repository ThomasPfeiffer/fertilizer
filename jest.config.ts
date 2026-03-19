export default {
  clearMocks: true,
  testEnvironment: "jsdom",
  preset: "ts-jest",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
}
