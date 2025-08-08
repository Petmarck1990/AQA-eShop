import { expect } from "../BaseObject.js";
import endpoints from "../../Fixtures/endpoints.json";
import responseMessages from "../../Fixtures/responseMessages.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { request } from "http";
import { access } from "fs";

export class CartsAPI {
  construktor(request) {
    this.request = request;
  }
  async addProductToTheCart(cartId, productId) {
    let response = this.request.post(
      `${process.env.BASE_URL_API}${endpoints.cartApiEndpoint}${cartId}/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    expect(response.ok()).toBeTruthy();
    let body = response.json();
    return body;
  }
}
