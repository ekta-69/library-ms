const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const finesFile = path.join(__dirname, "../models/fines.json");
const transactionsFile = path.join(__dirname, "../models/transactions.json");

const readFines = () => {
  if (!fs.existsSync(finesFile)) {
    fs.writeFileSync(finesFile, "[]");
  }
  const data = fs.readFileSync(finesFile, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

const writeFines = (fines) => {
  fs.writeFileSync(finesFile, JSON.stringify(fines, null, 2));
};

const readTransactions = () => {
  if (!fs.existsSync(transactionsFile)) {
    fs.writeFileSync(transactionsFile, "[]");
  }
  const data = fs.readFileSync(transactionsFile, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

exports.getFineAmount = (req, res) => {
  const { username } = req.params;
  const fines = readFines();
  const transactions = readTransactions();
  const fineRate = 1; // Fine per day

  // Get all overdue transactions for the user
  const overdueTransactions = transactions.filter(
    (tx) =>
      tx.username === username &&
      tx.status === "Issued" &&
      new Date(tx.returnDate) < new Date()
  );

  let totalFine = 0;
  const calculatedFines = overdueTransactions.map((tx) => {
    const overdueDays = Math.floor(
      (new Date() - new Date(tx.returnDate)) / (1000 * 60 * 60 * 24)
    );
    const fineAmount = overdueDays * fineRate;
    totalFine += fineAmount;
    return {
      username,
      bookId: tx.bookId,
      bookTitle: tx.bookTitle,
      fineAmount,
      overdueDays,
    };
  });

  res.json({ fine: totalFine, details: calculatedFines });
};

exports.payFine = (req, res) => {
  const { username } = req.body;
  let transactions = readTransactions();

  // Mark all overdue books as "Returned" and clear fines
  transactions = transactions.map((tx) =>
    tx.username === username &&
    tx.status === "Issued" &&
    new Date(tx.returnDate) < new Date()
      ? { ...tx, status: "Returned" }
      : tx
  );

  // Update the transactions.json file
  fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2));

  res.json({
    message: `Fine paid successfully by ${username}. All overdue books marked as returned.`,
  });
};

// Fine Routes
router.get("/:username", exports.getFineAmount);
router.post("/pay", exports.payFine);
module.exports = router;
