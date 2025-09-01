import http, { expectedStatuses } from "k6/http";
import { sleep, check } from "k6";
import { expect } from "https://jslib.k6.io/k6-testing/0.3.0/index.js";
import { SharedArray } from "k6/data";

const usersData = new SharedArray("users", function () {
  const users = JSON.parse(open("../../../TestData/UsersCredentials.json"));
  return users;
});

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "30s", target: 30 },
    { duration: "30m", target: 30 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(90)<40000"],
    iteration_duration: ["p(90)<40000"],
  },
};

export default function () {
  const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
  let url = `${baseUrl}/login`;
  let data = {
    email: randomUser.email,
    password: randomUser.password,
  };
  let headers = {
    Accept: "application/json",
  };
  try {
    let response = http.post(url, data, headers);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    check(response, {
      "Body is not empty": (res) => res.body != {},
      "Status is OK": (res) => res.status_text === "200 OK",
      "Status code is 200": (res) => res.status === 200,
    });
  } catch (error) {
    throw `Error: ${error.message}`;
  }
  sleep(1);
}
