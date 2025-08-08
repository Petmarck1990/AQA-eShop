import { test, expect, request } from "../PageObjects/BaseObject";
import responseMessages from "../Fixtures/responseMessages.json";
import credentials from "../Fixtures/credentials.json";
import dotenv from "dotenv";
import path, { resolve } from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

test.describe("Positive test cases for Customer API", () => {
  test("Get all customers", async ({ customersAPI }) => {
    await customersAPI.getAllCustomers({});
  });

  test("Get Customer by Id", async ({ customersAPI, generalMethods }) => {
    let body = await customersAPI.getOrDeleteCustomerById({
      customerId: generalMethods.randomCustomerId,
    });
  });

  test("Validate schema of Customer data", async ({
    customersAPI,
    schemaValidation,
    generalMethods,
  }) => {
    let body = await customersAPI.getOrDeleteCustomerById({
      customerId: generalMethods.randomCustomerId,
    });
    expect(await schemaValidation.customerSchemaValidation(body)).toBeTruthy();
  });

  test("Update customer first name, last name, date of birth and email", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.updateCustomerInfo({
      customerId: generalMethods.randomCustomerId,
    });
  });

  test("Get billing information for a customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.getBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
    });
  });

  test("Update cardholder value", async ({ customersAPI, generalMethods }) => {
    let cardholder = `${await generalMethods.randomFirstName()} ${await generalMethods.randomLastName()}`;
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      cardholder: cardholder,
    });
    expect(body.billing_info.cardholder).toBe(cardholder);
  });

  test("Update billing information for customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    let cardType = "Visa";
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      cardType: cardType,
    });
    expect(body.billing_info.card_type).toBe(cardType);
  });

  test("Update card number", async ({ customersAPI, generalMethods }) => {
    let cardNumber = generalMethods.randomCardNumber;
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      cardNumber: cardNumber,
    });
    expect(body.billing_info.card_number).toBe(cardNumber);
  });

  test("Update cvv", async ({ customersAPI, generalMethods }) => {
    let cvv = 123;
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      cvv: cvv,
    });
    expect(body.billing_info.cvv).toBe(cvv);
  });

  test("Update card expiration date", async ({
    customersAPI,
    generalMethods,
  }) => {
    let cardExpDate = "12/30";
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      cardExpDate: cardExpDate,
    });
    expect(body.billing_info.card_expiration_date).toBe(cardExpDate);
  });

  test("Get customer shipping information", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.getCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
    });
  });

  test("Update first name field", async ({ customersAPI, generalMethods }) => {
    let firstName = await generalMethods.randomFirstName();
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      firstName: firstName,
    });
    expect(body.shipping_info.first_name).toBe(firstName);
    expect(typeof body.shipping_info.first_name).toBe("string");
  });

  test("Update last name field", async ({ customersAPI, generalMethods }) => {
    let lastName = await generalMethods.randomLastName();
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      lastName: lastName,
    });
    expect(body.shipping_info.last_name).toBe(lastName);
    expect(typeof body.shipping_info.last_name).toBe("string");
  });
  test("Update email field", async ({ customersAPI, generalMethods }) => {
    let email = generalMethods.randomEmail;
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      email: email,
    });
    expect(body.shipping_info.email).toBe(email);
  });

  test("Update street and number field", async ({
    customersAPI,
    generalMethods,
  }) => {
    let adress = "Random Street 99";
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      adress: adress,
    });
    expect(body.shipping_info.street_and_number).toBe(adress);
  });

  test("Update phone number", async ({ customersAPI, generalMethods }) => {
    let phoneNr = `+${generalMethods.randomCardNumber}`;
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      phoneNumber: phoneNr,
    });
    expect(body.shipping_info.phone_number).toBe(phoneNr);
  });

  test("Update city", async ({ customersAPI, generalMethods }) => {
    let city = "Sentomas";
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      city: city,
    });
    expect(body.shipping_info.city).toBe(city);
  });

  test("Update postal code", async ({ customersAPI, generalMethods }) => {
    let postalCode = 21460;
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      postalCode: postalCode,
    });
    expect(body.shipping_info.postal_code).toBe(postalCode);
    expect(typeof body.shipping_info.postal_code).toBe("number");
  });

  test("Update customer shipping information for a customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    let country = "Serbia";
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      country: country,
    });
    expect(body.shipping_info.country).toBe(country);
  });

  test("Customer shipping information schema validation", async ({
    customersAPI,
    schemaValidation,
  }) => {
    let body = await customersAPI.getCustomersShippingInfo({
      customerId: 417,
    });
    expect(
      await schemaValidation.shippingInfoSchemaValidation(body)
    ).toBeTruthy();
  });
});

