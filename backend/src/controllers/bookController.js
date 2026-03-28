const asyncHandler = require("../middlewares/asyncHandler");
const bookService = require("../services/bookService");

const getBooks = asyncHandler(async (req, res) => {
  const books = await bookService.getAllBooks();
  res.status(200).json({
    success: true,
    data: books
  });
});

const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book
  });
});

const deleteBook = asyncHandler(async (req, res) => {
  await bookService.deleteBook(req.params.id);
  res.status(200).json({
    success: true,
    message: "Book deleted successfully"
  });
});

const issueBook = asyncHandler(async (req, res) => {
  const book = await bookService.issueBook(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: "Book issued successfully",
    data: book
  });
});

const returnBook = asyncHandler(async (req, res) => {
  const book = await bookService.returnBook(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    data: book
  });
});

module.exports = { getBooks, createBook, deleteBook, issueBook, returnBook };
