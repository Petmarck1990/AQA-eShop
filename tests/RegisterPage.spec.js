import { test, expect } from "@playwright/test";
import { RegisterPage } from "../PageObjects/UI/RegisterPage.js";
import credentials from "../Fixtures/credentials.json";
import { GeneralMethods } from "../Fixtures/generalMethods.js";
import { DashboardPage } from "../PageObjects/UI/Dashboard.js";
import { LoginPage } from "../PageObjects/UI/LoginPage.js";
const generalMethods = new GeneralMethods();

test.describe("Tests for register page", () => {
  test("Checkout Register page elements", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goTo();
    await expect(registerPage.registerHeadingText).toBeVisible();
    await expect(registerPage.questionForAcc).toBeVisible();
    await expect(registerPage.username).toBeVisible();
    await expect(registerPage.email).toBeVisible();
    await expect(registerPage.password).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
    await expect(registerPage.linkForLogin).toHaveAttribute(
      "href",
      registerPage.linkToLoginPage
    );
  });

  test("Valid registration", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const dashboard = new DashboardPage(page);
    await registerPage.goTo();
    await registerPage.registerNewUser(
      generalMethods.randomUsername,
      generalMethods.randomEmail,
      generalMethods.randomPassword
    );
    await page.waitForLoadState("networkidle");
    await expect(registerPage.successRegisterMessage).toBeVisible();
  });

  test("Registration without credentials", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goTo();
    await registerPage.registerNewUser(
      registerPage.emptyString,
      registerPage.emptyString,
      registerPage.emptyString
    );
    await expect(registerPage.emptyUsernameMessage).toBeVisible();
  });

  test("Registration with invalid type of mail", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goTo();
    await registerPage.registerNewUser(
      generalMethods.randomUsername,
      credentials.invalidEmail,
      generalMethods.randomPassword
    );
    await expect(registerPage.invalidMailMessage).toBeVisible();
  });
  test("Register user from 'Create today!' link on Login page", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.linkForCreate.click();
    await registerPage.registerNewUser(
      generalMethods.randomUsername,
      generalMethods.randomEmail,
      generalMethods.randomPassword
    );
    await expect(registerPage.successRegisterMessage).toBeVisible();
  });
});
