import { expect, Locator, Page } from "@playwright/test";

export class UrlPage {

  private readonly page: Page

  constructor(page: Page) {
    this.page=page;
  }

async navigateToUrl() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    expect(await this.page.title()).toContain('OrangeHRM');
  }

}