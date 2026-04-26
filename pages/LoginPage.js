const { expect } = require('@playwright/test');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    //Elements
    this.usernameInput = page.locator('input#username');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton   = page.getByRole('button', { name: /login/i });
    this.errorMessage  = page.locator('[role="alert"]').first();
    this.pageHeading   = page.getByRole('heading', { name: /login/i });
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.locator('input#username').waitFor({ state: 'visible', timeout: 60_000 });
  }

  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  //Assertions

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/login/);
  }

  async assertErrorMessageVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async assertErrorMessageContains(text) {
    await expect(this.errorMessage).toContainText(text);
  }

  async assertUsernameFieldEmpty() {
    await expect(this.usernameInput).toBeEmpty();
  }

  async assertPasswordFieldEmpty() {
    await expect(this.passwordInput).toBeEmpty();
  }

  async assertLoginButtonVisible() {
    await expect(this.loginButton).toBeVisible();
  }
}

module.exports = { LoginPage };
