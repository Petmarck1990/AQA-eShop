import http from "k6/http";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const baseUrlApi = JSON.parse(
  open("../TestData/k6BaseUrl.json")
).baseUrlApi;

export const usersData = JSON.parse(open("../TestData/UsersTokens.json"));

export function getRandomUser({ returnToken = false, returnUserId = false }) {
  if (returnToken) {
    let randomUser = usersData[Math.floor(Math.random() * usersData.length)];
    let token = randomUser.token;
    return token;
  } else if (returnUserId) {
    let randomUser = usersData[Math.floor(Math.random() * usersData.length)];
    let userId = randomUser.userId;
    return userId;
  } else {
    return usersData[Math.floor(Math.random() * usersData.length)];
  }
}
let token = getRandomUser({ returnToken: true });

const userToken = getRandomUser({ returnToken: true });

export function getProducts({
  baseUrl = baseUrlApi,
  token = userToken,
  getIds = false,
}) {
  const url = `${baseUrl}/products`;
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  const response = http.get(url, headers);
  let bodyString = response.body;
  let body = JSON.parse(bodyString);
  if (response.status === 200) {
    if (getIds) {
      return body.products.map((p) => p.id);
    } else {
      return body.products;
    }
  }
}

export function getAvailableProducts({ returnRandomId = false }) {
  let availableProducts = [];
  let products = getProducts({});
  if (returnRandomId) {
    let randomProductId = products[Math.floor(Math.random() * products.length)];
    return randomProductId;
  } else {
    for (let product of products) {
      if (product.in_stock > 0) {
        availableProducts.push(product.id);
      }
    }
    return availableProducts;
  }
}

export function randomNumber({ length = 100000 }) {
  return Math.floor(Math.random() * length);
}

export function randomPassword({ length = 12 }) {
  return uuidv4().substring(0, length);
}
