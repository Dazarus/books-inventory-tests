const { expect } = require('@playwright/test');
const { toDateInputFormat } = require('../utils/helpers');

class EditBookPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Elements
    this.titleInput           = page.locator('input[name="title"]');
    this.authorInput          = page.locator('input[name="author"]');
    this.genreInput           = page.locator('input[name="genre"]'); 
    this.isbnInput            = page.locator('input[name="isbn"]');
    this.publicationDateInput = page.locator('input[name="publicationDate"]');
    this.priceInput           = page.locator('input[name="price"]');
    this.submitButton         = page.getByRole('button', { name: /save/i });
    this.errorMessages        = page.locator('[role="alert"]');
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
    await this.genreInput.first().clear();
    await this.genreInput.first().fill(value);
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
   * @returns {Promise<string>}
   */
  async getTitleValue() {
    return this.titleInput.first().inputValue();
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

  // Assertions

  async assertFormVisible() {
    await expect(this.titleInput.first()).toBeVisible();
  }

  async assertErrorVisible() {
    await expect(this.errorMessages.first()).toBeVisible({ timeout: 5_000 });
  }

  /**
   * @param {string} expectedTitle
   */
  async assertTitlePrePopulated(expectedTitle) {
    await expect(this.titleInput.first()).toHaveValue(expectedTitle);
  }

  /**
   * @returns {Promise<{ title: string, author: string, genre: string, isbn: string, publicationDate: string, price: string }>}
   */
  async getFormData() {
    const [title, author, genre, isbn, publicationDate, price] = await Promise.all([
      this.titleInput.first().inputValue(),
      this.authorInput.first().inputValue(),
      this.genreInput.first().inputValue(),
      this.isbnInput.first().inputValue(),
      this.publicationDateInput.first().inputValue(),
      this.priceInput.first().inputValue(),
    ]);
    return { title, author, genre, isbn, publicationDate, price };
  }

  /**
   * @param {{ title: string, author: string, genre: string, isbn: string, publicationDate: string, price: string }} rowData
   */
  async assertFormMatchesRow(rowData) {
    const formData = await this.getFormData();

    const normaliseDate = (d = '') => {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
        const [dd, mm, yyyy] = d.split('/');
        return `${yyyy}-${mm}-${dd}`;
      }
      return d;
    };

    const normalisePrice = (p = '') => p.replace(/[^0-9.]/g, '').trim();

    expect(formData.title,                        'Title mismatch')            .toBe(rowData.title);
    expect(formData.author,                       'Author mismatch')           .toBe(rowData.author);
    expect(formData.genre,                        'Genre mismatch')            .toBe(rowData.genre);
    expect(formData.isbn,                         'ISBN mismatch')             .toBe(rowData.isbn);
    expect(normaliseDate(formData.publicationDate), 'Publication Date mismatch')
      .toBe(normaliseDate(rowData.publicationDate));
    expect(normalisePrice(formData.price),        'Price mismatch')            .toBe(normalisePrice(rowData.price));
  }
}

module.exports = { EditBookPage };
