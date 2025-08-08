import { expect } from "../BaseObject.js";
import endpoints from "../../Fixtures/endpoints.json";
import responseMessages from "../../Fixtures/responseMessages.json";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { request } from "http";
import { access } from "fs";

export class ProductsAPI {
  constructor(request) {
    this.request = request;
  }

  async getProductId() {
    let response = await this.request.get(
      process.env.BASE_URL_API + endpoints.productsApiEndpoint,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    const foundProduct = responseBody.products.find(
      (product) => product.in_stock > 0
    );
    if (foundProduct) {
      let productId = foundProduct.id;
      return productId;
    }
  }
}
