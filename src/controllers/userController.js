const path = require("path");
const fs = require("fs");

const usersFile = path.join(__dirname, "../models/users.json");

const readUsers = () => {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
  }
  const data = fs.readFileSync(usersFile, "utf-8").trim();
  return data ? JSON.parse(data) : [];
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

exports.getUsers = (req, res) => {
  res.json(readUsers());
};

exports.getUserByUsername = (req, res) => {
  const { username } = req.params;
  let users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

exports.updateUser = (req, res) => {
  const { username } = req.params;
  const { password, role } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex((u) => u.username === username);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users[userIndex] = { ...users[userIndex], password, role };
  writeUsers(users);
  res.json({ message: "User updated successfully" });
};

exports.deleteUser = (req, res) => {
  const { username } = req.params;
  let users = readUsers();
  const newUsers = users.filter((u) => u.username !== username);
  writeUsers(newUsers);
  res.json({ message: "User deleted successfully" });
};

exports.toggleUserStatus = (req, res) => {
  const { username } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex((u) => u.username === username);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users[userIndex].active = !users[userIndex].active;
  writeUsers(users);
  res.json({
    message: `User ${username} is now ${
      users[userIndex].active ? "active" : "inactive"
    }`,
  });
};
