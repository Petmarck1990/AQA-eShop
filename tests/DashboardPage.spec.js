import { test, expect } from "../PageObjects/BaseObject";
import endpoints from "../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path, { resolve } from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

test.describe("Login with token", async () => {
  test.beforeEach(async ({ generalMethods, authAPI }) => {
    let token = await authAPI.login({});
    await generalMethods.writeTokenInEnvFile({ token: token });
    await generalMethods.insertTokenInLocalStorage(process.env.TOKEN);
  });

  test("Login with token", async ({ dashboardPage, generalMethods }) => {
    await generalMethods.goToPage({ url: endpoints.dashboardEndpoint });
    await expect(dashboardPage.productsContainer).toBeVisible();
  });
});
