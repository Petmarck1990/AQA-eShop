import { check, sleep } from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";
import {
  getRandomUser,
  getAvailableProducts,
} from "../../../Helpers/helpers.js";
import { group } from "k6";

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "20s", target: 10 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
  },
};

export default function () {
  group("Get Cart by Id", function () {
    let token = getRandomUser({ returnToken: true });
    let cartId = getRandomUser({ returnUserId: true });
    let url = `${baseUrl}/cart/${cartId}`;
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      let response = http.get(url, headers);

      check(response, {
        "Response code is 200": (res) => res.status == 200,
      });
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });
  group("Add product in cart", function () {
    let token = getRandomUser({ returnToken: true });
    let cartId = getRandomUser({ returnUserId: true });
    let productId = getAvailableProducts({ returnRandomId: true });
    let url = `${baseUrl}/cart/${cartId}/products/${productId}`;
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      let response = http.post(url, headers);

      check(response, {
        "Response code is 200": (res) => res.status == 200,
      });
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });
}
