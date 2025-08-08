import { expect } from "../BaseObject.js";
import endpoints from "../../Fixtures/endpoints.json";
import responseMessages from "../../Fixtures/responseMessages.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { request } from "http";
import { GeneralMethods } from "../../Fixtures/generalMethods.js";
let generalMethods = new GeneralMethods();

export class CustomersAPI {
  constructor(request) {
    this.request = request;
    this.headers = {
      Authorization: `Bearer ${process.env.TOKEN}`,
      Accept: "application/json",
    };
  }

  async getAllCustomers({ method = "get", statusCode = 200 }) {
    try {
      let response = await this.request[method](
        process.env.BASE_URL_API + endpoints.customersApiEndpoint,
        {
          headers: this.headers,
        }
      );
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.status).toBe("Success");
          return body200;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          return body422;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          return body405;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  async getCustomerId({ username = process.env.USER_NAME }) {
    let body = await this.getAllCustomers({});
    let findCustomer = body.customers.find(
      (customer) => customer.username === username
    );
    if (findCustomer) {
      let customerId = findCustomer.user_id;
      return customerId;
    } else {
      console.log("There is no customer with that username!");
    }
  }

  async getOrDeleteCustomerById({
    customerId,
    method = "get",
    statusCode = 200,
  }) {
    try {
      let response = await this.request[method](
        `
      ${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${customerId}`,
        {
          headers: this.headers,
        }
      );
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.customer.id).toBe(customerId);
          expect(body200.customer.user_id).toBe(customerId);
          expect(body200.customer.email).toMatch(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
          );
          expect(typeof body200.customer.username).toBe("string");
          return body200;
        case 404:
          expect(response.status()).toBe(404);
          expect(response.ok()).toBeFalsy();
          let body404 = await response.json();
          return body404;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          return body405;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          return body422;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  async updateCustomerInfo({
    customerId,
    method = "put",
    username = generalMethods.randomUsername,
    firstName = generalMethods.randomFirstName(),
    lastName = generalMethods.randomLastName(),
    birthday = "1990-07-15",
    email = `${generalMethods.randomUsername}@mail.com`,
    statusCode = 200,
  }) {
    try {
      let response = await this.request[method](
        `
      ${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${customerId}`,
        {
          headers: this.headers,
          data: {
            username: username,
            first_name: await firstName,
            last_name: await lastName,
            date_of_birth: birthday,
            email: email,
          },
        }
      );
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.status).toBe("Success");
          expect(body200.message).toBe("Customer updated successfully.");
          expect(typeof body200.customer.username).toBe("string");
          expect(body200.customer.first_name).toBe(await firstName);
          expect(body200.customer.last_name).toBe(await lastName);
          expect(body200.customer.date_of_birth).toBe(birthday);
          expect(body200.customer.email).toMatch(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
          );
          return body200;
        case 404:
          expect(response.status()).toBe(404);
          expect(response.ok()).toBeFalsy();
          let body404 = await response.json();
          return body404;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          return body405;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          return body422;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  async deleteUsers() {
    for (let i = 171; i <= 415; i++) {
      let response = await this.request.delete(
        `
      ${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${i}`,
        {
          headers: this.headers,
        }
      );
      expect(response.ok()).toBeTruthy();
      let body = await response.json();
      console.log(body.status);
    }
  }

  async getBillingInfoForCustomer({
    customerId,
    method = "get",
    statusCode = 200,
  }) {
    try {
      let response = await this.request[method](
        `${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${customerId}/billing-info`,
        {
          headers: this.headers,
        }
      );
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.status).toBe("Success");
          expect(body200.message).toBe(
            `Billing information for customer ID ${customerId}`
          );
          return body200;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          return body422;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          expect(body405.error).toBe(responseMessages.methodNotAllowed);
          return body405;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (error) {
      throw new Error(`Request failed: ${error}`);
    }
  }

  async updateBillingInfoForCustomer({
    statusCode = 200,
    customerId,
    method = "put",
    cardholder = `${generalMethods.randomFirstName()} ${generalMethods.randomLastName()}`,
    cardType = "Visa",
    cardNumber = generalMethods.randomCardNumber,
    cardExpDate = "12/30",
    cvv = 123,
  }) {
    try {
      let response = await this.request[method](
        `${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${customerId}/billing-info`,
        {
          headers: this.headers,
          data: {
            cardholder: cardholder,
            card_type: cardType,
            card_number: cardNumber,
            cvv: cvv,
            card_expiration_date: cardExpDate,
          },
        }
      );
      // console.log(await response.json());
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.status).toBe("Success");
          expect(body200.message).toBe(
            responseMessages.successfullyUpdateBillingInfo
          );
          expect(body200.billing_info.customer_id).toBe(customerId);
          expect(body200.billing_info.cardholder).toBe(cardholder);
          expect(body200.billing_info.card_type).toBe(cardType);
          expect(body200.billing_info.card_number).toBe(cardNumber);
          expect(body200.billing_info.card_expiration_date).toBe(cardExpDate);
          return body200;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          expect(body422.status).toBe("Error");
          return body422;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          expect(body405.error).toBe(responseMessages.methodNotAllowed);
          return body405;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (errors) {
      throw new Error(`Request failed: ${errors}`);
    }
  }

  async getCustomersShippingInfo({
    customerId,
    method = "get",
    statusCode = 200,
  }) {
    try {
      let response = await this.request[method](
        `${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${customerId}/shipping-info`,
        {
          headers: this.headers,
        }
      );
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.status).toBe("Success");
          expect(body200.message).toBe(
            `Shipping information for customer ID ${customerId}`
          );
          return body200;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          expect(body422.status).toBe("Error");
          return body422;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          expect(body405.error).toBe(responseMessages.methodNotAllowed);
          return body405;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (errors) {
      throw new Error(`Request failed: ${errors}`);
    }
  }

  async updateCustomersShippingInfo({
    customerId,
    method = "put",
    statusCode = 200,
    firstName = generalMethods.randomFirstName(),
    lastName = generalMethods.randomLastName(),
    email = generalMethods.randomEmail,
    adress = "Brace Ribnikar 12",
    phoneNumber = `+${generalMethods.randomCardNumber}`,
    city = "Novi Sad",
    postalCode = 21000,
    country = "Mother Serbia",
  }) {
    try {
      let response = await this.request[method](
        `${process.env.BASE_URL_API}${endpoints.customersApiEndpoint}/${customerId}/shipping-info`,
        {
          headers: this.headers,
          data: {
            first_name: await firstName,
            last_name: await lastName,
            email: email,
            street_and_number: adress,
            phone_number: phoneNumber,
            city: city,
            postal_code: postalCode,
            country: country,
          },
        }
      );
      // console.log(await response.json());
      switch (statusCode) {
        case 200:
          expect(response.status()).toBe(200);
          expect(response.ok()).toBeTruthy();
          let body200 = await response.json();
          expect(body200.status).toBe("Success");
          expect(body200.message).toBe(
            responseMessages.successfullyUpdateShippingInfo
          );
          expect(body200.shipping_info.customer_id).toBe(customerId);
          return body200;
        case 422:
          expect(response.status()).toBe(422);
          expect(response.ok()).toBeFalsy();
          let body422 = await response.json();
          expect(body422.status).toBe("Error");
          return body422;
        case 401:
          expect(response.status()).toBe(401);
          expect(response.ok()).toBeFalsy();
          let body401 = await response.json();
          expect(body401.message).toBe("Unauthenticated.");
          return body401;
        case 404:
          expect(response.status()).toBe(404);
          expect(response.ok()).toBeFalsy();
          let body404 = await response.json();
          expect(body405.error).toBe(responseMessages.methodNotAllowed);
          return body404;
        case 405:
          expect(response.status()).toBe(405);
          expect(response.ok()).toBeFalsy();
          let body405 = await response.json();
          expect(body405.error).toBe(responseMessages.methodNotAllowed);
          return body405;
        default:
          throw new Error(`Unexpected status code: ${response.status()}`);
      }
    } catch (errors) {
      throw new Error(`Request failed: ${errors}`);
    }
  }
}
