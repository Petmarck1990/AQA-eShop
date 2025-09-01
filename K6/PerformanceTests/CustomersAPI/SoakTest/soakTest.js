import { check, sleep } from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";

const usersData = new SharedArray("users", function () {
  const users = JSON.parse(open("../../../TestData/UsersCredentials.json"));
  return users;
});

const baseUrl = JSON.parse(open("../../../TestData/k6BaseUrl.json")).baseUrlApi;

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "15s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],
  },
};

export default function () {
  const randomUser = usersData[Math.floor(Math.random() * usersData.length)];
  const token = randomUser.token;
  let url = `${baseUrl}/customers`;
  let headers = {
    headers: {
      Authorization: `${token}`,
      Accept: "application/json",
    },
  };
  try {
    let response = http.get(url, headers);

    check(response, {
      "Response code is 200": (res) => res.status === 200,
    });
  } catch (error) {
    throw `${error.message}`;
  }
  sleep(1);
}
