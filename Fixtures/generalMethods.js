import { fictures } from "./credentials.json";

export class GeneralMethods {
  get randomNumber() {
    return Math.round(Math.random() * 1000);
  }

  get randomEmail() {
    return `Pet${this.randomNumber}@gmail.com`;
  }

  get randomUsername() {
    return `Petmarck${this.randomNumber}`;
  }

  get randomPassword() {
    return `12345678${this.randomNumber}`;
  }
}
