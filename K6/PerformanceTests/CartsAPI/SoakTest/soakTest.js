import { sleep } from "k6";
import http from "k6/http";
import { getRandomUser, checkResponse } from "../../../Helpers/helpers.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { iterationDuration } from "../../../Helpers/customMetrics.js";

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
    iterationDuration.add(response.timings.duration);

    checkResponse(response, false);
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
