import { test, expect } from "../PageObjects/BaseObject.js";
import credentials from "../Fixtures/credentials.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let baseUrl;

test.describe("Positive API test cases for Login", async () => {
  test.beforeEach(async () => {
    baseUrl = process.env.BASEURLAPI;
  });

  test("Login with valid credentials", async ({ loginAPI }) => {
    const response = await loginAPI.loginResponse({});
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user.email).toBeTruthy();
    expect(body.user.password).toBeTruthy;
    await expect(body.message).toBe(loginAPI.successLoginMessage);
    await expect(body.status).toBe("Success");
  });

  // test("Validating response schema", async ({ loginAPI }) => {
  //   const response = await loginAPI.loginResponse({});
  //   expect(response.ok()).toBeTruthy();
  //   const body = await response.json();
  //   console.log(body);
  // });

  test("Login with umlauts", async ({ loginAPI }) => {
    const response = await loginAPI.loginResponse({
      email: process.env.UMLAUTSMAIL,
      password: process.env.UMLAUTSPASSWORD,
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user.email).toBeTruthy();
    expect(body.user.password).toBeTruthy;
    await expect(body.message).toBe(loginAPI.successLoginMessage);
    await expect(body.status).toBe("Success");
    const token = await loginAPI.getToken({});
    expect(await token).toBeTruthy();
  });

  test("Login with chinese letters", async ({ loginAPI }) => {
    const response = await loginAPI.loginResponse({
      email: process.env.CHINESELETTERMAIL,
      password: process.env.CHINESELETTERPASSWORD,
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const token = await loginAPI.getToken({
      email: process.env.CHINESELETTERMAIL,
      password: process.env.CHINESELETTERPASSWORD,
    });
    expect(await token).toBeTruthy();
    const body = await response.json();
    await expect(body.message).toBe(loginAPI.successLoginMessage);
    await expect(body.status).toBe("Success");
  });
});

test.describe("Negative API test cases for Login", async () => {
  test.beforeEach(async () => {
    baseUrl = process.env.BASEURLAPI;
  });

  test("Login with empty fields", async ({ loginAPI, request }) => {
    let response = await loginAPI.loginResponse({ email: "", password: "" });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(
      "The email field is required. (and 1 more error)"
    );
    expect(body.errors.email[0]).toBe("The email field is required.");
    expect(body.errors.password[0]).toBe("The password field is required.");
  });

  test("Login with wrong password", async ({ loginAPI, generalMethods }) => {
    let response = await loginAPI.loginResponse({
      password: generalMethods.randomPassword,
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
    let body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  test("Login with invalid email format", async ({ loginAPI }) => {
    let response = await loginAPI.loginResponse({
      email: credentials.invalidEmail,
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe("The email field must be a valid email address.");
    expect(body.errors.email[0]).toBe(
      "The email field must be a valid email address."
    );
  });
  test("Login with special characters", async ({ loginAPI }) => {
    let response = await loginAPI.loginResponse({
      email: credentials.emailWithSymbol,
      password: credentials.passwordWithSymbol,
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe("The email field must be a valid email address.");
    expect(body.errors.email[0]).toBe(
      "The email field must be a valid email address."
    );
  });
});
