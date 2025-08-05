import { test, expect } from "../PageObjects/BaseObject";
import endpoints from "../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path, { resolve } from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let page;
test.describe("Login with token", () => {
  test.beforeEach(async ({ loginPage, wpage, generalMethods }) => {
    page = wpage;
    await loginPage.loginWithSession(page);
    await generalMethods.goToPage({
      url: endpoints.dashboardEndpoint,
    });
  });

  test("Go to the Dashboard page", async ({ dashboardPage }) => {
    await expect(dashboardPage.productsContainer).toBeVisible();
  });
});
