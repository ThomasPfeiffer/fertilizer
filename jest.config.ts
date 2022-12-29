export default {
  clearMocks: true,
  testEnvironment: "jsdom",
  preset: "ts-jest",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
}
