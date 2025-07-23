import { test, expect } from "../PageObjects/UI/BaseObject";
import credentials from "../Fixtures/credentials.json";
import generalData from "../Fixtures/generalData.json";

test.describe("Positive test cases for register page", () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goTo();
  });
  test("Checkout Register page elements", async ({ registerPage }) => {
    await registerPage.checkPageElements({});
  });

  test("Valid registration", async ({
    registerPage,
    dashboardPage,
    wpage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({});
    await expect(registerPage.successRegisterMessage).toBeVisible();
    expect(await generalMethods.checkResponseStatus("/dashboard")).toBe(200);
    await expect(wpage).toHaveURL(generalData.linkToDashboard);
    const token = await wpage.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
    await expect(dashboardPage.searchField).toBeVisible();
  });
  test("Register user from 'Create today!' link on Login page", async ({
    registerPage,
    loginPage,
    wpage,
    dashboardPage,
    generalMethods,
  }) => {
    await loginPage.logButton.click();
    await loginPage.linkForCreate.click();
    await registerPage.registerNewUser({});
    expect(await generalMethods.checkResponseStatus("/dashboard")).toBe(200);
    await expect(wpage).toHaveURL(generalData.linkToDashboard);
    await wpage.waitForLoadState("networkidle");
    const token = await wpage.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
    await expect(dashboardPage.productsContainer).toBeVisible();
  });
});
test.describe("Negative test cases for Register page", async () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goTo();
  });
  test("Try to register without credentials", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({
      username: generalData.emptyString,
      email: generalData.emptyString,
      password: generalData.emptyString,
    });
    expect(
      await generalMethods.checkResponseStatus("/api/v1/auth/register")
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
    expect(
      await generalMethods.checkResponseStatus("/api/v1/auth/register")
    ).toBe(422);
    await expect(registerPage.invalidMailMessage).toBeVisible();
  });

  test("Try to register without username", async ({
    registerPage,
    generalMethods,
  }) => {
    await registerPage.registerNewUser({ username: generalData.emptyString });
    expect(
      await generalMethods.checkResponseStatus("/api/v1/auth/register")
    ).not.toBe(200);
    await expect(registerPage.emptyUsernameMessage).toBeVisible();
  });
});
