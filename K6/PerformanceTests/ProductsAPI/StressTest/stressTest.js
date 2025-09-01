import http from "k6/http";
import { expect } from "https://jslib.k6.io/k6-testing/0.3.0/index.js";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const usersData = new SharedArray("users", function () {
  const users = JSON.parse(open("../../../TestData/UsersTokens.json"));
  return users;
});

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "30s", target: 20 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
  },
};

export default function () {
  const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
  const token = randomUser.token;
  let url = `${baseUrl}/products`;
  try {
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    let response = http.get(url, headers);

    expect(response.status).toBe(200);

    check(response, {
      "Status is 200": (res) => res.status === 200,
    });
  } catch (error) {
    throw `Error: ${error.message}`;
  }
  sleep(1);
}
