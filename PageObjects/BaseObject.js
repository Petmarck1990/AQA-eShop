import { test as base, chromium } from "@playwright/test";
import { LoginPage } from "./UI/LoginPage.js";
import { RegisterPage } from "./UI/RegisterPage.js";
import { DashboardPage } from "./UI/DashboardPage.js";
import { GeneralMethods } from "../Fixtures/generalMethods.js";
import { SchemaValidation } from "../Fixtures/schemaValidation.js";
import dotenv from "dotenv";
import path from "path";
import { request } from "http";
import { AuthAPI } from "./API/AuthAPI.js";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const testPages = base.extend({
  wpage: [
    async ({}, use) => {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await use(page);
      await page.close();
      await context.close();
      await browser.close();
    },
    { auto: "true" },
  ],
  loginPage: async ({ wpage }, use) => {
    await use(new LoginPage(wpage));
  },
  registerPage: async ({ wpage }, use) => {
    await use(new RegisterPage(wpage));
  },
  dashboardPage: async ({ wpage }, use) => {
    await use(new DashboardPage(wpage));
  },
  generalMethods: async ({ wpage }, use) => {
    await use(new GeneralMethods(wpage));
  },
  authAPI: async ({ request }, use) => {
    await use(new AuthAPI(request));
  },
  schemaValidation: async ({ request }, use) => {
    await use(new SchemaValidation(request));
  },
});
export const test = testPages;
export const expect = testPages.expect;
