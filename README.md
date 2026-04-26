## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v8+

### Install dependencies

```bash
npm install
npx playwright install chromium
```

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test tests/login.spec.js
npx playwright test tests/books.spec.js
```

### Run tests with the HTML report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Run tests headed (visible browser)

```bash
npx playwright test --headed
```

