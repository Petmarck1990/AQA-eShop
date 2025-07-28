import { test, expect } from "../PageObjects/BaseObject.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

  async getResponse({ endpoint = process.env.BASEURL, statusCode = 200 }) {
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
}
