const { expect } = require('@playwright/test');

class BooksPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    //Elements
      this.welcomeMessage      = page.locator('h2').filter({ hasText: 'Welcome, Admin!' });
      this.logoutButton        = page.locator('button').filter({ hasText: 'Log Out' });
      this.bookListContainer   = page.locator('table.min-w-full');
      this.addBookButton       = page.getByRole('button', { name: 'Add Book' });

      this.bookRows     = page.locator('tbody tr');
      this.editButton   = page.getByRole('button', { name: 'Edit' });
      this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async goto() {
    await this.page.goto('/books');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.logoutButton).toBeVisible({ timeout: 15_000 });
  }

  async clickAddBook() {
    await this.addBookButton.click();
  }

  /**
   * @param {string} bookTitle
   */
  async clickEditForBook(bookTitle) {
  await this.bookRows.filter({ hasText: bookTitle }).getByRole('button', { name: 'Edit' }).click();
}

  /**
   * @param {string} bookTitle
   */
  async clickDeleteForBook(bookTitle) {
  await this.bookRows.filter({ hasText: bookTitle }).getByRole('button', { name: 'Delete' }).click();
}

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL(/login/, { timeout: 15_000 });
  }

  /**
 * @returns {Promise<{ title: string, author: string, genre: string, isbn: string, publicationDate: string, price: string }>}
 */
  async getFirstRowData() {
    await this.page.waitForLoadState('networkidle');

    const row   = this.bookRows.first();
    const cells = row.locator('td');

    const [title, author, genre, isbn, publicationDate, price] = await Promise.all([
      cells.nth(0).innerText(),
      cells.nth(1).innerText(),
      cells.nth(2).innerText(),
      cells.nth(3).innerText(),
      cells.nth(4).innerText(),
      cells.nth(5).innerText(),
  ]);

  return {
    title:           title.trim(),
    author:          author.trim(),
    genre:           genre.trim(),
    isbn:            isbn.trim(),
    publicationDate: publicationDate.trim(),
    price:           price.trim(),
  };
}

  /**
 * @param {string} bookTitle
 * @returns {Promise<{ title: string, author: string, genre: string, isbn: string, publicationDate: string, price: string }>}
 */
  async getRowDataByTitle(bookTitle) {
    const row = this.bookRows.filter({ hasText: bookTitle });
    await expect(row).toBeVisible({ timeout: 10_000 });

    const cells = row.locator('td');
    const [title, author, genre, isbn, publicationDate, price] = await Promise.all([
      cells.nth(0).innerText(),
      cells.nth(1).innerText(),
      cells.nth(2).innerText(),
      cells.nth(3).innerText(),
      cells.nth(4).innerText(),
      cells.nth(5).innerText(),
  ]);

  return {
    title:           title.trim(),
    author:          author.trim(),
    genre:           genre.trim(),
    isbn:            isbn.trim(),
    publicationDate: publicationDate.trim(),
    price:           price.trim(),
  };
}

  // Assertions

  async assertOnBooksPage() {
    await expect(this.page).toHaveURL(/books|catalog|dashboard/);
  }

  async assertWelcomeMessageVisible() {
    await expect(this.welcomeMessage).toBeVisible();
  }

  async assertLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async assertBookVisible(bookTitle) {
    await expect(this.bookRows.filter({ hasText: bookTitle })).toBeVisible({ timeout: 10_000 });
  }

  async assertBookNotVisible(bookTitle) {
    await expect(this.bookRows.filter({ hasText: bookTitle })).not.toBeVisible({ timeout: 10_000 });
  }
}

module.exports = { BooksPage };
