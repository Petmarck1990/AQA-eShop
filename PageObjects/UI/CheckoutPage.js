import { expect } from "../BaseObject.js";
import endpoints from "../../Fixtures/endpoints.json";
import { GeneralMethods } from "../../Fixtures/generalMethods.js";
let generalMethods = new GeneralMethods();
const store = require("../../Utils/globalStorage.js");

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkMessageFreeOfCharge = page.getByText(
      "Free of charge: one never pays here."
    );
    this.notWithMoney = page.getByText("Not with money.");
    this.makeChanges = page.getByText("Make changes");
    this.firstName = page.locator("#first_name");
    this.lastName = page.locator("#last_name");
    this.email = page.locator("#email");
    this.phoneNumber = page.locator("#phone_number");
    this.adress = page.locator("#street_and_number");
    this.city = page.locator("#city");
    this.postalCode = page.locator("#postal_code");
    this.country = page.locator("#country");
    this.updateButtonLabel = page.locator("[aria-label='Update']");
    this.updateButton = page.getByText("Update");
    this.nextStepShippingInfo = page.getByText("Next step");
    this.productName = "NVIDIA GeForce RTX 3080 Ti";
    this.productExist = page.getByText(this.productName);
    this.nextStepButton = page.locator("[aria-label]:has-text('Next step')");
    this.checkMessageCallMeDevil = page.locator(
      "p:has-text('Please, call me the devil')"
    );
    this.checkMessageBillingInfo = page.getByText(
      "Yes... Keep giving me your data..."
    );

    this.cardholder = page.locator("#cardholder");
    this.cardType = page.locator("#card_type");
    this.cardNumber = page.locator("#card_number");
    this.cvv = page.locator("#cvv");
    this.expirationMonthField = page.locator("#card_expiration_month");
    this.expirationYearField = page.locator("#card_expiration_year");
    this.masterCardSelect = page.locator("[aria-label='MasterCard']");
    this.expirationMonthSelect = page.locator("[aria-label='11']");
    this.expirationYearSelect = page.locator("[aria-label='2030']");
    this.comfirmationMessageUpdate = page.locator(
      "div[role='alert]:has-text('Billing information updated!')"
    );
    this.shippingInfoH3 = page.locator("h3:has-text('Shipping information')");
    this.checkFirsName = page.locator("span:text-is('First Name') + span");
    this.checkLastName = page.locator("span:text-is('Last Name') + span");
    this.checkEmail = page.locator("span:text-is('Email') + span");
    this.checkPhone = page.locator("span:text-is('Phone') + span");
    this.checkAdress = page.locator("span:text-is('Street and Number') + span");
    this.checkCity = page.locator("span:text-is('City') + span");
    this.checkPostalCode = page.locator("span:text-is('Postal Code') + span");
    this.checkCountry = page.locator("span:text-is('Country') + span");
    this.checkCardholder = page.locator("span:text-is('Cardholder') + span");
    this.checkCardNumber = page.locator("span:text-is('Card Number') + span");
    this.checkCvv = page.locator("span:text-is('CVV') + span");
    this.checkCardType = page.locator("span:text-is('Card Type') + span");
    this.checkExpDate = page.locator("span:text-is('Expiration Date') + span");
    this.expDateValue = "11/30";
    this.confirmButton = page.locator(
      ".p-button:has-text('Place your order!')"
    );
    this.goBackFinalizePurchase = page.getByLabel("...or not?");
    this.goBackBillingInformation = page.locator(
      "[data-pc-name='button'] [data-pc-section='icon']"
    );
    this.addProductReviewPage = page.locator(".p-button-icon.pi-plus");
  }

  async getProduct(product) {
    return this.page.locator(`bla bla ${product}`);
  }

  async rewiewItems() {
    await expect(this.checkMessageFreeOfCharge).toBeVisible();
    await expect(this.notWithMoney).toBeVisible();
    await expect(this.productExist).toBeVisible();
    const responsePromise = this.page.waitForResponse(`**/shipping-info`);
    await this.nextStepButton.click();
    const response = await responsePromise;
    await expect(response.ok()).toBeTruthy();
    await expect(this.checkMessageCallMeDevil).toBeVisible();
  }

  async addCustomerInfo({
    firstName = store.get("firstName"),
    lastName = store.get("lastName"),
    email = store.get("email"),
    adress = store.get("adress"),
    phoneNumber = store.get("phoneNumber"),
    city = store.get("city"),
    postalCode = store.get("postalCode"),
    country = store.get("country"),
  }) {
    await this.makeChanges.click();
    let inputTextData = [
      { locator: this.firstName, value: firstName },
      { locator: this.lastName, value: lastName },
      { locator: this.email, value: email },
      { locator: this.phoneNumber, value: phoneNumber },
      { locator: this.adress, value: adress },
      { locator: this.city, value: city },
      { locator: this.postalCode, value: postalCode },
      { locator: this.country, value: country },
    ];
    for (let { locator, value } of inputTextData) {
      await locator.fill(await value);
      await expect(locator).toHaveValue(await value);
    }
    await this.updateButton.click();
    const responsePromise = this.page.waitForResponse(`**/billing-info`);
    await this.nextStepShippingInfo.click();
    const response = await responsePromise;
    await expect(response.ok()).toBeTruthy();
    await expect(this.checkMessageBillingInfo).toBeVisible();
  }

  async addBillingInfo({
    cardholder = store.get("firstName"),
    cardNumber = store.get("cardNumber"),
    cvv = store.get("cvv"),
    cardType = this.masterCardSelect,
    expMonth = this.expirationMonthSelect,
  }) {
    await this.makeChanges.click();
    let textData = [
      { locator: this.cardholder, value: cardholder },
      { locator: this.cardNumber, value: cardNumber },
      { locator: this.cvv, value: cvv },
    ];
    for (let { locator, value } of textData) {
      await locator.fill(await value);
      await expect(locator).toHaveValue(await value);
    }
    let dropdownData = [
      {
        checkField: this.cardType,
        selectData: cardType,
        expectValue: "MasterCardMasterCard",
      },
      {
        checkField: this.expirationMonthField,
        selectData: this.expirationMonthSelect,
        expectValue: "1111",
      },
      {
        checkField: this.expirationYearField,
        selectData: this.expirationYearSelect,
        expectValue: "20302030",
      },
    ];
    for (let { checkField, selectData, expectValue } of dropdownData) {
      await checkField.click();
      await selectData.click();
      await expect(checkField).toHaveText(expectValue);
    }
    await this.updateButtonLabel.click();
    const responsePromiseBillingInfo =
      this.page.waitForResponse("**/billing-info");
    const responsePromiseShippingInfo =
      this.page.waitForResponse("**/shipping-info");
    await this.nextStepButton.click();
    const responseBillingInfo = await responsePromiseBillingInfo;
    const responseShippingInfo = await responsePromiseShippingInfo;
    await expect(responseBillingInfo.ok()).toBeTruthy();
    await expect(responseShippingInfo.ok()).toBeTruthy();
    await expect(this.shippingInfoH3).toBeVisible();
  }

  async checkFinalInformation({
    firstName = store.get("firstName"),
    lastName = store.get("lastName"),
    email = store.get("email"),
    phone = store.get("phoneNumber"),
    adress = store.get("adress"),
    city = store.get("city"),
    postalCode = store.get("postalCode"),
    country = store.get("country"),
    cardholder = store.get("firstName"),
    cardType = store.get("cardType"),
    cardNumber = store.get("cardNumber"),
    cvv = store.get("cvv"),
    expDate = this.expDateValue,
  }) {
    let checkData = [
      { locator: this.checkFirsName, value: firstName },
      { locator: this.checkLastName, value: lastName },
      { locator: this.checkEmail, value: email },
      { locator: this.checkPhone, value: phone },
      { locator: this.checkAdress, value: adress },
      { locator: this.checkCity, value: city },
      { locator: this.checkPostalCode, value: postalCode },
      { locator: this.checkCountry, value: country },
      { locator: this.checkCardholder, value: cardholder },
      { locator: this.checkCardType, value: cardType },
      { locator: this.checkCardNumber, value: cardNumber },
      { locator: this.checkCvv, value: cvv },
      { locator: this.checkExpDate, value: expDate },
    ];

    for (let { locator, value } of checkData) {
      if (
        locator === (await this.checkCardNumber) ||
        locator === (await this.checkCvv)
      ) {
        await expect(locator).not.toHaveText(await value);
      } else {
        await expect(locator).toHaveText(await value);
      }
    }
  }
}
