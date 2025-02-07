const path = require("path");
const transactionsFile = path.join(__dirname, "../models/transactions.json");

const readTransactions = () => {
  if (!fs.existsSync(transactionsFile)) {
    fs.writeFileSync(transactionsFile, "[]");
  }
  const data = fs.readFileSync(transactionsFile, "utf-8");
  return data ? JSON.parse(data) : [];
};

exports.generateReport = (req, res) => {
  const transactions = readTransactions();
  const report = {
    totalBooksIssued: transactions.filter((t) => t.status === "issued").length,
    totalBooksReturned: transactions.filter((t) => t.status === "returned")
      .length,
  };
  res.json(report);
};
