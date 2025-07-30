import { expect } from "@playwright/test";
import endpoints from "../../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.logButton = page.locator("text='Log in'");
    // this.email = page.locator("#email");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.signinButton = page.locator("[aria-label='Sign in']");
    this.welcomeMessage = page.getByText("Welcome Back!");
    this.wavingHand = page.locator(".animate-waving-hand");
    this.questionForAcc = page.getByText("Don't have an account?");
    this.linkForCreate = page.getByText("Create today!");
    this.linkToPage = process.env.BASE_URL + endpoints.registerEndpoint;
    this.likForForgotPassword = page.getByText("Forgot your password?");
    this.linkToForgotPassword =
      process.env.BASE_URL + endpoints.forgotPasswordEndpoint;
    this.emptyEmailMessage = page.getByText("The email field is required.");
    this.emptyPasswordMessage = page.getByText(
      "The password field is required."
    );
    this.invalidMailFormatMessage = page.getByText(
      "The email field must be a valid email address."
    );
    this.dashboardButton = page.getByText("Dashboard");
    this.invalidCredentialsMessage = page.getByText(
      "The email address or password you entered is invalid"
    );
  }

  async login({ email = process.env.EMAIL, password = process.env.PASSWORD }) {
    await this.email.fill(email);
    await expect(this.email).toHaveValue(email);
    await this.password.fill(password);
    await expect(this.password).toHaveValue(password);
    await this.signinButton.click();
  }

  async checkPageElemets({
    welcomeMessage = this.welcomeMessage,
    wavingHand = this.wavingHand,
    email = this.email,
    password = this.password,
    signinButton = this.signinButton,
    questionForAcc = this.questionForAcc,
    linkForCreate = this.linkForCreate,
    likForForgotPassword = this.likForForgotPassword,
  }) {
    await expect(welcomeMessage).toBeVisible();
    await expect(wavingHand).toBeVisible();
    await expect(email).toBeVisible();
    await expect(email).toHaveAttribute("placeholder", "Email address");
    await expect(password).toBeVisible();
    await expect(password).toHaveAttribute("placeholder", "Password");
    await expect(signinButton).toBeVisible();
    await expect(questionForAcc).toBeVisible();
    await expect(linkForCreate).toHaveAttribute("href", this.linkToPage);
    await expect(likForForgotPassword).toHaveAttribute(
      "href",
      this.linkToForgotPassword
    );
  }
}
