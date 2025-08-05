export class DashboardPage {
  constructor(page) {
    this.searchField = page.locator("#search");
    this.productsContainer = page.locator("[test-id='products-container']");
    this.billingInfo = page.getByText("Billing information");
    this.loginBtn = page.locator("#loginBtn");
  }
}
