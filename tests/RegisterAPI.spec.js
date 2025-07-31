import { test, expect, request } from "../PageObjects/BaseObject.js";
import responseMessages from "../Fixtures/responseMessages.json";
import credentials from "../Fixtures/credentials.json";
import dotenv from "dotenv";
import path, { resolve } from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

test.describe("Positive test cases for Register API", async () => {
  test("Register a user with valid credentials", async ({ authAPI }) => {
    await authAPI.register({});
  });

  test("Validate register response schema", async ({
    authAPI,
    schemaValidation,
  }) => {
    let body = await authAPI.register({ returnBodyOnly: true });
    await expect(schemaValidation.bodySchemaValidation(body)).toBeTruthy();
  });

  test("Register a user with umlauts", async ({ authAPI, generalMethods }) => {
    await authAPI.register({
      usrename: `ä${generalMethods.randomUsername}`,
      email: `ä${generalMethods.randomEmail}`,
      password: `ä${generalMethods.randomPassword}`,
    });
  });
});

test.describe("Negative test cases for Register API", async () => {
  test("Try to register with existing username adress", async ({ authAPI }) => {
    let body = await authAPI.register({
      username: process.env.USER_NAME,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.usernameExist);
    expect(body.errors.username[0]).toBe(responseMessages.usernameExist);
  });

  test("Try to register with existing mail adress", async ({ authAPI }) => {
    let body = await authAPI.register({
      email: process.env.EMAIL,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.emailExist);
    expect(body.errors.email[0]).toBe(responseMessages.emailExist);
  });

  test("Test register API with different method", async ({ authAPI }) => {
    let body = await authAPI.register({ method: "patch", statusCode: 405 });
    expect(body.error).toBe(responseMessages.methodNotAllowed);
  });

  test("Try to register without credentials", async ({ authAPI }) => {
    let body = await authAPI.register({
      username: "",
      email: "",
      password: "",
      statusCode: 422,
    });
    expect(body.errors.username[0]).toBe(responseMessages.usernameRequired);
    expect(body.errors.email[0]).toBe(responseMessages.emailRequired);
    expect(body.errors.password[0]).toBe(responseMessages.passwordRequired);
  });

  test("Try to register with invalid type of mail", async ({ authAPI }) => {
    let body = await authAPI.register({
      email: credentials.invalidEmail,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.invalidEmailFormat);
    expect(body.errors.email[0]).toBe(responseMessages.invalidEmailFormat);
  });

  test("Try to register without username", async ({ authAPI }) => {
    let body = await authAPI.register({
      username: "",
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.usernameRequired);
  });

  test("Try to register with username longer than 255 characters", async ({
    authAPI,
    generalMethods,
  }) => {
    let body = await authAPI.register({
      username: generalMethods.randomUsername.repeat(35),
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.usernameLimit);
  });

  test("try to register a new user with an email longer than 255 characters", async ({
    authAPI,
    generalMethods,
  }) => {
    await authAPI.register({
      email: `${generalMethods.randomUsername.repeat(35)}@gmail.com`,
      statusCode: 422,
    });
  });

  test("Try to register with special characters", async ({
    authAPI,
    generalMethods,
  }) => {
    await authAPI.register({
      username: `${generalMethods.randomUsername}★`,
      email: `★${generalMethods.randomEmail}`,
      password: `★${generalMethods.randomPassword}`,
      statusCode: 422,
    });
  });

  test("Try to register a new user with short password (3 characters)", async ({
    authAPI,
  }) => {
    let body = await authAPI.register({
      password: credentials.shortPassword,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.shortPassword);
  });

  test("Try to register with white spaces in credentials", async ({
    authAPI,
    generalMethods,
  }) => {
    await authAPI.register({
      username: `${generalMethods.randomUsername} space`,
      email: `P ${generalMethods.randomEmail}`,
      password: `123 ${generalMethods.randomPassword}`,
      statusCode: 422,
    });
  });
});
