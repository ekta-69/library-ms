// src/controllers/authController.js
const fs = require("fs");
const path = require("path");
const usersFile = path.join(__dirname, "../models/users.json");

const transactionsFile = path.join(__dirname, "../models/transactions.json");

const readUsers = () => {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
  }
  const data = fs.readFileSync(usersFile, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

exports.register = (req, res) => {
  const { username, password, role } = req.body;
  let users = readUsers();

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password, role });
  writeUsers(users);
  res.status(201).json({ message: "User registered successfully" });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  req.session.user = { username: user.username, role: user.role };
  res.json({
    message: "Login successful",
    role: user.role,
    username: user.username,
  });
};
