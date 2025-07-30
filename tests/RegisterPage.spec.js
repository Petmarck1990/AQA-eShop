import { test, expect } from "../PageObjects/BaseObject";
import credentials from "../Fixtures/credentials.json";
import endpoints from "../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let page;

test.describe("Positive test cases for register page", () => {
  test.beforeEach(async ({ generalMethods, wpage }) => {
    page = wpage;
    await generalMethods.goToPage({ url: endpoints.registerEndpoint });
  });

  test("Checkout Register page elements", async ({ registerPage }) => {
    await registerPage.checkPageElements({});
  });

  test("Valid registration", async ({
    registerPage,
    dashboardPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({});
    await expect(registerPage.successRegisterMessage).toBeVisible();
    expect(
      await generalMethods.checkResponseStatus(endpoints.dashboardEndpoint)
    ).toBe(200);
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
    await expect(dashboardPage.searchField).toBeVisible();
  });
  test("Register user from 'Create today!' link on Login page", async ({
    registerPage,
    loginPage,
    dashboardPage,
    generalMethods,
  }) => {
    await loginPage.logButton.click();
    await loginPage.linkForCreate.click();
    await registerPage.registerNewUser({});
    expect(
      await generalMethods.checkResponseStatus(endpoints.dashboardEndpoint)
    ).toBe(200);
    await expect(page).toHaveURL(endpoints.dashboardEndpoint);
    await page.waitForLoadState("networkidle");
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
    await expect(dashboardPage.productsContainer).toBeVisible();
  });

  test("Register a user with umlauts", async ({
    registerPage,
    generalMethods,
    dashboardPage,
  }) => {
    await registerPage.registerNewUser({
      username: generalMethods.randomUsername,
      email: `ä${generalMethods.randomEmail}`,
      password: `ä${generalMethods.randomPassword}`,
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(200);
    await expect(
      await generalMethods.checkResponseStatus(endpoints.dashboardEndpoint)
    ).toBe(200);
    await expect(dashboardPage.productsContainer).toBeVisible();
  });
});

test.describe("Negative test cases for Register page", async () => {
  test.beforeEach(async ({ generalMethods, wpage }) => {
    page = wpage;
    await generalMethods.goToPage({ url: endpoints.registerEndpoint });
  });

  test("Try to register with existing username", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({ username: process.env.USERNAME });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.userExistMessage).toBeVisible();
  });

  test("Try to register with existing mail adress", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({ email: process.env.EMAIL });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.mailExistMessage).toBeVisible();
  });

  test("Try to register without credentials", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      username: "",
      email: "",
      password: "",
    });
    expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.username).toBeEmpty();
    await expect(registerPage.email).toBeEmpty();
    await expect(registerPage.password).toBeEmpty();
    await expect(registerPage.emptyUsernameMessage).toBeVisible();
  });

  test("Try to register with invalid type of mail", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      email: credentials.invalidEmail,
    });
    expect(await generalMethods.checkResponseStatus("/register")).toBe(422);
    await expect(registerPage.invalidMailMessage).toBeVisible();
  });

  test("Try to register without username", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({ username: "" });
    await expect(
      generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).not.toBe(200);
    await expect(registerPage.emptyUsernameMessage).toBeVisible();
  });

  test("Try to register with username with more than 255 characters", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      username: generalMethods.randomUsername.repeat(35),
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.tooLongUsernameMessage).toBeVisible();
  });
  test("Try to register with email with more than 255 characters", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      email: `${generalMethods.randomUsername.repeat(35)}@gmail.com`,
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.tooLongUsernameMessage).toBeVisible();
  });

  test("Try to register with special characters", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      username: generalMethods.randomUsername,
      email: `★${generalMethods.randomEmail}`,
      password: `★${generalMethods.randomPassword}`,
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.invalidMailMessage).toBeVisible();
  });

  test("Try to register with white spaces in credentials", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      username: `${generalMethods.randomUsername} space`,
      email: `P ${generalMethods.randomEmail}`,
      password: `123 ${generalMethods.randomPassword}`,
    });
    await expect(
      await generalMethods.checkResponseStatus(endpoints.registerEndpoint)
    ).toBe(422);
    await expect(registerPage.invalidMailMessage).toBeVisible();
  });
  test("Try to register a user with one-character password", async ({
    registerPage,
  }) => {
    await registerPage.registerNewUser({ password: "1" });
    await expect(registerPage.tooShortPasswordMessage).toBeVisible();
  });
});
