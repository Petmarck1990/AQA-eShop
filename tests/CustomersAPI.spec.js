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
    let body = await customersAPI.updateCustomerInfo({
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

  test("Update billing information for customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      customerId: generalMethods.randomCustomerId,
      cardholder: `${await generalMethods.randomFirstName()} ${await generalMethods.randomLastName()}`,
      cardType: "Visa",
      cardNumber: generalMethods.randomCardNumber,
      cvv: 123,
      cardExpDate: "12/30",
    });
  });

  test("Get customer shipping information", async ({
    customersAPI,
    generalMethods,
  }) => {
    await customersAPI.getCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
    });
  });

  test("Update customer shipping information for a customer", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      firstName: await generalMethods.randomFirstName(),
      lastName: await generalMethods.randomLastName(),
      email: generalMethods.randomEmail,
      adress: "Bul Oslobodjenja 12",
      phoneNumber: `+${generalMethods.randomCardNumber}`,
      city: "Vrbas",
      postalCode: 21460,
      country: "Serbia",
    });
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

  test("Try to update billing information with nulls", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardholder: null,
      cardType: null,
      cardNumber: null,
      cvv: null,
      cardExpDate: null,
    });
    expect(body.errors.cardholder[0]).toBe(responseMessages.cardholderRequired);
    expect(body.errors.card_type[0]).toBe(responseMessages.cardTypeRequired);
    expect(body.errors.card_number[0]).toBe(
      responseMessages.cardNumberRequired
    );
    expect(body.errors.card_expiration_date[0]).toBe(
      responseMessages.cardExpDateRequired
    );
    expect(body.errors.cvv[0]).toBe(responseMessages.cvvRequired);
  });

  test("Try to update billing information with the number of characters over the limit", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString260();
    let numberOf260 = await generalMethods.randomNumbers260();
    let body = await customersAPI.updateBillingInfoForCustomer({
      statusCode: 422,
      customerId: generalMethods.randomCustomerId,
      cardholder: stringOf260,
      cardType: stringOf260,
      cardNumber: numberOf260,
      cvv: numberOf260,
      cardExpDate: numberOf260,
    });
    expect(body.errors.cardholder[0]).toBe(
      responseMessages.cardholderLessThan255
    );
    expect(body.errors.card_type[0]).toBe(responseMessages.cardTypeLessThan20);
    expect(body.errors.card_number[0]).toBe(
      responseMessages.cardNumberLessThan20
    );
    expect(body.errors.card_expiration_date[0]).toBe(
      responseMessages.cardExpDateInvalidFormat
    );
    expect(body.errors.cvv[0]).toBe(responseMessages.cvvMustBeIntiger);
    expect(body.errors.cvv[1]).toBe(responseMessages.cvvMustBe3Digits);
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

  test("Try to update shipping information without country", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      firstName: null,
      lastName: null,
      email: null,
      adress: null,
      phoneNumber: null,
      city: null,
      postalCode: null,
      country: null,
    });
    expect(body.errors.first_name[0]).toBe(responseMessages.firstNameRequired);
    expect(body.errors.last_name[0]).toBe(responseMessages.lastNameRequired);
    expect(body.errors.email[0]).toBe(responseMessages.emailRequired);
    expect(body.errors.street_and_number[0]).toBe(
      responseMessages.adressRequired
    );
    expect(body.errors.phone_number[0]).toBe(responseMessages.phoneNrRequired);
    expect(body.errors.city[0]).toBe(responseMessages.cityRequired);
    expect(body.errors.postal_code[0]).toBe(
      responseMessages.postalCodeRequired
    );
    expect(body.errors.country[0]).toBe(responseMessages.countryRequired);
  });

  test("Try to update shipping information with the number of characters more than 255", async ({
    customersAPI,
    generalMethods,
  }) => {
    let stringOf260 = await generalMethods.randomString260();
    let numberOf260 = await generalMethods.randomNumbers260();
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      firstName: stringOf260,
      lastName: stringOf260,
      email: `${stringOf260}@mail.com`,
      adress: stringOf260,
      phoneNumber: numberOf260,
      city: stringOf260,
      postalCode: numberOf260,
      country: stringOf260,
    });
    expect(body.errors.first_name[0]).toBe(
      responseMessages.firstNameLessThan255
    );
    expect(body.errors.last_name[0]).toBe(responseMessages.lastNameLessThan255);
    expect(body.errors.email[0]).toBe(responseMessages.emailLessThan255);
    expect(body.errors.street_and_number[0]).toBe(
      responseMessages.adressLessThan255
    );
    expect(body.errors.phone_number[0]).toBe(
      responseMessages.phoneNrLessTnah255
    );
    expect(body.errors.city[0]).toBe(responseMessages.cityLesThan255);
    expect(body.errors.postal_code[0]).toBe(
      responseMessages.postalCodeMustBeIntiger
    );
    expect(body.errors.postal_code[1]).toBe(
      responseMessages.postalCodeBetween4And10
    );
    expect(body.errors.country[0]).toBe(responseMessages.countryLessThan255);
  });

  test("Try to update shipping information with phone number,city and adress - less then 6 characters and invalid format", async ({
    customersAPI,
    generalMethods,
  }) => {
    let body = await customersAPI.updateCustomersShippingInfo({
      customerId: generalMethods.randomCustomerId,
      statusCode: 422,
      firstName: "!@123",
      lastName: "!@123",
      phoneNumber: "1s",
      adress: "!",
      city: "1",
    });
    expect(body.errors.first_name[0]).toBe(
      responseMessages.firstNameInvalidFormat
    );
    expect(body.errors.last_name[0]).toBe(
      responseMessages.lastNameInvalidFormat
    );
    expect(body.errors.phone_number[0]).toBe(responseMessages.phoneNrMinimum6);
    expect(body.errors.phone_number[1]).toBe(
      responseMessages.phoneNrInvalidFormat
    );
    expect(body.errors.street_and_number[0]).toBe(
      responseMessages.adressMoreThan3Char
    );
    expect(body.errors.street_and_number[1]).toBe(
      responseMessages.adressInvalidFormat
    );
    expect(body.errors.city[0]).toBe(responseMessages.cityInvalidFormat);
  });
});
