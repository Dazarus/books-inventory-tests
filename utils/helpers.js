// utils/helpers.js
const { LoginPage } = require('../pages/LoginPage');
const { BooksPage } = require('../pages/BooksPage');
const { CREDENTIALS } = require('../fixtures/testData');

/**
 * @param {import('@playwright/test').Page} page
 */
async function loginAsAdmin(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);

  const booksPage = new BooksPage(page);
  await booksPage.waitForPageLoad();
}

/**
 * @param {string} [prefix='Test Book']
 * @returns {string}
 */
function uniqueBookTitle(prefix = 'Test Book') {
  const suffix = Date.now().toString().slice(-5);
  const title = `${prefix} ${suffix}`;
  return title.slice(0, 21);
}

/**
 * @param {string} date
 * @returns {string}
 */
function toDateInputFormat(date) {
  if (!date) return date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [dd, mm, yyyy] = date.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  return date;
}

module.exports = { loginAsAdmin, uniqueBookTitle, toDateInputFormat };
