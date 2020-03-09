import Environment from "./environment";

describe("Environment", () => {
  describe("config", () => {
    beforeEach(() => {
      process.env.TEST_ENV_VAR_123 = "test value";
    });

    afterEach(() => {
      delete process.env.TEST_ENV_VAR_123;
    });

    test("use process.env as the default config object", () => {
      const env = new Environment();

      // @ts-ignore
      expect(env["config"].TEST_ENV_VAR_123).toBe("test value");
    });
  });
});
