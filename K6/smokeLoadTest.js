import http from "k6/http";
import { SharedArray } from "k6/data";
import { baseUrlApi } from "./Helpers/helpers.js";
import { check, sleep } from "k6";

const userData = new SharedArray("users", function () {
  const users = JSON.parse(open("./TestData/UsersCredentials.json"));
  return users;
});

export const options = {
  vus: 5,
  duration: "20s",

  thresholds: {
    http_req_failed: ["rate<0.01"],
  },
};

// Smoke k6 test to login random user using credentials from UserCredentials.json file
export default function () {
  const randomUser = userData[Math.floor(Math.random() * userData.length)];
  console.log(`${randomUser.email} ${randomUser.password}`);
  let url = `${baseUrlApi}/login`;
  let data = {
    email: randomUser.email,
    password: randomUser.password,
  };

  try {
    let headers = {
      headers: {
        Accept: "application/json",
      },
    };

    let response = http.post(url, data, headers);

    check(response, {
      "Response code is 200": (res) => res.status == 200,
    });
  } catch (error) {
    throw `Error: ${error.message}`;
  }
  sleep(1);
}
