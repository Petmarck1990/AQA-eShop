export class GeneralMethods {
  constructor(page) {
    this.page = page;
  }
  get randomNumber() {
    return Math.round(Math.random() * 100000);
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

  async getResponse(endpoint) {
    const response = await this.page.waitForResponse(
      (response) =>
        response.url().includes(endpoint) && response.status() === 200
    );
    return response;
  }
  async checkResponseStatus(endpoint) {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(endpoint)
    );
    return response.status();
  }
}
