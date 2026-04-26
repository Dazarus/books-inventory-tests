const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { BooksPage } = require('../pages/BooksPage');
const { CREDENTIALS } = require('../fixtures/testData');

test.describe('Login Page', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login page is accessible and displays required elements', async ({ page }) => {
    await loginPage.assertOnLoginPage();
    await loginPage.assertLoginButtonVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('Successful login with valid credentials redirects to books catalog', async ({ page }) => {
    await loginPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);

    const booksPage = new BooksPage(page);
    await booksPage.assertOnBooksPage();
    await booksPage.assertWelcomeMessageVisible();
    await booksPage.assertLogoutButtonVisible();
  });

  test('Login with invalid username shows an error message', async () => {
    await loginPage.login(CREDENTIALS.invalidUsername, CREDENTIALS.validPassword);
    await loginPage.assertErrorMessageVisible();
    await loginPage.assertOnLoginPage();
  });

  test('Login with invalid password shows an error message', async () => {
    await loginPage.login(CREDENTIALS.validUsername, CREDENTIALS.invalidPassword);
    await loginPage.assertErrorMessageVisible();
    await loginPage.assertOnLoginPage();
  });

  test('Login with both fields empty shows a validation error', async () => {
    await loginPage.clickLogin();
    await loginPage.assertErrorMessageVisible();
    await loginPage.assertOnLoginPage();
  });

  test('Login with empty username shows a validation error', async () => {
    await loginPage.fillPassword(CREDENTIALS.validPassword);
    await loginPage.clickLogin();
    await loginPage.assertErrorMessageVisible();
  });

  test('Login with empty password shows a validation error', async () => {
    await loginPage.fillUsername(CREDENTIALS.validUsername);
    await loginPage.clickLogin();
    await loginPage.assertErrorMessageVisible();
  });

  test('Unable to access /books directly', async ({ page }) => {
    await page.goto('/books', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/login/, { timeout: 15_000 });
  });
});
