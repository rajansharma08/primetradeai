const mongoose = require("mongoose");

const Book = require("../models/Book");
const AppError = require("../utils/AppError");

const getAllBooks = async () =>
  Book.find()
    .populate("issuedTo", "name email role")
    .sort({ createdAt: -1 });

const createBook = async ({ title, author }) => Book.create({ title, author });

const deleteBook = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid book id", 400);
  }

  const deletedBook = await Book.findByIdAndDelete(id);

  if (!deletedBook) {
    throw new AppError("Book not found", 404);
  }
};

const issueBook = async (bookId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("Invalid book id", 400);
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  if (!book.available) {
    throw new AppError("Book is already issued", 409);
  }

  book.available = false;
  book.issuedTo = userId;
  await book.save();

  return Book.findById(bookId).populate("issuedTo", "name email role");
};

const returnBook = async (bookId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("Invalid book id", 400);
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  if (book.available) {
    throw new AppError("Book is not currently issued", 409);
  }

  if (!book.issuedTo || book.issuedTo.toString() !== userId.toString()) {
    throw new AppError("Only the user who issued this book can return it", 403);
  }

  book.available = true;
  book.issuedTo = null;
  await book.save();

  return book;
};

module.exports = { getAllBooks, createBook, deleteBook, issueBook, returnBook };
