import { test, expect } from "../PageObjects/BaseObject.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import endpoints from "../Fixtures/endpoints.json";
const store = require("../Utils/globalStorage.js");

let page;

test.describe("Shoping flow", async () => {
  test.use({ viewport: { width: 1600, height: 800 } });
  test.beforeEach(async ({ wpage, loginPage, generalMethods }) => {
    page = wpage;
    await loginPage.loginWithToken({ page });
    store.set("firstName", await generalMethods.randomFirstName());
    store.set("lastName", await generalMethods.randomLastName());
    store.set("email", await generalMethods.randomEmail);
    store.set("phoneNumber", await `+${generalMethods.randomCardNumber}`);
    store.set("cardNumber", await generalMethods.randomCardNumber);
    store.set("country", "Serbia");
    store.set("city", "Novi Sad");
    store.set("postalCode", "21000");
    store.set("adress", "Petefi Sandora 12");
    store.set("cvv", "989");
    store.set("cardType", "MasterCard");
  });

  test.afterAll("Clear global storage", async () => {
    store.clear();
  });

  test("Add product in cart and buy product", async ({
    dashboardPage,
    checkoutPage,
    generalMethods,
  }) => {
    await generalMethods.goToPage({ url: endpoints.dashboardEndpoint });
    await dashboardPage.cartCheckAndEmpty();
    await dashboardPage.addProductToCart();
    await expect(page).toHaveURL(`${endpoints.checkoutEndpoint}`);
    await checkoutPage.rewiewItems();
    await checkoutPage.addCustomerInfo({});
    await checkoutPage.addBillingInfo({});
    await checkoutPage.checkFinalInformation({});
    await checkoutPage.confirmButton.click();
    await expect(page).toHaveURL(`${endpoints.dashboardEndpoint}`);
    await expect(dashboardPage.searchField).toBeVisible();
  });
});
