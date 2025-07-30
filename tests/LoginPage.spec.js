import { test, expect } from "../PageObjects/BaseObject.js";
import credentials from "../Fixtures/credentials.json";
import endpoints from "../Fixtures/endpoints.json";
import { LoginPage } from "../PageObjects/UI/LoginPage.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let page;

test.describe("Positive tests for Login page", () => {
  test.beforeEach(async ({ generalMethods, wpage }) => {
    page = wpage;
    await generalMethods.goToPage({ url: endpoints.loginEndpoint });
  });

  test("Checkout Login page elements", async ({ loginPage }) => {
    await loginPage.checkPageElemets({});
  });

  test("Login with valid credentials", async ({
    loginPage,
    dashboardPage,
    generalMethods,
  }) => {
    await loginPage.login({});
    const response = await generalMethods.getResponse({
      endpoint: endpoints.dashboardEndpoint,
    });
    await expect(response.status()).toBe(200);
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    await expect(dashboardPage.productsContainer).toBeVisible();
    await expect(generalMethods.tokenValidation()).toBeTruthy();
    expect(await generalMethods.getValueFromLocalStorage("userId")).toEqual(
      await generalMethods.getValueFromLocalStorage("cartId")
    );
  });

  test("Login from 'Dashboard' link on Register page (handling popup)", async ({
    loginPage,
    generalMethods,
  }) => {
    await page.goto("/");
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      loginPage.dashboardButton.click(),
    ]);
    const loginPageNewTab = new LoginPage(newPage);
    await loginPageNewTab.login({});
    const response = await newPage.waitForResponse(
      (response) =>
        response.url().includes(endpoints.dashboardEndpoint) &&
        response.status() === 200
    );
    await expect(response.status()).toBe(200);
    await expect(newPage).toHaveURL(endpoints.dashboardEndpoint);
    const token = await newPage.evaluate(() => localStorage.getItem("token"));
    await expect(generalMethods.tokenValidation(token)).toBeTruthy();
  });

  test("Login with umlauts", async ({
    loginPage,
    generalMethods,
    dashboardPage,
  }) => {
    await loginPage.login({
      email: process.env.UMLAUTS_MAIL,
      password: process.env.UMLAUTS_PASSWORD,
    });
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    await expect(generalMethods.tokenValidation()).toBeTruthy();
    await expect(dashboardPage.productsContainer).toBeVisible();
  });

  test("Login from 'Log in now' link on Register page (Register button)", async ({
    registerPage,
    loginPage,
    generalMethods,
    dashboardPage,
  }) => {
    await generalMethods.goToPage({ url: endpoints.registerEndpoint });
    await registerPage.loginNowRedirectButton.click();
    await expect(page).toHaveURL(endpoints.loginEndpoint);
    await loginPage.login({});
    await expect(
      await generalMethods.checkResponseStatus(endpoints.loginEndpoint)
    ).toBe(200);
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    await expect(generalMethods.tokenValidation()).toBeTruthy();
    await expect(dashboardPage.productsContainer).toBeVisible();
  });

  test("Login with chinese letters", async ({
    loginPage,
    generalMethods,
    dashboardPage,
  }) => {
    await loginPage.login({
      email: process.env.CHINESE_LETTER_MAIL,
      password: process.env.CHINESE_LETTER_PASSWORD,
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.loginEndpoint)
    ).toBe(200);
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    await expect(generalMethods.tokenValidation()).toBeTruthy();
    await expect(dashboardPage.productsContainer).toBeVisible();
  });
});

test.describe("Negative test cases for Login page", async () => {
  test.beforeEach(async ({ generalMethods, wpage }) => {
    page = wpage;
    await generalMethods.goToPage({ url: endpoints.loginEndpoint });
  });

  test("Login with empty fields", async ({ loginPage }) => {
    await loginPage.login({
      email: "",
      password: "",
    });
    await expect(loginPage.email).toBeEmpty();
    await expect(loginPage.password).toBeEmpty();
    await expect(loginPage.emptyEmailMessage).toBeVisible();
    await expect(loginPage.emptyPasswordMessage).toBeVisible();
  });

  test("Login with wrong password", async ({ loginPage, generalMethods }) => {
    await loginPage.login({ password: generalMethods.randomPassword });
    expect(await generalMethods.checkResponseStatus("/login")).toBe(401);
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
    await expect(await generalMethods.getValueFromLocalStorage("token")).toBe(
      null
    );
  });

  test("Login with invalid email format", async ({
    loginPage,
    generalMethods,
  }) => {
    await loginPage.login({ email: credentials.invalidEmail });
    expect(await generalMethods.checkResponseStatus("/login")).toBe(422);
    await expect(loginPage.invalidMailFormatMessage).toBeVisible();
    await expect(await generalMethods.getValueFromLocalStorage("token")).toBe(
      null
    );
  });

  test("Login with invalid password", async ({ loginPage, generalMethods }) => {
    await loginPage.login({ password: generalMethods.randomPassword });
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });

  test("Use page after deleting token", async ({ loginPage }) => {
    await loginPage.login({});
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
    await page.evaluate(() => localStorage.removeItem("token"));
    await page.context().clearCookies();
    const noToken = await page.evaluate(() => localStorage.getItem("token"));
    expect(noToken).toBeFalsy();
    await page.reload();
    await expect(page).toHaveURL("");
  });

  test("Login with special characters", async ({
    loginPage,
    generalMethods,
  }) => {
    loginPage.login({
      email: credentials.emailWithSymbol,
      password: credentials.passwordWithSymbol,
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.loginEndpoint)
    ).toBe(422);
    await expect(loginPage.invalidMailFormatMessage).toBeVisible();
  });
});
