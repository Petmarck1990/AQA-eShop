import { GeneralMethods } from "../Fixtures/generalMethods.js";
import { page } from "../PageObjects/BaseObject.js";
// const generalMethods = new GeneralMethods(page);
const store = require("../Utils/globalStorage.js");
import * as general from "../Fixtures/generalMethods.js";
console.log(general);

async function globalSetup(config) {
  const generalMethods = new GeneralMethods(page);
  store.set("firstName", await generalMethods.randomFirstName());
  store.set("lastName", await generalMethods.randomLastName());
  store.set("email", await generalMethods.randomEmail);
  store.set("phoneNumber", await `+${generalMethods.randomCardNumber}`);
  store.set("cardNumber", await generalMethods.randomCardNumber);
  store.set("country", "Serbia");
  store.set("city", "Novi Sad");
  store.set("postalCode", "21000");
  store.set("adress", "Petefi Sandora 12");
  store.set("cvv", "989");
  store.set("cardType", "MasterCard");
}

export default globalSetup;

await page.locator("text=some text");
await page.locator("#nav-bar:text-is('some text')");
await page.locator(":has-text('some text')");

expect.soft(locator).toBe("value");
