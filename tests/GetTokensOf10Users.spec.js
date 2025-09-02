import { test } from "../PageObjects/BaseObject.js";
import users from "../K6/TestData/UsersCredentials.json";
import fs from "fs";
import path from "path";

test.describe("Get tokens of 10 users", async () => {
  test("Get tokens of 10 users and store them in json file for k6 tests", async ({
    authAPI,
  }) => {
    let usersTokensIds = [];
    for (let user of users) {
      let body = await authAPI.login({
        email: user.email,
        password: user.password,
        returnBodyOnly: true,
      });
      let token = body.auth.token;
      let userId = body.user.id;
      usersTokensIds.push({ token, userId });
    }
    const filePath = path.join(__dirname, "../K6/TestData", "UsersTokens.json");
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(usersTokensIds, null, 2));
  });
});
