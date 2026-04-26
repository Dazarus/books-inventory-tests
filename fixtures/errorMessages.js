const ERROR_MESSAGES = {
  allFields: [
    'Title is required.',
    'Author is required.',
    'Genre is required.',
    'ISBN is required.',
    'Publication Date is required.',
    'Price is required.',
  ],
  title:                ['Title is required.'],
  titleLengthExceeded:  ['Title cannot exceed 20 characters.'], //Have put this in to match how the system currently works. 
  author:               ['Author is required.'],
  genre:                ['Genre is required.'],
  isbn:                 ['ISBN is required.'],
  publicationDate:      ['Publication Date is required.'],
  price:                ['Price is required.'],
};

module.exports = { ERROR_MESSAGES };
