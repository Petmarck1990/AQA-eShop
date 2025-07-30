import endpoints from "../../Fixtures/endpoints.json";
import dotenv from "dotenv";
import path from "path";
import { expect } from "@playwright/test";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export class LoginAPI {
  constructor(request) {
    (this.baseUrl = process.env.BASEURLAPI), (this.request = request);
    this.successLoginMessage = "User logged in successfully";
  }
  async getToken({
    email = process.env.EMAIL,
    password = process.env.PASSWORD,
  }) {
    let response = await this.request.post(
      this.baseUrl + endpoints.loginApiEndoint,
      {
        data: {
          email: email,
          password: password,
        },
      }
    );
    expect(response.ok()).toBeTruthy();
    let body = await response.json();
    let token = await body.auth;
    expect(token.type).toBe("Bearer");
    expect(token.token.split(".").length).toBe(3);
    expect(token.token.length).toBe(349);
    return token;
  }

  async tokenValidation(token) {
    expect(token.token).not.toBeNull();
    expect(token.type).toBe("Bearer");
    expect(token.token.split(".").length).toBe(3);
  }

  async loginResponse({
    email = process.env.EMAIL,
    password = process.env.PASSWORD,
  }) {
    let response = await this.request.post(
      this.baseUrl + endpoints.loginApiEndoint,
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
    return response;
  }

  //   let userSchema = {
  //       type: "object",
  //   properties: {
  //     id: { type: "number" },
  //     name: { type: "string" },
  //     email: { type: "string", format: "email" }
  //   },
  //   required: ["id", "name", "email"],
  //   additionalProperties: false
  //   }
}
