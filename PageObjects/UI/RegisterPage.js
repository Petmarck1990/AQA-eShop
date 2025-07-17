import { GeneralMethods } from "../../Fixtures/generalMethods";
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
    this.emptyString = "";
    this.registerHeadingText = page.locator("text='Register!'");
    this.questionForAcc = page.locator("text='Already have an account?'");
    this.instagramLink = "https://www.instagram.com/automaticity.qa/";
    this.instagramIcon = page.locator("a[href*='instagram']");
    this.successRegisterMessage = page.locator(
      "text='Successfully registered!'"
    );
    this.linkForLogin = page.locator("a:has-text('Log in now!')");
    this.linkToLoginPage = "https://automaticityacademy.ngrok.app/login";
  }

  async goTo() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
    await this.regPage.click();
  }

  async registerNewUser(username, email, password) {
    await this.username.fill(username);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.registerButton.click();
  }
}
