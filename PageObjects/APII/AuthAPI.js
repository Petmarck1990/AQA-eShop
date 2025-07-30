import { expect } from "../../PageObjects/BaseObject.js";
import endpoints from "../../Fixtures/endpoints.json";
import responseMessages from "../../Fixtures/responseMessages.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { GeneralMethods } from "../../Fixtures/generalMethods.js";
import { request } from "http";
let generalMethods = new GeneralMethods();

export class AuthAPI {
  constructor(request) {
    this.request = request;
  }
  async login({
    email = process.env.EMAIL,
    password = process.env.PASSWORD,
    method = "post",
    statusCode = 200,
  }) {
    let response = await this.request[method](
      process.env.BASE_URL_API + endpoints.loginApiEndoint,
      {
        headers: {
          Accept: "application/json",
        },
        data: {
          email: email,
          password: password,
        },
      }
    );
    switch (statusCode) {
      case 200:
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        let body200 = await response.json();
        expect(body200.user.email).toBe(email);
        expect(body200.user.password).not.toBe(password);
        expect(body200.message).toBe(responseMessages.loginSuccessfully);
        expect(body200.status).toBe("Success");
        let token = body200.auth.token;
        expect(typeof token).toBe("string");
        expect(token).toMatch(
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
        );
        expect(token).toBeTruthy();
        expect(body200.auth.type).toBe("Bearer");
        expect(token.split(".").length).toBe(3);
        expect(token.length).toBeGreaterThan(1);
        return { token, body200 };
      case 422:
        expect(response.status()).toBe(422);
        expect(response.ok()).toBeFalsy();
        let body422 = await response.json();
        return body422;
      case 401:
        expect(response.status()).toBe(401);
        expect(response.ok()).toBeFalsy();
        let body401 = await response.json();
        return body401;
      default:
        error;
    }
  }

  async register({
    username = generalMethods.randomUsername,
    email = generalMethods.randomEmail,
    password = generalMethods.randomPassword,
    method = "post",
    statusCode = 200,
  }) {
    let response = await this.request[method](
      process.env.BASE_URL_API + endpoints.registerApiEndpoint,
      {
        headers: {
          Accept: "application/json",
        },
        data: {
          username: username,
          email: email,
          password: password,
        },
      }
    );
    switch (statusCode) {
      case 200:
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        let body200 = await response.json();
        expect(body200.status).toBe("Success");
        expect(body200.message).toBe(responseMessages.registerSuccessfully);
        expect(body200.user.username).toBe(username);
        expect(body200.user.email).toBe(email);
        expect(body200.user.password).not.toBe(password);
        expect(body200.auth.token).toBeTruthy();
        expect(body200.auth.type).toBe("Bearer");
        let token = body200.auth.token;
        expect(typeof token).toBe("string");
        expect(token).toMatch(
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
        );
        expect(token.split(".").length).toBe(3);
        expect(token.length).toBeGreaterThan(1);
        return token;
      case 422:
        expect(response.status()).toBe(422);
        expect(response.ok()).toBeFalsy();
        let body422 = await response.json();
        return body422;
      case 405:
        expect(response.status()).toBe(405);
        expect(response.ok()).toBeFalsy();
        let body405 = await response.json();
        return body405;
    }
  }
}
