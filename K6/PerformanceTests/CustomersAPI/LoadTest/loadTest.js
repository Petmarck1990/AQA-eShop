import { sleep } from "k6";
import http from "k6/http";
import { group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {
  getRandomUser,
  getProducts,
  usersData,
  checkResponse,
} from "../../../Helpers/helpers.js";
import { iterationDuration } from "../../../Helpers/customMetrics.js";

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
        { duration: "3s", target: 5 },
        { duration: "8s", target: 5 },
        { duration: "3s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    "custom_iteration_duration{endpoint:getCustomers}": ["avg<3000"],
    "custom_iteration_duration{endpoint:customerById}": ["avg<3000"],
    "custom_iteration_duration{endpoint:getBillingInfo}": ["avg<3000"],
    "request_failures{endpoint:getCustomers}": ["rate<0.05"],
    "request_failures{endpoint:customerById}": ["rate<0.05"],
    "request_failures{endpoint:getBillingInfo}": ["rate<0.05"],
    "request_errors{endpoint:getCustomers}": ["rate<0.05"],
    "request_errors{endpoint:customerById}": ["rate<0.05"],
    "request_errors{endpoint:getBillingInfo}": ["rate<0.05"],
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
    let headersTags = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      tags: {
        endpoint: "getCustomers",
      },
    };

    try {
      let response = http.get(url, headersTags);
      iterationDuration.add(response.timings.duration, {
        endpoint: "getCustomers",
      });

      checkResponse(response, "getCustomers");
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
      tags: {
        endpoint: "customerById",
      },
    };
    try {
      let response = http.get(url, headers);
      iterationDuration.add(response.timings.duration, {
        endpoint: "customerById",
      });

      checkResponse(response, "customerById");
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
      tags: {
        endpoint: "getBillingInfo",
      },
    };

    try {
      let response = http.get(url, headers);

      iterationDuration.add(response.timings.duration, {
        endpoint: "getBillingInfo",
      });

      checkResponse(response, "getBillingInfo");
    } catch (error) {
      throw `Error: ${error.message}`;
    }
    sleep(1);
  });
}
export function handleSummary(data) {
  return {
    "testResults.html": htmlReport(data),
  };
}
