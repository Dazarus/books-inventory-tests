# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Login Page >> Unable to access /books directly
- Location: tests\login.spec.js:60:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /login/
Received string:  "https://frontendui-librarysystem.onrender.com/books"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    18 × unexpected value "https://frontendui-librarysystem.onrender.com/books"

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Book List" [level=2] [ref=e5]
  - button "Add Book" [ref=e6] [cursor=pointer]
  - table [ref=e7]:
    - rowgroup [ref=e8]:
      - row "Title Author Genre ISBN Publication Date Price Actions" [ref=e9]:
        - columnheader "Title" [ref=e10]
        - columnheader "Author" [ref=e11]
        - columnheader "Genre" [ref=e12]
        - columnheader "ISBN" [ref=e13]
        - columnheader "Publication Date" [ref=e14]
        - columnheader "Price" [ref=e15]
        - columnheader "Actions" [ref=e16]
    - rowgroup [ref=e17]:
      - row "The Very Busy Spider Eric Carle Picture Book 9780694005000 01/09/1984 £6.99 Edit Delete" [ref=e18]:
        - cell "The Very Busy Spider" [ref=e19]
        - cell "Eric Carle" [ref=e20]
        - cell "Picture Book" [ref=e21]
        - cell "9780694005000" [ref=e22]
        - cell "01/09/1984" [ref=e23]
        - cell "£6.99" [ref=e24]
        - cell "Edit Delete" [ref=e25]:
          - button "Edit" [ref=e26] [cursor=pointer]
          - button "Delete" [ref=e27] [cursor=pointer]
      - row "The Cat in the Hat Dr. Seuss Children's Literature 9780394800011 12/03/1957 £7.99 Edit Delete" [ref=e28]:
        - cell "The Cat in the Hat" [ref=e29]
        - cell "Dr. Seuss" [ref=e30]
        - cell "Children's Literature" [ref=e31]
        - cell "9780394800011" [ref=e32]
        - cell "12/03/1957" [ref=e33]
        - cell "£7.99" [ref=e34]
        - cell "Edit Delete" [ref=e35]:
          - button "Edit" [ref=e36] [cursor=pointer]
          - button "Delete" [ref=e37] [cursor=pointer]
      - row "Charlotte's Web E.B. White Children's Fiction 9780064400558 15/10/1952 £8.99 Edit Delete" [ref=e38]:
        - cell "Charlotte's Web" [ref=e39]
        - cell "E.B. White" [ref=e40]
        - cell "Children's Fiction" [ref=e41]
        - cell "9780064400558" [ref=e42]
        - cell "15/10/1952" [ref=e43]
        - cell "£8.99" [ref=e44]
        - cell "Edit Delete" [ref=e45]:
          - button "Edit" [ref=e46] [cursor=pointer]
          - button "Delete" [ref=e47] [cursor=pointer]
  - generic [ref=e48]:
    - button "Previous" [disabled] [ref=e49] [cursor=pointer]
    - generic [ref=e50]: Page 1 of 1
    - button "Next" [disabled] [ref=e51] [cursor=pointer]
  - 'heading "Total Book Titles: 3" [level=3] [ref=e53]'
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { LoginPage } = require('../pages/LoginPage');
  3  | const { BooksPage } = require('../pages/BooksPage');
  4  | const { CREDENTIALS } = require('../fixtures/testData');
  5  | 
  6  | test.describe('Login Page', () => {
  7  |   let loginPage;
  8  | 
  9  |   test.beforeEach(async ({ page }) => {
  10 |     loginPage = new LoginPage(page);
  11 |     await loginPage.goto();
  12 |   });
  13 | 
  14 |   test('Login page is accessible and displays required elements', async ({ page }) => {
  15 |     await loginPage.assertOnLoginPage();
  16 |     await loginPage.assertLoginButtonVisible();
  17 |     await expect(loginPage.usernameInput).toBeVisible();
  18 |     await expect(loginPage.passwordInput).toBeVisible();
  19 |   });
  20 | 
  21 |   test('Successful login with valid credentials redirects to books catalog', async ({ page }) => {
  22 |     await loginPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);
  23 | 
  24 |     const booksPage = new BooksPage(page);
  25 |     await booksPage.assertOnBooksPage();
  26 |     await booksPage.assertWelcomeMessageVisible();
  27 |     await booksPage.assertLogoutButtonVisible();
  28 |   });
  29 | 
  30 |   test('Login with invalid username shows an error message', async () => {
  31 |     await loginPage.login(CREDENTIALS.invalidUsername, CREDENTIALS.validPassword);
  32 |     await loginPage.assertErrorMessageVisible();
  33 |     await loginPage.assertOnLoginPage();
  34 |   });
  35 | 
  36 |   test('Login with invalid password shows an error message', async () => {
  37 |     await loginPage.login(CREDENTIALS.validUsername, CREDENTIALS.invalidPassword);
  38 |     await loginPage.assertErrorMessageVisible();
  39 |     await loginPage.assertOnLoginPage();
  40 |   });
  41 | 
  42 |   test('Login with both fields empty shows a validation error', async () => {
  43 |     await loginPage.clickLogin();
  44 |     await loginPage.assertErrorMessageVisible();
  45 |     await loginPage.assertOnLoginPage();
  46 |   });
  47 | 
  48 |   test('Login with empty username shows a validation error', async () => {
  49 |     await loginPage.fillPassword(CREDENTIALS.validPassword);
  50 |     await loginPage.clickLogin();
  51 |     await loginPage.assertErrorMessageVisible();
  52 |   });
  53 | 
  54 |   test('Login with empty password shows a validation error', async () => {
  55 |     await loginPage.fillUsername(CREDENTIALS.validUsername);
  56 |     await loginPage.clickLogin();
  57 |     await loginPage.assertErrorMessageVisible();
  58 |   });
  59 | 
  60 |   test('Unable to access /books directly', async ({ page }) => {
  61 |     await page.goto('/books', { waitUntil: 'networkidle' });
> 62 |     await expect(page).toHaveURL(/login/, { timeout: 15_000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  63 |   });
  64 | });
  65 | 
```