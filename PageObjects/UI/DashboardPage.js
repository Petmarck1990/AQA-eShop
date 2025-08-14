import { expect } from "@playwright/test";

export class DashboardPage {
  constructor(page) {
    this.page = page;
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
    this.emptyCartMessage = page.getByText("No items in cart. Add some!");
    this.total = page.locator(".text-lg.mb-4");
    this.clearButton = page.getByText("Clear");
  }

  async cartCheckAndEmpty() {
    await this.cart.click();
    await expect(this.sidebarOpen).toBeVisible();
    let message = await this.emptyCartMessage.isVisible();
    if (message) {
      await this.cart.click();
    } else {
      await this.clearButton.click();
      await expect(this.emptyCartMessage).toBeVisible();
      await this.cart.click();
    }
  }

  async addProductToCart() {
    await this.findSpecificProduct({});
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

  async findSpecificProduct({ name = "NVIDIA GeForce RTX 3080 Ti" }) {
    let specificProduct = await this.page.locator(
      `div[test-id="product-card"]:has(h1:has-text("${name}"))`
    );
    let button = await specificProduct.locator("button");
    let className = await button.getAttribute("class");
    let isDisabled = className.includes("p-disabled");
    if (specificProduct) {
      if (!isDisabled) {
        return button.click();
      } else {
        throw new Error(`${name} is Out of Stock`);
      }
    }
  }
}
