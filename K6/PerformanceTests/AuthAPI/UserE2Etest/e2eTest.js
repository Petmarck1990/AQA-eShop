import http from "k6/http";
import { sleep } from "k6";
import { group } from "k6";
import {
  getAvailableProducts,
  getRandomUser,
  checkResponse,
} from "../../../Helpers/helpers.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { iterationDuration } from "../../../Helpers/customMetrics.js";

const baseUrlApi = JSON.parse(
  open("../../../TestData/k6BaseUrl.json")
).baseUrlApi;
const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrl;
const credentials = JSON.parse(open("../../../TestData/UsersCredentials.json"));

export const options = {
  stages: [
    { duration: "3s", target: 5 },
    { duration: "5s", target: 5 },
    { duration: "2s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    "custom_iteration_duration{endpoint: login}": ["avg<4000"],
    "custom_iteration_duration{endpoint: dashboard}": ["avg<4000"],
    "custom_iteration_duration{endpoint: addProduct}": ["avg<4000"],
    "custom_iteration_duration{endpoint: removeProduct}": ["avg<4000"],
    "request_errors{endpoint: login}": ["rate<0.05"],
    "request_errors{endpoint: dashboard}": ["rate<0.05"],
    "request_errors{endpoint: addProduct}": ["rate<0.05"],
    "request_errors{endpoint: removeProduct}": ["rate<0.05"],
    "request_failures{endpoint: login}": ["rate<0.05"],
    "request_failures{endpoint: dashboard}": ["rate<0.05"],
    "request_failures{endpoint: addProduct}": ["rate<0.05"],
    "request_failures{endpoint: removeProduct}": ["rate<0.05"],
  },
};

//Small end to end load test

export default function () {
  group(
    "E2E test for login, access protected page, add product in cart and remove product from cart",
    function () {
      let token = getRandomUser({ returnToken: true });
      let randomUser =
        credentials[Math.floor(Math.random() * credentials.length)];
      let email = randomUser.email;
      let password = randomUser.password;
      let userId = getRandomUser({ returnUserId: true });
      let cartId = userId;
      let availableProduct = getAvailableProducts({});
      let productId =
        availableProduct[Math.floor(Math.random() * availableProduct.length)];
      group("User login", function () {
        let url = `${baseUrlApi}/auth/login`;
        let data = {
          email: email,
          password: password,
        };
        let headers = {
          headers: {
            Accept: "application/json",
          },
          tag: {
            endpoint: "login",
          },
        };
        try {
          let response = http.post(url, headers, data);
          iterationDuration.add(response.timings.duration, {
            endpoint: "login",
          });

          checkResponse(response, "login");
        } catch (error) {
          throw `Error: ${error.message}`;
        }
        sleep(1);
      });
      group("Go to dashboard page", function () {
        let url = `${baseUrl}/dashboard`;
        let headers = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          tag: {
            endpoint: "dashboard",
          },
        };

        try {
          let response = http.get(url, headers);
          iterationDuration.add(response.timings.duration, {
            endpoint: "dashboard",
          });

          checkResponse(response, "dashboard");
        } catch (error) {
          throw `Error: ${error.message}`;
        }
        sleep(1);
      });

      group("Add product in cart", function () {
        let url = `${baseUrlApi}/cart/${cartId}/products/${productId}}`;
        let headers = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          tag: {
            endpoint: "addProduct",
          },
        };

        try {
          let response = http.post(url, headers);
          iterationDuration.add(response.timings.duration, {
            endpoint: "addProduct",
          });

          checkResponse(response, "dashboard");
        } catch (error) {
          throw `Error: ${error.message}`;
        }
        sleep(1);
      });

      group("Remove product from cart", function () {
        let url = `${baseUrlApi}/cart/${cartId}/products/${productId}}`;
        let headers = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          tag: {
            endpoint: "removeProduct",
          },
        };

        try {
          let response = http.del(url, headers);
          iterationDuration.add(response.timings.duration, {
            endpoint: "removeProduct",
          });

          checkResponse(response, "dashboard");
        } catch (error) {
          throw `Error: ${error.message}`;
        }
        sleep(1);
      });
    }
  );
}
export function handleSummary(data) {
  return {
    "testResults.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
