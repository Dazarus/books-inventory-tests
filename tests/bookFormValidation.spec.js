const { test, expect } = require('@playwright/test');
const { BooksPage }   = require('../pages/BooksPage');
const { AddBookPage } = require('../pages/AddBookPage');
const { loginAsAdmin, uniqueBookTitle } = require('../utils/helpers');
const {
  VALID_BOOK,
  INVALID_BOOK,
  BOUNDARY_BOOK,
  OVER_LIMIT_BOOK,
} = require('../fixtures/testData');
const { ERROR_MESSAGES } = require('../fixtures/errorMessages');

test.describe('Book Form', () => {
  let booksPage;
  let addBookPage;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    booksPage   = new BooksPage(page);
    addBookPage = new AddBookPage(page);

    await booksPage.clickAddBook();
    await addBookPage.waitForForm();
  });

  test('Submitting an empty form shows all required field errors', async () => {
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.allFields);
  });

  test('Missing title shows the title required error', async () => {
    await addBookPage.fillForm(INVALID_BOOK.missingTitle);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.title);
  });

  test('Missing author shows the author required error', async () => {
    await addBookPage.fillForm(INVALID_BOOK.missingAuthor);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.author);
  });

  test('Missing genre shows the genre required error', async () => {
    await addBookPage.fillForm(INVALID_BOOK.missingGenre);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.genre);
  });

  test('Missing ISBN shows the ISBN required error', async () => {
    await addBookPage.fillForm(INVALID_BOOK.missingIsbn);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.isbn);
  });

  test('Missing publication date shows the date required error', async () => {
    await addBookPage.fillForm({ ...VALID_BOOK, publicationDate: '' });
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.publicationDate);
  });

  test('Missing price shows the price required error', async () => {
    await addBookPage.fillForm(INVALID_BOOK.missingPrice);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.price);
  });

  test('Negative price value shows a validation error', async () => {
    await addBookPage.fillForm(INVALID_BOOK.invalidPrice);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.price);
  });

  test('Title at exactly 21 characters (boundary) is accepted', async ({ page }) => {
    await addBookPage.fillForm(BOUNDARY_BOOK);
    await addBookPage.submit();

    const booksPage2 = new BooksPage(page);
    await booksPage2.assertBookVisible(BOUNDARY_BOOK.title);
  });

  test('Title exceeding 21 characters is rejected', async () => {
    await addBookPage.fillForm(OVER_LIMIT_BOOK);
    await addBookPage.submit();
    await addBookPage.assertErrorMessages(ERROR_MESSAGES.titleLengthExceeded);
  });
});
