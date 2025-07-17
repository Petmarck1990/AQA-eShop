import generalData from "../../Fixtures/generalData.json";
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.logButton = page.locator("text='Log in'");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.signinButton = page.locator("[aria-label='Sign in']");
    this.welcomeMessage = page.locator("text='Welcome Back!'");
    this.wavingHand = page.locator(".animate-waving-hand");
    this.questionForAcc = page.locator("text='Don't have an account?'");
    this.linkForCreate = page.locator("a:has-text('Create today!')");
    this.linkToPage = generalData.linkToRegisterPage;
    this.likForForgotPassword = page.locator(
      "a:has-text('Forgot your password?')"
    );
    this.linkToForgotPassword = generalData.linkToForgotPassword;
    this.emptyEmailMessage = page.locator(
      "p:has-text('The email field is required.')"
    );
    this.emptyPasswordMessage = page.locator(
      "p:has-text('The password field is required.')"
    );
    this.invalidMailFormatMessage = page.locator(
      "p:has-text('The email field must be a valid email address.')"
    );
    this.dashboardButton = page.locator("a:has-text('Dashboard')");
    this.invalidCredentialsMessage = page.locator(
      "p:has-text('The email address or password you entered is invalid')"
    );
  }
  async goTo() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
    await this.logButton.click();
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signinButton.click();
  }
}
