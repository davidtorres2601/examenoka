import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {

  private readonly usernameText: Locator
  private readonly passwordText: Locator
  private readonly loginButton:Locator

  constructor(page: Page) {
    this.usernameText = page.getByPlaceholder('Username')
    this.passwordText=page.getByPlaceholder('Password')
    this.loginButton=page.getByRole("button",{name:'Login'})
  }


  async fillUsername(username:string){
    await this.usernameText.fill(username)
  }

  async fillpassword(password:string){
    await this.passwordText.fill(password)
  }

  async clickOnLogin(){
    await this.loginButton.click();
  }

  async loginWithCredentials(username:string, password:string){
       await this.fillUsername(username);
       await this.fillpassword(password);
       await this.clickOnLogin();

  }
  /** 

  async navigate() {
    await this.page.goto('https://opensourcedemo.orangehrmlive.com/web/index.php/dashboard/index');
    expect(await this.page.title()).toContain('OrangeHRM');
  }


  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async verifyLoginSuccess() {
    await this.page.waitForSelector('.oxd-main-menu');
    expect(await this.page.isVisible('.oxd-main-menu')).toBeTruthy();
  }

  async verifyLoginFailure() {
    await this.page.waitForSelector('.oxd-alert-content');
    expect(await this.page.isVisible('.oxd-alert-content')).toBeTruthy();
  }**/
}
