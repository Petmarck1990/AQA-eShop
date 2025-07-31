import { test, expect } from "../PageObjects/BaseObject";
import endpoints from "../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path, { resolve } from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
let page;

test.describe("Test to login without credentials", async () => {
  test.beforeEach(async ({ generalMethods, wpage }) => {
    page = wpage;
    await generalMethods.insertTokenInLocalStorage(process.env.TOKEN);
    await generalMethods.goToPage({ url: endpoints.dashboardEndpoint });
  });

  test("test", async ({ dashboardPage }) => {
    await expect(dashboardPage.productsContainer).toBeVisible();
  });
});
