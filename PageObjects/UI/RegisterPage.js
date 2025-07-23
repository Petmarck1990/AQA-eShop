import { GeneralMethods } from "../../Fixtures/generalMethods";
import { expect } from "@playwright/test";
let generalMethods = new GeneralMethods();
export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator("#username");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.registerButton = page.locator("[aria-label='Register']");
    this.regPage = page.locator("[href*='register']");
    this.invalidMailMessage = page.locator(
      "p:has-text('The email field format is invalid.')"
    );
    this.invalidPasswordMessage = page.locator(
      "p:has-text('The password field must be at least 6 characters.')"
    );
    this.emptyUsernameMessage = page.locator(
      "p:has-text('The username field is required.')"
    );
    this.registerHeadingText = page.locator("text='Register!'");
    this.questionForAcc = page.locator("text='Already have an account?'");
    this.instagramLink = "https://www.instagram.com/automaticity.qa/";
    this.instagramIcon = page.locator("a[href*='instagram']");
    this.successRegisterMessage = page.locator(
      "text='Successfully registered!'"
    );
    this.linkForLogin = page.locator("a:has-text('Log in now!')");
    this.linkToLoginPage = "https://automaticityacademy.ngrok.app/login";
    this.placeholderAtribute = page.locator();
  }

  async goTo() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
    await this.regPage.click();
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
    linkForLogin = this.linkForLogin,
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
    await expect(linkForLogin).toHaveAttribute("href", linkToLoginPage);
  }
}
