import { test, expect } from "../PageObjects/BaseObject.js";
import responseMessages from "../Fixtures/responseMessages.json";
import credentials from "../Fixtures/credentials.json";
import Joi from "joi";
import dotenv from "dotenv";
import path from "path";
import { SchemaValidation } from "../Fixtures/schemaValidation.js";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let baseUrl;

test.describe("Positive API test cases for Login", async () => {
  test("Login with valid credentials", async ({ authAPI }) => {
    await authAPI.login({});
  });

  test("Login with umlauts", async ({ authAPI }) => {
    await authAPI.login({
      email: process.env.UMLAUTS_MAIL,
      password: process.env.UMLAUTS_PASSWORD,
    });
  });

  test("Validate login response schema", async ({
    authAPI,
    schemaValidation,
  }) => {
    let body = await authAPI.login({ returnBodyOnly: true });
    expect(await schemaValidation.bodySchemaValidation(body)).toBeTruthy();
  });

  test("Login with chinese letters", async ({ authAPI }) => {
    await authAPI.login({
      email: process.env.CHINESE_LETTER_MAIL,
      password: process.env.CHINESE_LETTER_PASSWORD,
    });
  });
});

test.describe("Negative API test cases for Login", async () => {
  test("Login with empty fields", async ({ authAPI }) => {
    let body = await authAPI.login({
      email: "",
      password: "",
      statusCode: 422,
    });
    expect(body.message).toBe(
      "The email field is required. (and 1 more error)"
    );
    expect(body.errors.email[0]).toBe(responseMessages.emailRequired);
    expect(body.errors.password[0]).toBe(responseMessages.passwordRequired);
  });

  test("Login with wrong password", async ({ authAPI, generalMethods }) => {
    let body = await authAPI.login({
      password: generalMethods.randomPassword,
      statusCode: 401,
    });
    expect(body.error).toBe("Unauthorized");
  });

  test("Login with invalid email format", async ({ authAPI }) => {
    let body = await authAPI.login({
      email: credentials.invalidEmail,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.validMailRequired);
    expect(body.errors.email[0]).toBe(responseMessages.validMailRequired);
  });

  test("Login with special characters", async ({ authAPI }) => {
    let body = await authAPI.login({
      email: credentials.emailWithSymbol,
      password: credentials.passwordWithSymbol,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.validMailRequired);
    expect(body.errors.email[0]).toBe(responseMessages.validMailRequired);
  });
});
