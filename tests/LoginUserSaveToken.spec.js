import { test } from "../PageObjects/BaseObject.js";

test.describe("Login user and store token in file for later use", async () => {
  test("Login and get from local storage", async ({
    authAPI,
    generalMethods,
  }) => {
    let token = await authAPI.login({});
    await generalMethods.writeTokenInEnvFile({ token: token });
  });
});
