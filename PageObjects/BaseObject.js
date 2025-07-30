import { test as base, chromium } from "@playwright/test";
import { LoginPage } from "./UI/LoginPage.js";
import { RegisterPage } from "./UI/RegisterPage.js";
import { DashboardPage } from "./UI/DashboardPage.js";
import { GeneralMethods } from "../Fixtures/generalMethods.js";
import { LoginAPI } from "./APII/LoginAPI.js";
import dotenv from "dotenv";
import path from "path";
import { request } from "http";
import { RegisterAPI } from "./APII/RegisterAPI.js";

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
  loginAPI: async ({ request }, use) => {
    await use(new LoginAPI(request));
  },
  registerAPI: async ({ request }, use) => {
    await use(new RegisterAPI(request));
  },
});
export const test = testPages;
export const expect = testPages.expect;
// export const request = request;
