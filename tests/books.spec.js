const { test, expect } = require('@playwright/test');
const { BooksPage }    = require('../pages/BooksPage');
const { AddBookPage }  = require('../pages/AddBookPage');
const { EditBookPage } = require('../pages/EditBookPage');
const { loginAsAdmin, uniqueBookTitle } = require('../utils/helpers');
const { VALID_BOOK, UPDATED_BOOK, GENRE_OPTIONS } = require('../fixtures/testData');

test.describe('Books List', () => {
  let booksPage;

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    booksPage = new BooksPage(page);
  });

  test('Full user journey: login → add a book → book appears in the list', async ({ page }) => {
    const bookTitle = uniqueBookTitle('Journey Book');
    const book = { ...VALID_BOOK, title: bookTitle };

    await booksPage.clickAddBook();

    const addBookPage = new AddBookPage(page);
    await addBookPage.waitForForm();
    await addBookPage.fillForm(book);
    await addBookPage.submit();

    await booksPage.assertBookVisible(bookTitle);
  });

  test('Books catalog displays a welcome message and logout button', async () => {
    await booksPage.assertWelcomeMessageVisible();
    await booksPage.assertLogoutButtonVisible();
  });

  test('Edit an existing book and verify changes are saved', async ({ page }) => {
    const bookTitle = uniqueBookTitle('Edit Me');
    await booksPage.clickAddBook();
    const addBookPage = new AddBookPage(page);
    await addBookPage.waitForForm();
    await addBookPage.fillForm({ ...VALID_BOOK, title: bookTitle });
    await addBookPage.submit();
    await booksPage.assertBookVisible(bookTitle);

    await booksPage.clickEditForBook(bookTitle);
    const editBookPage = new EditBookPage(page);
    await editBookPage.waitForForm();

    await editBookPage.fillForm({
      author: UPDATED_BOOK.author,
      genre:  UPDATED_BOOK.genre,
      price:  UPDATED_BOOK.price,
    });
    await editBookPage.submit();

    const rowData = await booksPage.getRowDataByTitle(bookTitle);
    expect(rowData.author).toBe(UPDATED_BOOK.author);
    expect(rowData.genre).toBe(UPDATED_BOOK.genre);
    expect(rowData.price.replace(/[^0-9.]/g, '')).toBe(UPDATED_BOOK.price);
  });

  test('Edit form is pre-populated with the existing book data', async ({ page }) => {
    const bookTitle = uniqueBookTitle('Pre Pop');
    await booksPage.clickAddBook();
    const addBookPage = new AddBookPage(page);
    await addBookPage.waitForForm();
    await addBookPage.fillForm({ ...VALID_BOOK, title: bookTitle });
    await addBookPage.submit();
    await booksPage.assertBookVisible(bookTitle);

    await booksPage.clickEditForBook(bookTitle);
    const editBookPage = new EditBookPage(page);
    await editBookPage.waitForForm();
    await editBookPage.assertTitlePrePopulated(bookTitle);
  });

  test('Delete a book and verify it is removed from the catalog', async ({ page }) => {
    const bookTitle = uniqueBookTitle('Delete Me');
    await booksPage.clickAddBook();
    const addBookPage = new AddBookPage(page);
    await addBookPage.waitForForm();
    await addBookPage.fillForm({ ...VALID_BOOK, title: bookTitle });
    await addBookPage.submit();
    await booksPage.assertBookVisible(bookTitle);

    await booksPage.clickDeleteForBook(bookTitle);

    await booksPage.assertBookNotVisible(bookTitle);
  });

  test('Edit form is pre-populated with values matching the first catalog row', async ({ page }) => {
    const rowData = await booksPage.getFirstRowData();

    await booksPage.clickEditForBook(rowData.title);

    const editBookPage = new EditBookPage(page);
    await editBookPage.waitForForm();

    await editBookPage.assertFormMatchesRow(rowData);
  });

  test('Logout button returns the user to the login page', async ({ page }) => {
    await booksPage.logout();
    await expect(page).toHaveURL(/login/);
  });
});