test.describe("Negative test cases for Customer API", async () => {
  test("Try to get all customers with wrong method", async ({
    customersAPI,
  }) => {
    let body = await customersAPI.getAllCustomers({
      method: "put",
      statusCode: 405,
    });
    expect(body.error).toBe(responseMessages.methodNotAllowed);
  });

  test("Try to get non-existent customer (invalid id: -1)", async ({
    customersAPI,
  }) => {
    let body = await customersAPI.getOrDeleteCustomerById({
      customerId: -1,
      statusCode: 404,
    });
    expect(body.error).toMatch(/No customer found with ID -?\d+ found/);
  });

  test("Try to get customer with id more than 19 digits", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.getOrDeleteCustomerById({
      customerId: generalMethods.randomCardNumber.repeat(2),
      statusCode: 422,
    });
  });

  test("Update customer email with invalid email", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.updateCustomerInfo({
      customerId: generalMethods.randomCustomerId,
      email: `${generalMethods.randomUsername}${credentials.emailWithSymbol}`,
      statusCode: 422,
    });
  });

  test("Update customer day of birth with wrong date format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomerInfo({
      customerId: generalMethods.randomCustomerId,
      birthday: "07.08.1990",
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.matchFormatOfDate);
    expect(body.errors.date_of_birth[0]).toBe(
      responseMessages.matchFormatOfDate
    );
  });

  test("Update customer day of birth to have less then 16 years", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomerInfo({
      customerId: generalMethods.randomCustomerId,
      birthday: "2020-12-12",
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.youngerThan16);
    expect(body.errors.date_of_birth[0]).toBe(responseMessages.youngerThan16);
  });

  test("Update customer info with wrong method", async ({ customersAPI }) => {
    let body = await customersAPI.updateCustomerInfo({
      method: "post",
      username: "Username",
      statusCode: 405,
    });
    expect(body.error).toBe(responseMessages.methodNotAllowed);
  });

  test("Update customer first name with invalid type", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomerInfo({
      customerId: generalMethods.randomCustomerId,
      firstName: true,
      statusCode: 422,
    });
    expect(body.message).toBe(responseMessages.firstNameMustBeString);
    expect(body.errors.first_name[0]).toBe(
      responseMessages.firstNameMustBeString
    );
  });

  test("Try to update cardholder field with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardholder: null,
    });
    expect(body.errors.cardholder[0]).toBe(responseMessages.cardholderRequired);
  });

  test("Try to update card type field with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardType: null,
    });
    expect(body.errors.card_type[0]).toBe(responseMessages.cardTypeRequired);
  });

  test("Try to update card number field with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardNumber: null,
    });
    expect(body.errors.card_number[0]).toBe(
      responseMessages.cardNumberRequired
    );
  });

  test("Try to update cvv field with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cvv: null,
    });
    expect(body.errors.cvv[0]).toBe(responseMessages.cvvRequired);
  });

  test("Try to update card expitarion field with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardExpDate: null,
    });
    expect(body.errors.card_expiration_date[0]).toBe(
      responseMessages.cardExpDateRequired
    );
  });

  test("Try to update cardholder field with the number of characters over the limit", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardholder: stringOf260,
    });
    expect(body.errors.cardholder[0]).toBe(
      responseMessages.cardholderLessThan255
    );
  });

  test("Try to update card type field with the number of characters over the limit", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardType: stringOf260,
    });
    expect(body.errors.card_type[0]).toBe(responseMessages.cardTypeLessThan20);
  });

  test("Try to update card number field with the number of characters over the limit", async ({
    customersAPI,
    generalMethods,
  }) => {
    let numberOf260 = await generalMethods.randomNumbers({});
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardNumber: numberOf260,
    });
    expect(body.errors.card_number[0]).toBe(
      responseMessages.cardNumberLessThan20
    );
  });

  test("Try to update cvv field with the number of characters over the limit", async ({
    customersAPI,
    generalMethods,
  }) => {
    let numberOf260 = await generalMethods.randomNumbers({});
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cvv: numberOf260,
    });
    expect(body.errors.cvv[0]).toBe(responseMessages.cvvMustBeIntiger);
    expect(body.errors.cvv[1]).toBe(responseMessages.cvvMustBe3Digits);
  });

  test("Try to update card expiration date field with the number of characters over the limit", async ({
    customersAPI,
    generalMethods,
  }) => {
    let numberOf260 = await generalMethods.randomNumbers({});
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardExpDate: numberOf260,
    });
    expect(body.errors.card_expiration_date[0]).toBe(
      responseMessages.cardExpDateInvalidFormat
    );
  });

  test("Try to update card number in billing information with less than 12 characters", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      cardNumber: 1234567890,
    });
    expect(body.errors.card_number[0]).toBe(
      responseMessages.cardNumberLessThan12
    );
  });

  test("Try to update card number in billing information with characters", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      cardNumber: "cardNumberString",
    });
  });

  test("Try to get billing information for a customer with wrong method", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.getBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      method: "delete",
      statusCode: 405,
    });
  });

  test("Add cvv with 2 digits in billing information for customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cvv: 12,
    });
    expect(body.errors.cvv[0]).toBe(responseMessages.cvvMustBe3Digits);
  });

  test("Add invalid card expiration date format in billing information for customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardExpDate: "12/30ST",
    });
    expect(body.errors.card_expiration_date[0]).toBe(
      responseMessages.wrongCardExpDateFormat
    );
  });

  test("Try to get customer shipping information with wrong method", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.getCustomersShippingInfo({
      statusCode: 405,
      method: "delete",
      customerId: generalMethods.randomCustomerId,
    });
  });

  test("Try to update first name with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      firstName: null,
    });
    expect(body.errors.first_name[0]).toBe(responseMessages.firstNameRequired);
  });

  test("Try to update last name with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      lastName: null,
    });
    expect(body.errors.last_name[0]).toBe(responseMessages.lastNameRequired);
  });

  test("Try to update email with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      email: null,
    });
    expect(body.errors.email[0]).toBe(responseMessages.emailRequired);
  });

  test("Try to update street and number with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      adress: null,
    });
    expect(body.errors.street_and_number[0]).toBe(
      responseMessages.adressRequired
    );
  });

  test("Try to update phone number with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      phoneNumber: null,
    });
    expect(body.errors.phone_number[0]).toBe(responseMessages.phoneNrRequired);
  });

  test("Try to update city with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      city: null,
    });
    expect(body.errors.city[0]).toBe(responseMessages.cityRequired);
  });

  test("Try to update postal code with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      postalCode: null,
    });
    expect(body.errors.postal_code[0]).toBe(
      responseMessages.postalCodeRequired
    );
  });

  test("Try to update country with null", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      country: null,
    });
    expect(body.errors.country[0]).toBe(responseMessages.countryRequired);
  });

  test("Try to update first name with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      firstName: stringOf260,
    });
    expect(body.errors.first_name[0]).toBe(
      responseMessages.firstNameLessThan255
    );
  });

  test("Try to update last name with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      lastName: stringOf260,
    });
    expect(body.errors.last_name[0]).toBe(responseMessages.lastNameLessThan255);
  });

  test("Try to update email with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      email: `${stringOf260}@mail.com`,
    });
    expect(body.errors.email[0]).toBe(responseMessages.emailLessThan255);
  });

  test("Try to update street and number with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      adress: stringOf260,
    });
    expect(body.errors.street_and_number[0]).toBe(
      responseMessages.adressLessThan255
    );
  });

  test("Try to update phone number with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let numberOf260 = await generalMethods.randomNumbers({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      phoneNumber: numberOf260,
    });
    expect(body.errors.phone_number[0]).toBe(
      responseMessages.phoneNrLessTnah255
    );
  });

  test("Try to update city with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      city: stringOf260,
    });
    expect(body.errors.city[0]).toBe(responseMessages.cityLesThan255);
  });

  test("Try to update postal code with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let numberOf260 = await generalMethods.randomNumbers({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      postalCode: numberOf260,
    });
    expect(body.errors.postal_code[0]).toBe(
      responseMessages.postalCodeMustBeIntiger
    );
    expect(body.errors.postal_code[1]).toBe(
      responseMessages.postalCodeBetween4And10
    );
  });

  test("Try to update country with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString({});
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      country: stringOf260,
    });
    expect(body.errors.country[0]).toBe(responseMessages.countryLessThan255);
  });

  test("Try to update first name with less then 6 characters and invalid format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      firstName: "!@2",
    });
    expect(body.errors.first_name[0]).toBe(
      responseMessages.firstNameInvalidFormat
    );
  });

  test("Try to update phone number with less then 6 characters and invalid format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      phoneNumber: "1s",
    });
    expect(body.errors.phone_number[0]).toBe(responseMessages.phoneNrMinimum6);
    expect(body.errors.phone_number[1]).toBe(
      responseMessages.phoneNrInvalidFormat
    );
  });

  test("Try to update last name with less then 6 characters and invalid format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      lastName: "!@123",
    });
    expect(body.errors.last_name[0]).toBe(
      responseMessages.lastNameInvalidFormat
    );
  });

  test("Try to update street and number with less then 6 characters and invalid format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      adress: "!",
    });
    expect(body.errors.street_and_number[0]).toBe(
      responseMessages.adressMoreThan3Char
    );
    expect(body.errors.street_and_number[1]).toBe(
      responseMessages.adressInvalidFormat
    );
  });

  test("Try to update city with less then 6 characters and invalid format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      city: "1",
    });
    expect(body.errors.city[0]).toBe(responseMessages.cityInvalidFormat);
  });
});
