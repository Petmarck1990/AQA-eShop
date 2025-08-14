import { test, expect } from "../PageObjects/BaseObject.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import endpoints from "../Fixtures/endpoints.json";

let page;

test.describe("Shoping flow", async () => {
  test.use({ viewport: { width: 1600, height: 800 } });
  test.beforeEach(async ({ wpage, loginPage }) => {
    page = wpage;
    await loginPage.loginWithToken({ page });
  });

  test("Add product in cart and buy product", async ({
    dashboardPage,
    checkoutPage,
    generalMethods,
  }) => {
    await generalMethods.goToPage({ url: endpoints.dashboardEndpoint });
    await dashboardPage.cartCheckAndEmpty();
    // await dashboardPage.findSpecificProduct({});
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
