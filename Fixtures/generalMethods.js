import { expect, test } from "../PageObjects/BaseObject.js";
import { page } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { request } from "http";
import fs from "fs";
import endpoint from "../Fixtures/endpoints.json";

export class GeneralMethods {
  constructor(page) {
    this.page = page;
  }
  get randomNumber() {
    return Math.round(Math.random() * 100000);
  }

  get randomEmail() {
    return `Pet${this.randomNumber}@gmail.com`;
  }

  get randomUsername() {
    return `Petmarck${this.randomNumber}`;
  }

  get randomPassword() {
    return `12345678${this.randomNumber}`;
  }

  async getResponse({ endpoint = process.env.BASE_URL, statusCode = 200 }) {
    const response = await this.page.waitForResponse(
      (response) =>
        response.url().includes(endpoint) && response.status() === statusCode
    );
    return response;
  }

  async checkResponseStatus(endpoint) {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(endpoint)
    );
    return response.status();
  }

  async goToPage({ url = "" }) {
    await this.page.goto(url);
    await this.page.waitForLoadState("networkidle");
  }

  async tokenValidation(token) {
    if (!token) {
      const getToken = await this.page.evaluate(
        (key) => localStorage.getItem(key),
        "token"
      );
      expect(getToken).toBeTruthy();
      expect(getToken.split(".").length).toBe(3);
      expect(getToken.length).toBe(349);
    } else {
      expect(token).toBeTruthy();
      expect(token.split(".").length).toBe(3);
      expect(token.length).toBe(349);
    }
  }

  async getValueFromLocalStorage(value) {
    return await this.page.evaluate((key) => localStorage.getItem(key), value);
  }

  async insertTokenInLocalStorage(token) {
    this.page.addInitScript((value) => {
      window.localStorage.setItem("token", value);
    }, token);
  }

  async writeTokenInEnvFile(token) {
    const envFilePath = path.resolve(__dirname, "../.env");
    let envContent = "";
    envContent = fs.readFileSync(envFilePath, "utf8");
    const tokenRegex = /^(TOKEN)=.*/m;
    const tokenExists = tokenRegex.test(envContent);
    if (tokenExists) {
      envContent = envContent.replace(tokenRegex, `TOKEN=${token}`);
    } else {
      envContent += `TOKEN=${token}`;
    }
    fs.writeFileSync(envFilePath, envContent, "utf8");
  }
}
