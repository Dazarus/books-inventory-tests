const { expect } = require('@playwright/test');
const { toDateInputFormat } = require('../utils/helpers');


class AddBookPage {
  /** 
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    //Elements
    this.titleInput           = page.locator('input#title');
    this.authorInput          = page.locator('input#author');
    this.genreSelect          = page.locator('select#genre');
    this.isbnInput            = page.locator('input#isbn');
    this.publicationDateInput = page.locator('input#publicationDate');
    this.priceInput           = page.locator('input#price');
    this.submitButton         = page.getByRole('button', { name: /submit/i });
    this.errorMessages        = page.locator('[role="alert"]');
    this.errorHeading         = page.getByText(/please correct the following errors/i);
    this.errorList            = page.locator('ul li');
  }

  async waitForForm() {
    await this.titleInput.first().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async fillTitle(value) {
    await this.titleInput.first().clear();
    await this.titleInput.first().fill(value);
  }

  async fillAuthor(value) {
    await this.authorInput.first().clear();
    await this.authorInput.first().fill(value);
  }

  async selectGenre(value) {
  if (!value) {
    return;
  }
  await this.genreSelect.first().selectOption({ label: value });
}

  async fillIsbn(value) {
    await this.isbnInput.first().clear();
    await this.isbnInput.first().fill(value);
  }

  async fillPublicationDate(value) {
    const dateValue = toDateInputFormat(value);
    await this.publicationDateInput.first().fill(dateValue);
  }

  async fillPrice(value) {
    await this.priceInput.first().clear();
    await this.priceInput.first().fill(value);
  }

  /**
   * @param {{ title?: string, author?: string, genre?: string, isbn?: string, publicationDate?: string, price?: string }} bookData
   */
  async fillForm(bookData) {
    if (bookData.title       !== undefined) await this.fillTitle(bookData.title);
    if (bookData.author      !== undefined) await this.fillAuthor(bookData.author);
    if (bookData.genre       !== undefined) await this.selectGenre(bookData.genre);
    if (bookData.isbn        !== undefined) await this.fillIsbn(bookData.isbn);
    if (bookData.publicationDate !== undefined) await this.fillPublicationDate(bookData.publicationDate);
    if (bookData.price       !== undefined) await this.fillPrice(bookData.price);
  }

  async submit() {
    await this.submitButton.click();
  }

  //Assertions

  async assertErrorVisible() {
    await expect(this.errorMessages.first()).toBeVisible({ timeout: 5_000 });
  }
/**
  @param {string[]} expectedMessages
 */
  async assertErrorMessages(expectedMessages) {
    await expect(this.errorHeading).toBeVisible({ timeout: 5_000 });

    for (const message of expectedMessages) {
    await expect(
      this.errorList.filter({ hasText: message })
    ).toBeVisible();
  }
}

  async assertGenreOptionsAvailable(expectedOptions) {
    for (const option of expectedOptions) {
      await expect(
        this.genreSelect.first().locator('option', { hasText: option })
      ).toBeAttached();
    }
  }
}

module.exports = { AddBookPage };
