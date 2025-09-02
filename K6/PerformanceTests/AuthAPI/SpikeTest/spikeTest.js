import http from "k6/http";
import { check, sleep } from "k6";
import { expect } from "https://jslib.k6.io/k6-testing/0.3.0/index.js";
import { SharedArray } from "k6/data";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { iterationDuration } from "../../../Helpers/customMetrics.js";
import { checkResponse } from "../../../Helpers/helpers.js";

const usersData = new SharedArray("users", function () {
  const users = JSON.parse(open("../../../TestData/UsersCredentials.json"));
  return users;
});

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "10s", target: 5 },
    { duration: "10s", target: 20 },
    { duration: "30s", target: 20 },
    { duration: "5s", target: 5 },
    { duration: "10s", target: 5 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(90)<40000"],
    iteration_duration: ["p(90)<40000"],
    custom_iteration_duration: ["avg<4000"],
    request_errors: ["rate<0.05"],
    request_failures: ["rate<0.05"],
  },
};

export default function () {
  const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
  let url = `${baseUrl}/auth/login`;
  let data = {
    email: randomUser.email,
    password: randomUser.password,
  };
  let headers = {
    headers: {
      Accept: "application/json",
    },
  };

  try {
    let response = http.post(url, data, headers);
    iterationDuration.add(response.timings.duration);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    checkResponse(response, false);
    check(response, {
      "Method is POST": (res) => res.request.method === "POST",
      "Body is not empty": (res) => res.body != {},
    });
  } catch (error) {
    throw `Error: ${error.message}`;
  }
  sleep(1);
}
export function handleSummary(data) {
  return {
    "testResults.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
