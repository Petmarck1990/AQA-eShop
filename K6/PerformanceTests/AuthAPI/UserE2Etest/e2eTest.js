import http from "k6/http";
import { check, sleep } from "k6";
import { group } from "k6";
// import { Trend, Rate, Counter } from "k6/metrics";
import {
  getAvailableProducts,
  getRandomUser,
} from "../../../Helpers/helpers.js";
import {
  addToCartDuration,
  loginDuration,
  homepageDuration,
  removeFromCartDuration,
  addToCartFailures,
  loginFailures,
  removeFromCartFailures,
  homepageFailures,
  addToCartErrors,
  loginErrors,
  homepageErrors,
  removeFromCartErrors,
} from "../../../Helpers/customMetrics.js";

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
    http_req_failed: ["rate<0.01"],
    addToCart_failures: ["rate<0.01"],
    homepage_failures: ["rate<0.01"],
    login_failures: ["rate<0.01"],
    removeFromCart_failures: ["rate<0.01"],
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
      group("Login new User", function () {
        let url = `${baseUrlApi}/auth/login`;
        let data = {
          email: email,
          password: password,
        };
        let headers = {
          headers: {
            Accept: "application/json",
          },
        };
        try {
          let response = http.post(url, headers, data);
          loginDuration.add(response.timings.duration);

          check(response, {
            "Response status is 200": (res) => res.status === 200,
          });
          if (response.status != 200) {
            loginFailures.add(1);
            loginErrors.add(1);
          }
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
        };

        try {
          let response = http.get(url, headers);

          homepageDuration.add(response.timings.duration);

          check(response, {
            "Response status is 200": (res) => res.status === 200,
          });
          if (response.status != 200) {
            homepageFailures.add(1);
            homepageErrors.add(1);
          }
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
        };

        try {
          let response = http.post(url, headers);

          addToCartDuration.add(response.timings.duration);

          check(response, {
            "Response status is 200": (res) => res.status === 200,
          });
          if (response.status != 200) {
            addToCartFailures.add(1);
            addToCartErrors.add(1);
          }
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
        };

        try {
          let response = http.del(url, headers);

          removeFromCartDuration.add(response.timings.duration);

          check(response, {
            "Response status is 200": (res) => res.status === 200,
          });
          if (response.status != 200) {
            removeFromCartFailures.add(1);
            removeFromCartErrors.add(1);
          }
        } catch (error) {
          throw `Error: ${error.message}`;
        }
        sleep(1);
      });
    }
  );
}
