import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { getProducts, getAvailableProducts } from "../../../Helpers/helpers.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { checkResponse } from "../../../Helpers/helpers.js";
import { iterationDuration } from "../../../Helpers/customMetrics.js";

const usersData = new SharedArray("users", function () {
  const users = JSON.parse(open("../../../TestData/UsersTokens.json"));
  return users;
});

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    custom_iteration_duration: ["avg<4000"],
    request_errors: ["rate<0.05"],
    request_failures: ["rate<0.05"],
  },
};

export default function () {
  const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
  const token = randomUser.token;
  let productIds = getProducts({ getIds: true });
  let productId = productIds[Math.floor(Math.random() * productIds.length)];
  let url = `${baseUrl}/products/${productId}`;
  let headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  try {
    let response = http.get(url, headers);
    iterationDuration.add(response.timings.duration);

    checkResponse(response, false);
  } catch (error) {
    throw `Error: ${error}`;
  }
  sleep(1);
}
export function handleSummary(data) {
  return {
    "testResults.html": htmlReport(data),
  };
}
