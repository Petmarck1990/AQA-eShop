import { GeneralMethods } from "../../Fixtures/generalMethods";
import { expect } from "@playwright/test";
import endpoints from "../../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.emv") });
let generalMethods = new GeneralMethods();

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator("#username");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.registerButton = page.locator("[aria-label='Register']");
    this.regPage = page.locator("[href*='register']");
    this.invalidMailMessage = page.getByText(
      "The email field format is invalid."
    );
    this.tooShortPasswordMessage = page.getByText(
      "The password field must be at least 6 characters."
    );
    this.emptyUsernameMessage = page.getByText(
      "The username field is required."
    );
    this.registerHeadingText = page.getByText("Register!");
    this.questionForAcc = page.getByText("Already have an account?");
    this.instagramIcon = page.locator("a[href*='instagram']");
    this.successRegisterMessage = page.getByText("Successfully registered!");
    this.loginNowRedirectButton = page.locator("a:has-text('Log in now!')");
    this.linkToLoginPage = process.env.BASE_URL + endpoints.loginEndpoint;
    this.tooLongUsernameMessage = page.getByText(
      "The username field must not be greater than 255 characters."
    );
    this.userExistMessage = page.getByText(
      "The username has already been taken."
    );
    this.mailExistMessage = page.getByText("The email has already been taken.");
  }

  async registerNewUser({
    username = generalMethods.randomUsername,
    email = generalMethods.randomEmail,
    password = generalMethods.randomPassword,
  }) {
    await this.username.fill(username);
    await expect(this.username).toHaveValue(username);
    await this.email.fill(email);
    await expect(this.email).toHaveValue(email);
    await this.password.fill(password);
    await expect(this.password).toHaveValue(password);
    await this.registerButton.click();
  }

  async checkPageElements({
    registerHeadingText = this.registerHeadingText,
    questionForAcc = this.questionForAcc,
    username = this.username,
    email = this.email,
    password = this.password,
    registerButton = this.registerButton,
    loginNowRedirectButton = this.loginNowRedirectButton,
    linkToLoginPage = this.linkToLoginPage,
  }) {
    await expect(registerHeadingText).toBeVisible();
    await expect(questionForAcc).toBeVisible();
    await expect(username).toBeVisible();
    await expect(username).toHaveAttribute("placeholder", "Username address");
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("placeholder", "Email");
    await expect(password).toBeVisible();
    await expect(password).toHaveAttribute("placeholder", "Password");
    await expect(registerButton).toBeVisible();
    await expect(registerButton).toBeInViewport();
    await expect(loginNowRedirectButton).toHaveAttribute(
      "href",
      linkToLoginPage
    );
  }
}
