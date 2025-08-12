import { test, expect } from "../PageObjects/BaseObject.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import endpoints from "../Fixtures/endpoints.json";

let page;

test.describe("Shoping flow", async () => {
  test.beforeEach(async ({ wpage, loginPage }) => {
    page = wpage;
    await loginPage.loginWithToken({ page });
  });

  test("Add graphic card in cart", async ({
    dashboardPage,
    checkoutPage,
    generalMethods,
  }) => {
    await generalMethods.goToPage({ url: endpoints.dashboardEndpoint });
    await dashboardPage.addProductToCart();
    await expect(page).toHaveURL(`${endpoints.checkoutEndpoint}`);
    await checkoutPage.rewiewItems();
    await checkoutPage.addCustomerInfo({});
    await checkoutPage.addBillingInfo({});
    await checkoutPage.checkFinalInformation({});
    await expect(page).toHaveURL(`${endpoints.dashboardEndpoint}`);
    await expect(dashboardPage.searchField).toBeVisible();
  });
});
