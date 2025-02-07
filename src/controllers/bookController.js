const path = require("path");
const booksFile = path.join(__dirname, "../models/books.json");
const fs = require("fs");
const readBooks = () => {
  if (!fs.existsSync(booksFile)) {
    fs.writeFileSync(booksFile, "[]");
  }
  const data = fs.readFileSync(booksFile, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeBooks = (books) => {
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
};

exports.getBooks = (req, res) => {
  res.json(readBooks());
};

exports.addBook = (req, res) => {
  const { title, author, category, status } = req.body;
  let books = readBooks();
  books.push({ id: books.length + 1, title, author, category, status });
  writeBooks(books);
  res.status(201).json({ message: "Book added successfully" });
};
