// Library Management System - Node.js with Local JSON Storage

const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const app = express();
const PORT = 3000;
const authRoutes = require("./src/routes/authRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const userRoutes = require("./src/routes/userRoutes");

// const reportRoutes = require("./src/routes/reportRoutes");
const fineRoutes = require("./src/routes/fineRoutes");

app.use(express.json());
app.use(express.static("public"));
app.use(
  session({ secret: "library-secret", resave: false, saveUninitialized: true })
);

// Ensure routes are properly imported
if (typeof authRoutes === "function") app.use("/api/auth", authRoutes);
if (typeof bookRoutes === "function") app.use("/api/books", bookRoutes);
if (typeof transactionRoutes === "function")
  app.use("/api/transactions", transactionRoutes);
if (typeof userRoutes === "function") app.use("/api/users", userRoutes);
if (typeof reportRoutes === "function") app.use("/api/reports", reportRoutes);
if (typeof fineRoutes === "function") app.use("/api/fines", fineRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
