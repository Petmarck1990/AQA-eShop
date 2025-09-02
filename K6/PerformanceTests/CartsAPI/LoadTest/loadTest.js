import { sleep } from "k6";
import http from "k6/http";
import { group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { iterationDuration } from "../../../Helpers/customMetrics.js";
import {
  getRandomUser,
  getAvailableProducts,
  checkResponse,
} from "../../../Helpers/helpers.js";

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "20s", target: 10 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    "custom_iteration_duration{endpoint: getCartById}": ["avg<4000"],
    "custom_iteration_duration{endpoint: addProductToCart}": ["avg<4000"],
    "request_errors{endpoint: getCartById}": ["rate<0.05"],
    "request_errors{endpoint: addProductToCart}": ["rate<0.05"],
    "request_failures{endpint: getCartById}": ["rate<0.05"],
    "request_failures{endpint: addProductToCart}": ["rate<0.05"],
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
      tag: {
        endpoint: "getCartBtId",
      },
    };

    try {
      let response = http.get(url, headers);
      iterationDuration.add(response.timings.duration, {
        endpoint: "getCartBtId",
      });

      checkResponse(response, "getCartBtId");
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
      tag: {
        endpoint: "addProductToCart",
      },
    };

    try {
      let response = http.post(url, headers);

      checkResponse(response, "addProductToCart");
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });
}
export function handleSummary(data) {
  return {
    "testResults.html": htmlReport(data),
    stdout: textSummary(data.metrics, { indent: " ", enableColors: true }),
  };
}
