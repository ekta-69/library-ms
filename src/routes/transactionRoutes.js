const express = require("express");
const router = express.Router();
const {
  getAllIssues,
  issueBook,
  returnBook,
  payFine,
  getUserIssuedBooks,
} = require("../controllers/transactionController");

router.post("/issue", issueBook);
router.post("/return", returnBook);
router.post("/payfine", payFine);
router.get("/user/:username", getUserIssuedBooks);
router.get("/users/", getAllIssues);

module.exports = router;
