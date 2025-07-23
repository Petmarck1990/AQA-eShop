import { test, expect } from "../PageObjects/UI/BaseObject.js";
import generalData from "../Fixtures/generalData.json";
import credentials from "../Fixtures/credentials.json";
import { LoginPage } from "../PageObjects/UI/LoginPage.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
let page;
test.describe("Positive tests for Login page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goTo();
  });

  test("Checkout Login page elements", async ({ loginPage }) => {
    await loginPage.checkPageElemets({});
  });

  test("Login with valid credentials", async ({ loginPage, wpage }) => {
    await loginPage.login({});
    const response = await wpage.waitForResponse(
      (response) =>
        response.url().includes("/dashboard") && response.status() === 200
    );
    await expect(response.status()).toBe(200);
    await expect(wpage).toHaveURL(generalData.linkToDashboard);
    const token = await wpage.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
  });

  test("Login from 'Dashboard' link on Register page (handling popup)", async ({
    wpage,
    loginPage,
  }) => {
    await wpage.goto("/");
    const [newPage] = await Promise.all([
      wpage.waitForEvent("popup"),
      loginPage.dashboardButton.click(),
    ]);
    const loginPage2 = new LoginPage(newPage);
    await loginPage2.login({});
    const response = await newPage.waitForResponse(
      (response) =>
        response.url().includes("/dashboard") && response.status() === 200
    );
    await expect(response.status()).toBe(200);
    await expect(newPage).toHaveURL(generalData.linkToDashboard);
    const token = await newPage.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
  });
});

test.describe("Negative test cases for Login page", async () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goTo("");
  });

  test("Login with empty fields", async ({ loginPage }) => {
    await loginPage.login({
      email: generalData.emptyString,
      password: generalData.emptyString,
    });
    await expect(loginPage.email).toBeEmpty();
    await expect(loginPage.password).toBeEmpty();
    await expect(loginPage.emptyEmailMessage).toBeVisible();
    await expect(loginPage.emptyPasswordMessage).toBeVisible();
  });

  test("Login with invalid email format", async ({
    loginPage,
    generalMethods,
  }) => {
    await loginPage.login({ email: credentials.invalidEmail });
    expect(await generalMethods.checkResponseStatus("/login")).toBe(422);
    await expect(loginPage.invalidMailFormatMessage).toBeVisible();
  });

  test("Login with invalid password", async ({ loginPage, generalMethods }) => {
    await loginPage.login({ password: generalMethods.randomPassword });
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });

  test("Login from 'Log in now' link on Register page (Register button)", async ({
    registerPage,
    loginPage,
  }) => {
    await registerPage.goTo();
    await registerPage.linkForLogin.click();
    await loginPage.login({});
  });

  test("Use page after deleting token", async ({ wpage, loginPage }) => {
    await loginPage.login({});
    await expect(wpage).toHaveURL(generalData.linkToDashboard);
    const token = await wpage.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
    await wpage.evaluate(() => localStorage.removeItem("token"));
    await wpage.context().clearCookies();
    const noToken = await wpage.evaluate(() => localStorage.getItem("token"));
    expect(noToken).toBeFalsy();
    await wpage.reload();
    await expect(wpage).toHaveURL("");
  });
});
