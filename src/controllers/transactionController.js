const path = require("path");
const fs = require("fs");
// src/controllers/transactionController.js
const booksFile = path.join(__dirname, "../models/books.json");
const transactionsFile = path.join(__dirname, "../models/transactions.json");

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

const readTransactions = () => {
  if (!fs.existsSync(transactionsFile)) {
    fs.writeFileSync(transactionsFile, "[]");
  }
  const data = fs.readFileSync(transactionsFile, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

const writeTransactions = (transactions) => {
  fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2));
};

exports.issueBook = (req, res) => {
  const { username, bookId, issueDate, returnDate } = req.body;
  let books = readBooks();
  let transactions = readTransactions();

  let book = books.find((book) => book.id == bookId);
  if (!book || book.status !== "Available") {
    return res.status(400).json({ message: "Book is not available" });
  }

  book.status = "Issued";
  transactions.push({
    id: transactions.length + 1,
    username,
    bookId,
    bookTitle: book.title,
    issueDate,
    returnDate,
    status: "Issued",
  });

  writeBooks(books);
  writeTransactions(transactions);

  res.status(201).json({ message: "Book issued successfully" });
};

exports.getAllIssues = (req, res) => {
  const transactions = readTransactions();
  if (transactions.length === 0) {
    return res.status(404).json({ message: "No transactions found" });
  }
  res.json(transactions);
};

exports.getUserIssuedBooks = (req, res) => {
  const { username } = req.params;
  const transactions = readTransactions().filter(
    (tx) => tx.username === username
  );
  if (transactions.length === 0) {
    return res
      .status(404)
      .json({ message: "No transactions found for this user" });
  }
  res.json(transactions);
};

exports.returnBook = (req, res) => {
  const { username, bookId } = req.body;
  let books = readBooks();
  let transactions = readTransactions();

  let book = books.find((book) => book.id == bookId);
  let transactionIndex = transactions.findIndex(
    (tx) =>
      tx.username === username && tx.bookId == bookId && tx.status === "Issued"
  );

  if (transactionIndex === -1 || !book) {
    return res.status(400).json({ message: "Invalid return request" });
  }

  book.status = "Available";
  transactions[transactionIndex].status = "Returned";

  writeBooks(books);
  writeTransactions(transactions);

  res.status(201).json({ message: "Book returned successfully" });
};

exports.payFine = (req, res) => {
  const { username, amount } = req.body;
  res.json({ message: `Fine of ${amount} paid by ${username}` });
};
