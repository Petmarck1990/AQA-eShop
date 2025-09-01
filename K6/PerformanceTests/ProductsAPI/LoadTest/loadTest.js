import http from "k6/http";
import { check, sleep } from "k6";
import { expect } from "https://jslib.k6.io/k6-testing/0.3.0/index.js";
import { SharedArray } from "k6/data";
import { getProducts, getAvailableProducts } from "../../../Helpers/helpers.js";

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

    check(response, {
      "Status is 200": (res) => res.status === 200,
    });
  } catch (error) {
    throw `Error: ${error}`;
  }
  sleep(1);
}
