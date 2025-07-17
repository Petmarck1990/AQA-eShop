import { test, expect } from "@playwright/test";
import credentials from "../Fixtures/credentials.json";
import generalData from "../Fixtures/generalData.json";
import { LoginPage } from "../PageObjects/UI/LoginPage.js";
import { RegisterPage } from "../PageObjects/UI/RegisterPage.js";
import { GeneralMethods } from "../Fixtures/generalMethods.js";
const generalMethods = new GeneralMethods();

test.describe("Tests for Login page", () => {
  test("Checkout Login page elements", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await expect(loginPage.welcomeMessage).toBeVisible();
    await expect(loginPage.wavingHand).toBeVisible();
    await expect(loginPage.email).toBeVisible();
    await expect(loginPage.password).toBeVisible();
    await expect(loginPage.signinButton).toBeVisible();
    await expect(loginPage.questionForAcc).toBeVisible();
    await expect(loginPage.linkForCreate).toHaveAttribute(
      "href",
      loginPage.linkToPage
    );
    await expect(loginPage.likForForgotPassword).toHaveAttribute(
      "href",
      loginPage.linkToForgotPassword
    );
  });

  test("Login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(credentials.loginEmail, credentials.loginPassword);
  });

  test("Login with empty fields", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(generalData.emptyString, generalData.emptyString);
    await expect(loginPage.emptyEmailMessage).toBeVisible();
    await expect(loginPage.emptyPasswordMessage).toBeVisible();
  });
  test("Login with invalid email format", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(credentials.invalidEmail, credentials.loginPassword);
    await expect(loginPage.invalidMailFormatMessage).toBeVisible();
  });
  test("Login with invalid password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(
      credentials.loginEmail,
      generalMethods.randomPassword
    );
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });
  test("Login from 'Log in now' link on Register page (Register button)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    await registerPage.goTo();
    await registerPage.linkForLogin.click();
    await loginPage.login(credentials.loginEmail, credentials.loginPassword);
  });
  test("Login from 'Dashboard' link on Register page (Dashboard button)", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await page.goto("/");
    const pagePromise = context.waitForEvent("page");
    await loginPage.dashboardButton.click();
    const newPage = await pagePromise;
    const loginPage2 = new LoginPage(newPage);
    await loginPage2.login(credentials.loginEmail, credentials.loginPassword);
  });
});
