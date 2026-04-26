# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bookFormValidation.spec.js >> Book Form >> Title at exactly 21 characters (boundary) is accepted
- Location: tests\bookFormValidation.spec.js:73:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('tbody tr').filter({ hasText: 'AAAAAAAAAAAAAAAAAAAAA' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('tbody tr').filter({ hasText: 'AAAAAAAAAAAAAAAAAAAAA' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "Welcome, Admin!" [level=2] [ref=e5]
    - button "Log Out" [ref=e6] [cursor=pointer]
  - generic [ref=e8]:
    - heading "Add a New Book" [level=2] [ref=e9]
    - alert [ref=e10]:
      - heading "Please correct the following errors:" [level=3] [ref=e11]
      - list [ref=e12]:
        - listitem [ref=e13]: Title cannot exceed 20 characters.
    - form "Add a New Book" [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: "Title:"
        - generic [ref=e17]:
          - textbox "Title:" [ref=e18]: AAAAAAAAAAAAAAAAAAAAA
          - generic [ref=e19]: 21/21
        - alert [ref=e20]: Title cannot exceed 20 characters.
      - generic [ref=e21]:
        - generic [ref=e22]: "Author:"
        - textbox "Author:" [ref=e23]: Boundary Author
      - generic [ref=e24]:
        - generic [ref=e25]: "Genre:"
        - combobox "Genre:" [ref=e26]:
          - option "Select Genre"
          - option "Fiction"
          - option "Non-Fiction"
          - option "Mystery" [selected]
          - option "Fantasy"
          - option "Science Fiction"
          - option "Biography"
      - generic [ref=e27]:
        - generic [ref=e28]: "ISBN:"
        - textbox "ISBN:" [ref=e29]: 000-0-0000-0000-0
      - generic [ref=e30]:
        - generic [ref=e31]: "Publication Date:"
        - textbox "Publication Date:" [ref=e32]: 2020-06-01
      - generic [ref=e33]:
        - generic [ref=e34]: "Price:"
        - textbox "Price:" [ref=e35]: "9.99"
      - button "Submit Add New Book Form" [active] [ref=e37] [cursor=pointer]: Add Book
```

# Test source

```ts
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
  51  |     await this.page.waitForURL(/login/, { timeout: 15_000 });
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
> 125 |     await expect(this.bookRows.filter({ hasText: bookTitle })).toBeVisible({ timeout: 10_000 });
      |                                                                ^ Error: expect(locator).toBeVisible() failed
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