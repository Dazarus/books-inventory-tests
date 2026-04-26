# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: books.spec.js >> Books List >> Logout button returns the user to the login page
- Location: tests\books.spec.js:101:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
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
  1   | const { expect } = require('@playwright/test');
  2   | 
  3   | class BooksPage {
  4   |   /**
  5   |    * @param {import('@playwright/test').Page} page
  6   |    */
  7   |   constructor(page) {
  8   |     this.page = page;
  9   | 
  10  |     //Elements
  11  |       this.welcomeMessage      = page.locator('h2').filter({ hasText: 'Welcome, Admin!' });
  12  |       this.logoutButton        = page.locator('button').filter({ hasText: 'Log Out' });
  13  |       this.bookListContainer   = page.locator('table.min-w-full');
  14  |       this.addBookButton       = page.getByRole('button', { name: 'Add Book' });
  15  | 
  16  |       this.bookRows     = page.locator('tbody tr');
  17  |       this.editButton   = page.getByRole('button', { name: 'Edit' });
  18  |       this.deleteButton = page.getByRole('button', { name: 'Delete' });
  19  |   }
  20  | 
  21  |   async goto() {
  22  |     await this.page.goto('/books');
  23  |     await this.waitForPageLoad();
  24  |   }
  25  | 
  26  |   async waitForPageLoad() {
  27  |     await this.page.waitForLoadState('networkidle');
  28  |     await expect(this.logoutButton).toBeVisible({ timeout: 15_000 });
  29  |   }
  30  | 
  31  |   async clickAddBook() {
  32  |     await this.addBookButton.click();
  33  |   }
  34  | 
  35  |   /**
  36  |    * @param {string} bookTitle
  37  |    */
  38  |   async clickEditForBook(bookTitle) {
  39  |   await this.bookRows.filter({ hasText: bookTitle }).getByRole('button', { name: 'Edit' }).click();
  40  | }
  41  | 
  42  |   /**
  43  |    * @param {string} bookTitle
  44  |    */
  45  |   async clickDeleteForBook(bookTitle) {
  46  |   await this.bookRows.filter({ hasText: bookTitle }).getByRole('button', { name: 'Delete' }).click();
  47  | }
  48  | 
  49  |   async logout() {
  50  |     await this.logoutButton.click();
> 51  |     await this.page.waitForURL(/login/, { timeout: 15_000 });
      |                     ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  52  |   }
  53  | 
  54  |   /**
  55  |  * @returns {Promise<{ title: string, author: string, genre: string, isbn: string, publicationDate: string, price: string }>}
  56  |  */
  57  |   async getFirstRowData() {
  58  |     await this.page.waitForLoadState('networkidle');
  59  | 
  60  |     const row   = this.bookRows.first();
  61  |     const cells = row.locator('td');
  62  | 
  63  |     const [title, author, genre, isbn, publicationDate, price] = await Promise.all([
  64  |       cells.nth(0).innerText(),
  65  |       cells.nth(1).innerText(),
  66  |       cells.nth(2).innerText(),
  67  |       cells.nth(3).innerText(),
  68  |       cells.nth(4).innerText(),
  69  |       cells.nth(5).innerText(),
  70  |   ]);
  71  | 
  72  |   return {
  73  |     title:           title.trim(),
  74  |     author:          author.trim(),
  75  |     genre:           genre.trim(),
  76  |     isbn:            isbn.trim(),
  77  |     publicationDate: publicationDate.trim(),
  78  |     price:           price.trim(),
  79  |   };
  80  | }
  81  | 
  82  |   /**
  83  |  * @param {string} bookTitle
  84  |  * @returns {Promise<{ title: string, author: string, genre: string, isbn: string, publicationDate: string, price: string }>}
  85  |  */
  86  |   async getRowDataByTitle(bookTitle) {
  87  |     const row = this.bookRows.filter({ hasText: bookTitle });
  88  |     await expect(row).toBeVisible({ timeout: 10_000 });
  89  | 
  90  |     const cells = row.locator('td');
  91  |     const [title, author, genre, isbn, publicationDate, price] = await Promise.all([
  92  |       cells.nth(0).innerText(),
  93  |       cells.nth(1).innerText(),
  94  |       cells.nth(2).innerText(),
  95  |       cells.nth(3).innerText(),
  96  |       cells.nth(4).innerText(),
  97  |       cells.nth(5).innerText(),
  98  |   ]);
  99  | 
  100 |   return {
  101 |     title:           title.trim(),
  102 |     author:          author.trim(),
  103 |     genre:           genre.trim(),
  104 |     isbn:            isbn.trim(),
  105 |     publicationDate: publicationDate.trim(),
  106 |     price:           price.trim(),
  107 |   };
  108 | }
  109 | 
  110 |   // Assertions
  111 | 
  112 |   async assertOnBooksPage() {
  113 |     await expect(this.page).toHaveURL(/books|catalog|dashboard/);
  114 |   }
  115 | 
  116 |   async assertWelcomeMessageVisible() {
  117 |     await expect(this.welcomeMessage).toBeVisible();
  118 |   }
  119 | 
  120 |   async assertLogoutButtonVisible() {
  121 |     await expect(this.logoutButton).toBeVisible();
  122 |   }
  123 | 
  124 |   async assertBookVisible(bookTitle) {
  125 |     await expect(this.bookRows.filter({ hasText: bookTitle })).toBeVisible({ timeout: 10_000 });
  126 |   }
  127 | 
  128 |   async assertBookNotVisible(bookTitle) {
  129 |     await expect(this.bookRows.filter({ hasText: bookTitle })).not.toBeVisible({ timeout: 10_000 });
  130 |   }
  131 | }
  132 | 
  133 | module.exports = { BooksPage };
  134 | 
```