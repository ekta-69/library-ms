const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const finesFile = path.join(__dirname, "../models/fines.json");

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

exports.getFineAmount = (req, res) => {
  const { username } = req.params;
  const fines = readFines();
  const userFines = fines.filter(
    (fine) => fine.username === username && !fine.paid
  );
  const totalFine = userFines.reduce((sum, fine) => sum + fine.amount, 0);
  res.json({ fine: totalFine });
};

exports.payFine = (req, res) => {
  const { username } = req.body;
  let fines = readFines();
  fines = fines.map((fine) =>
    fine.username === username ? { ...fine, paid: true } : fine
  );
  writeFines(fines);
  res.json({ message: `Fine paid successfully by ${username}` });
};
