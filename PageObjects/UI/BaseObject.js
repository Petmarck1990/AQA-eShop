import { test as base, chromium } from "@playwright/test";
import { LoginPage } from "./LoginPage.js";
import { RegisterPage } from "./RegisterPage.js";
import { DashboardPage } from "./DashboardPage.js";
import { GeneralMethods } from "../../Fixtures/generalMethods.js";
// import { GeneralMethods } from "../../Fixtures/generalMethods.js";
// import credentials from "../../Fixtures/credentials.json";
// import generalData from "../../Fixtures/generalData.json";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const testPages = base.extend({
  wpage: [
    async ({}, use) => {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await use(page, context);
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
});
export const test = testPages;
export const expect = testPages.expect;
