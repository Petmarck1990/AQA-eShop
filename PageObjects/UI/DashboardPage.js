import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(page) {
    this.enabledButton = page.locator(
      "button.p-button[data-pc-name='button']:not([disabled]) svg.h-6"
    );
    this.disabledButton = page.locator(
      'button.p-button.p-disabled[data-pc-name="button"] svg.h-6'
    );
    this.cards = page.locator("[test-id='product-card']");
    this.searchField = page.locator("#search");
    this.productsContainer = page.locator("[test-id='products-container']");
    this.billingInfo = page.getByText("Billing information");
    this.loginBtn = page.locator("#loginBtn");
    this.filterGpu = page.locator("a:has-text('GPUs')");
    this.applyFilters = page.getByLabel("Apply filters");
    this.product = page.locator(
      'div[test-id="product-card"]:has(h1:has-text("NVIDIA GeForce RTX 3080 Ti"))'
    );
    this.addProduct = this.product.locator("button");
    this.productButton = this.product.locator(".hover:fill-indigo-300");
    this.card = page.locator("[test-data='product-container']");
    this.button = page.locator('button:has-text("flex")');
    this.productCards = page.locator("[test-id='product-card']");
    this.cart = page.locator("svg.w-8.h-12");
    this.confirmationMessage = page.locator(
      "div[role ='alert']:has-text('Product added successfully!')"
    );
    this.sidebarOpen = page.locator(".sidebar.open");
    this.addButton = page.locator(".p-button-icon.pi-plus");
    this.removeButton = page.locator(".p-button-icon.pi-minus");
    this.checkout = page.locator("[aria-label='Checkout']");
    this.priceLocator = page.locator(
      "h1:has-text('NVIDIA GeForce RTX 3080 Ti') >> .. >> span.font-semibold"
    );
    this.emptyCartMessage = page.locator(
      ".z-10.text-3xl:has-text('No items in cart. Add some!')"
    );
    this.total = page.locator(".text-lg.mb-4");
    this.clearButton = page.getByText("Clear");
  }

  async cartCheckAndEmpty() {
    await this.cart.click();
    await expect(this.sidebarOpen).toBeVisible();
    let message = expect(this.emptyCartMessage).toBeTruthy();
    if (!message) {
      await this.cart.click();
    } else {
      await this.clearButton.click();
      await expect(this.emptyCartMessage).toBeVisible();
      await this.cart.click();
    }
  }

  async addProductToCart() {
    await this.findAvailableProducts();
    await this.confirmationMessage.waitFor({ state: "visible" });
    await this.cart.click();
    await expect(this.sidebarOpen).toBeVisible();
    await this.checkout.click();
  }

  async findAvailableProducts() {
    let activeButtonLocators = [];
    const totalCards = await this.cards.count();

    for (let i = 0; i < totalCards; i++) {
      const card = this.cards.nth(i);
      const enabledButton = card.locator(
        "button.p-button[data-pc-name='button']:not([disabled]) svg.h-6"
      );
      const isEnabled = (await enabledButton.count()) > 0;
      if (isEnabled) {
        activeButtonLocators.push(enabledButton);
      }
    }
    expect(activeButtonLocators.length).toBeGreaterThan(0);
    return activeButtonLocators[0].click();
  }
}
