export class DashboardPage {
  constructor(page) {
    this.searchField = page.locator("#search");
    this.productsContainer = page.locator("[test-id=products-container]");
  }
}
