import { test, expect, request } from "../PageObjects/BaseObject.js";
import credentials from "../Fixtures/credentials.json";
import dotenv from "dotenv";
import path, { resolve } from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let baseUrl;

test.describe("Positive test cases for Register API", async () => {
  test.beforeEach(async ({}) => {
    baseUrl = process.env.BASEURLAPI;
  });

  test("Register a user with valid credentials", async ({
    registerAPI,
    loginAPI,
  }) => {
    let response = await registerAPI.registerUser({});
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let body = await response.json();
    expect(body.status).toBe("Success");
    expect(body.message).toBe("User created successfully");
    let token = await body.auth;
    expect(loginAPI.tokenValidation(token)).toBeTruthy();
  });

  test("Register a user with umlauts", async ({
    registerAPI,
    generalMethods,
    loginAPI,
  }) => {
    let response = await registerAPI.registerUser({
      usrename: `ä${generalMethods.randomUsername}`,
      email: `ä${generalMethods.randomEmail}`,
      password: `ä${generalMethods.randomPassword}`,
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let body = await response.json();
    expect(body.status).toBe("Success");
    expect(body.message).toBe("User created successfully");
    let token = await body.auth;
    expect(loginAPI.tokenValidation(token)).toBeTruthy();
  });
});

test.describe("Negative test cases for Register API", async () => {
  test.beforeEach(async () => {
    baseUrl = process.env.BASEURLAPI;
  });

  test("Try to register with existing username adress", async ({
    registerAPI,
  }) => {
    let response = await registerAPI.registerUser({
      username: process.env.USERNAME,
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(registerAPI.usernameExist);
    expect(body.errors.username[0]).toBe(registerAPI.usernameExist);
  });

  test("Try to register with existing mail adress", async ({ registerAPI }) => {
    let response = await registerAPI.registerUser({
      email: process.env.EMAIL,
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(registerAPI.emailExist);
    expect(body.errors.email[0]).toBe(registerAPI.emailExist);
  });

  test("Test register API with different method", async ({ registerAPI }) => {
    let response = await registerAPI.registerUser({ method: "patch" });
    expect(response.status()).toBe(405);
    let body = await response.json();
    expect(body.error).toBe(registerAPI.methodNotAllowedMessage);
  });

  test("Try to register without credentials", async ({ registerAPI }) => {
    let response = await registerAPI.registerUser({
      username: "",
      email: "",
      password: "",
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.errors.username[0]).toBe(registerAPI.usernameRequired);
    expect(body.errors.email[0]).toBe(registerAPI.emailRequired);
    expect(body.errors.password[0]).toBe(registerAPI.passwordRequired);
  });

  test("Try to register with invalid type of mail", async ({ registerAPI }) => {
    let response = await registerAPI.registerUser({
      email: credentials.invalidEmail,
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(registerAPI.invalidEmailFormat);
    expect(body.errors.email[0]).toBe(registerAPI.invalidEmailFormat);
  });

  test("Try to register without username", async ({ registerAPI }) => {
    let response = await registerAPI.registerUser({
      username: "",
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(registerAPI.usernameRequired);
  });

  test("Try to register with username longer than 255 characters", async ({
    registerAPI,
    generalMethods,
  }) => {
    let response = await registerAPI.registerUser({
      username: generalMethods.randomUsername.repeat(35),
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(registerAPI.usernameLimitMessage);
  });

  test("try to register a new user with an email longer than 255 characters", async ({
    registerAPI,
    generalMethods,
  }) => {
    let response = await registerAPI.registerUser({
      email: `${generalMethods.randomUsername.repeat(35)}@gmail.com`,
    });
    expect(response.status()).toBe(422);
  });

  test("Try to register with special characters", async ({
    registerAPI,
    generalMethods,
  }) => {
    let response = await registerAPI.registerUser({
      username: `${generalMethods.randomUsername}★`,
      email: `★${generalMethods.randomEmail}`,
      password: `★${generalMethods.randomPassword}`,
    });
    expect(response.status()).toBe(422);
  });

  test("Try to register a new user with short password (3 characters)", async ({
    registerAPI,
  }) => {
    let response = await registerAPI.registerUser({
      password: credentials.shortPassword,
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    expect(body.message).toBe(registerAPI.shortPasswordMessage);
  });

  test("Try to register with white spaces in credentials", async ({
    registerAPI,
    generalMethods,
  }) => {
    let response = await registerAPI.registerUser({
      username: `${generalMethods.randomUsername} space`,
      email: `P ${generalMethods.randomEmail}`,
      password: `123 ${generalMethods.randomPassword}`,
    });
    expect(response.status()).toBe(422);
    let body = await response.json();
    console.log(body);
  });
});
