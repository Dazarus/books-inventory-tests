const CREDENTIALS = {
  validUsername: 'admin',
  validPassword: 'admin',
  invalidUsername: 'wronguser',
  invalidPassword: 'wrongpassword',
};

const VALID_BOOK = {
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  genre: 'Fiction',
  isbn: '978-0-7432-7356-5',
  publicationDate: '10/04/1925',
  price: '12.99',
};

const UPDATED_BOOK = {
  title: 'Gatsby Updated',
  author: 'F. Scott Fitzgerald',
  genre: 'Biography',
  isbn: '978-0-7432-9999-9',
  publicationDate: '01/01/2000',
  price: '15.99',
};

const BOUNDARY_BOOK = {
  title: 'A'.repeat(21),
  author: 'Boundary Author',
  genre: 'Mystery',
  isbn: '000-0-0000-0000-0',
  publicationDate: '01/06/2020',
  price: '9.99',
};

const OVER_LIMIT_BOOK = {
  title: 'A'.repeat(22),
  author: 'Over Limit Author',
  genre: 'Fantasy',
  isbn: '111-1-1111-1111-1',
  publicationDate: '01/01/2021',
  price: '5.00',
};

const INVALID_BOOK = {
  missingTitle: {
    title: '',
    author: 'Some Author',
    genre: 'Fiction',
    isbn: '123-4-5678-9012-3',
    publicationDate: '01/01/2023',
    price: '10.00',
  },
  missingAuthor: {
    title: 'Valid Title',
    author: '',
    genre: 'Fiction',
    isbn: '123-4-5678-9012-3',
    publicationDate: '01/01/2023',
    price: '10.00',
  },
  missingGenre: {
    title: 'Valid Title',
    author: 'Some Author',
    genre: '',
    isbn: '123-4-5678-9012-3',
    publicationDate: '01/01/2023',
    price: '10.00',
  },
  missingPrice: {
    title: 'Valid Title',
    author: 'Some Author',
    genre: 'Fiction',
    isbn: '123-4-5678-9012-3',
    publicationDate: '01/01/2023',
    price: '',
  },
  invalidPrice: {
    title: 'Valid Title',
    author: 'Some Author',
    genre: 'Fiction',
    isbn: '123-4-5678-9012-3',
    publicationDate: '01/01/2023',
    price: '-1',
  },
  missingIsbn: {
    title: 'Valid Title',
    author: 'Some Author',
    genre: 'Fiction',
    isbn: '',
    publicationDate: '01/01/2023',
    price: '10.00',
  },
};

const GENRE_OPTIONS = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Fantasy',
  'Science Fiction',
  'Biography',
];

module.exports = {
  CREDENTIALS,
  VALID_BOOK,
  UPDATED_BOOK,
  BOUNDARY_BOOK,
  OVER_LIMIT_BOOK,
  INVALID_BOOK,
  GENRE_OPTIONS,
};
