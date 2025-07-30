import { GeneralMethods } from "../../Fixtures/generalMethods";
import endpoints from "../../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path from "path";
import { expect } from "../../PageObjects/BaseObject.js";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
let generalMethods = new GeneralMethods();

export class RegisterAPI {
  constructor(request) {
    this.baseUrl = process.env.BASEURLAPI;
    this.request = request;
    this.usernameExist = "The username has already been taken.";
    this.emailExist = "The email has already been taken.";
    this.usernameRequired = "The username field is required.";
    this.emailRequired = "The email field is required.";
    this.passwordRequired = "The password field is required.";
    this.invalidEmailFormat = "The email field format is invalid.";
    this.usernameLimitMessage =
      "The username field must not be greater than 255 characters.";
    this.shortPasswordMessage =
      "The password field must be at least 6 characters.";
    this.methodNotAllowedMessage = "Method Not Allowed";
  }
  async registerUser({
    username = generalMethods.randomUsername,
    email = generalMethods.randomEmail,
    password = generalMethods.randomPassword,
    method = "post",
  }) {
    let response = await this.request[method](
      this.baseUrl + endpoints.registerApiEndpoint,
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
    return response;
  }

  async validateUserData({
    username = generalMethods.randomUsername,
    email = generalMethods.randomEmail,
    password = generalMethods.randomPassword,
  }) {
    let response = await this.request.post(
      this.baseUrl + endpoints.registerApiEndpoint,
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
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    let body = await response.json();
    expect(body.status).toBe("Success");
    expect(body.message).toBe("User created successfully");
    expect(body.user.username).toBe(username);
    expect(body.user.email).toBe(email);
    expect(body.user.password).not.toBe(password);
    expect(body.auth.token).toBeTruthy();
    expect(body.auth.type).toBe("Bearer");
    console.log(body);
  }
}
