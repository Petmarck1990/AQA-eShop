import { expect } from "../BaseObject.js";
import endpoints from "../../Fixtures/endpoints.json";
import { GeneralMethods } from "../../Fixtures/generalMethods.js";
let generalMethods = new GeneralMethods();

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
    this.firstNameValue = generalMethods.randomFirstName();
    this.lastNameValue = generalMethods.randomLastName();
    this.emailValue = generalMethods.randomEmail;
    this.phoneNumberValue = `+${generalMethods.randomCardNumber}`;
    this.adressValue = "Brace Ribnikar 12";
    this.cityValue = "Novi Sad";
    this.postalCodeValue = "21000";
    this.countryValue = "Serbia";
    this.cardholderValue = generalMethods.randomFirstName();
    this.cardNumberValue = generalMethods.randomCardNumber;
    this.cvvValue = "123";
    this.cardTypeValue = "MasterCard";
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
  }

  async rewiewItems() {
    await expect(this.checkMessageFreeOfCharge).toBeVisible();
    await expect(this.notWithMoney).toBeVisible();
    await expect(this.productExist).toBeVisible();
    const responsePromise = this.page.waitForResponse(
      `${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${process.env.USER_ID}/shipping-info`
    );
    await this.nextStepButton.click();
    const response = await responsePromise;
    await expect(response.ok()).toBeTruthy();
    await expect(this.checkMessageCallMeDevil).toBeVisible();
  }

  async addCustomerInfo({
    firstName = this.firstNameValue,
    lastName = this.lastNameValue,
    email = this.emailValue,
    adress = this.adressValue,
    phoneNumber = this.phoneNumberValue,
    city = this.cityValue,
    postalCode = this.postalCodeValue,
    country = this.countryValue,
  }) {
    await this.page.setViewportSize({ width: 1600, height: 1200 });
    await this.makeChanges.click();
    await this.firstName.fill(await firstName);
    await expect(this.firstName).toHaveValue(await firstName);
    await this.lastName.fill(await lastName);
    await expect(this.lastName).toHaveValue(await lastName);
    await this.email.fill(await email);
    await expect(this.email).toHaveValue(await email);
    await this.phoneNumber.fill(await phoneNumber);
    await expect(this.phoneNumber).toHaveValue(await phoneNumber);
    await this.adress.fill(adress);
    await expect(this.adress).toHaveValue(adress);
    await this.city.fill(city);
    await expect(this.city).toHaveValue(city);
    await this.postalCode.fill(postalCode);
    await expect(this.postalCode).toHaveValue(postalCode);
    await this.country.fill(country);
    await expect(this.country).toHaveValue(country);
    await this.updateButton.click();
    const responsePromise = this.page.waitForResponse(
      `${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${process.env.USER_ID}/billing-info`
    );
    await this.nextStepShippingInfo.click();
    const response = await responsePromise;
    await expect(response.ok()).toBeTruthy();
    await expect(this.checkMessageBillingInfo).toBeVisible();
  }

  async addBillingInfo({
    cardholder = this.firstNameValue,
    cardNumber = this.cardNumberValue,
    cvv = this.cvvValue,
  }) {
    await this.page.setViewportSize({ width: 1600, height: 1200 });
    await this.makeChanges.click();
    await this.cardholder.fill(await cardholder);
    await expect(this.cardholder).toHaveValue(await cardholder);
    await this.cardType.click();
    await this.masterCardSelect.click();
    await expect(this.cardType).toHaveText("MasterCardMasterCard");
    await this.cardNumber.fill(await cardNumber);
    await expect(this.cardNumber).toHaveValue(await cardNumber);
    await this.cvv.fill(cvv);
    await expect(this.cvv).toHaveValue(cvv);
    await this.expirationMonthField.click();
    await this.expirationMonthSelect.click();
    await expect(this.expirationMonthField).toHaveText("1111");
    await this.expirationYearField.click();
    await this.expirationYearSelect.click();
    await expect(this.expirationYearField).toHaveText("20302030");
    await this.updateButtonLabel.click();
    await this.nextStepButton.click();
    await expect(this.shippingInfoH3).toBeVisible();
  }

  async checkFinalInformation({
    firstName = this.firstNameValue,
    lastName = this.lastNameValue,
    email = this.emailValue,
    phone = this.phoneNumberValue,
    adress = this.adressValue,
    city = this.cityValue,
    postalCode = this.postalCodeValue,
    country = this.countryValue,
    cardholder = this.firstNameValue,
    cardType = this.cardTypeValue,
    cardNumber = this.cardNumberValue,
    cvv = this.cvvValue,
    expDate = this.expDateValue,
  }) {
    await this.page.setViewportSize({ width: 1600, height: 1080 });
    await expect(this.checkFirsName).toHaveText(await firstName);
    await expect(this.checkLastName).toHaveText(await lastName);
    await expect(this.checkEmail).toHaveText(await email);
    await expect(this.checkPhone).toHaveText(await phone);
    await expect(this.checkAdress).toHaveText(adress);
    await expect(this.checkCity).toHaveText(city);
    await expect(this.checkPostalCode).toHaveText(postalCode);
    await expect(this.checkCountry).toHaveText(country);
    await expect(this.checkCardholder).toHaveText(await cardholder);
    await expect(this.checkCardType).toHaveText(cardType);
    await expect(this.checkCardNumber).not.toHaveText(await cardNumber);
    await expect(this.checkCvv).not.toHaveText(cvv);
    await expect(this.checkExpDate).toHaveText(expDate);
    await this.confirmButton.click();
  }
}
