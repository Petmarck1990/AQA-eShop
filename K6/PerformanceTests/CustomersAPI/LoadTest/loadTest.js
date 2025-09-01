import { check, sleep } from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";
import { Trend, Rate, Counter } from "k6/metrics";
import { group } from "k6";
import {
  getRandomUser,
  getProducts,
  usersData,
} from "../../../Helpers/helpers.js";
import {
  getCustomersFailures,
  getCustomersDuration,
  getCustomersErrors,
  getCustomerByIdFailures,
  getCustomerByIdDuration,
  getCustomersByIdErrors,
  getBillingInfoFailures,
  getBillingInfoDuration,
  getBillingInfoErrors,
} from "../../../Helpers/customMetrics.js";

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

// Setup that return "data" as array of customers IDs and random token for authorization.
export function setup() {
  let dataOfUsers = usersData;
  let productsId = getProducts({ getIds: true });
  let productId = productsId[Math.floor(Math.random() * productsId.length)];
  const usersIds = getRandomUser({ returnUserId: true });
  const userId = usersIds[Math.floor(Math.random() * usersIds.length)];
  return { userId, dataOfUsers, productId };
}

// Set 2 different scenarios, one with constant vus and one with ramping, and add both of them to allTest
//(exec: "allTest") so in all tests both scenrios will be performed.
export const options = {
  scenarios: {
    constant_vus_scenario: {
      executor: "constant-vus",
      exec: "allTests",
      duration: "10s",
      vus: 5,
    },
    ramping_vus_scenario: {
      executor: "ramping-vus",
      exec: "allTests",
      startVUs: 0,
      stages: [
        { duration: "5s", target: 10 },
        { duration: "10s", target: 10 },
        { duration: "5s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.10"],
  },
};
// Set token and user ID before groups will share same token and user Id across all grups and will generate new
// token and user ID in every iteration
export function allTests(data) {
  let user = getRandomUser({});
  let token = user.token;
  let userId = user.userId;
  group("Get all customers", function () {
    let url = `${baseUrl}/customers`;
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      let response = http.get(url, headers);

      getCustomersDuration.add(response.timings.duration);
      getCustomersFailures.add(response.status !== 200);
      getCustomersErrors.add(response.status != 200);

      check(response, {
        "Response code is 200": (res) => res.status === 200,
      });
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });

  group("Get customer by ID", function () {
    let url = `${baseUrl}/customers/${userId}`;
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    try {
      let response = http.get(url, headers);

      getCustomerByIdDuration.add(response.timings.duration);
      getCustomerByIdFailures.add(response.status !== 200);
      getCustomersByIdErrors.add(response.status != 200);

      check(response, {
        "Response code is 200": (res) => res.status === 200,
      });
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });
  group("Get billing info by customers ID", function () {
    let url = `${baseUrl}/customers/${userId}/billing-info`;
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      let response = http.get(url, headers);

      getBillingInfoDuration.add(response.timings.duration);
      getBillingInfoFailures.add(response.status !== 200);
      getBillingInfoErrors.add(response.status != 200);

      check(response, {
        "Response code is 200": (res) => res.status === 200,
      });
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });
}
