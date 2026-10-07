const express = require("express");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Student = require("../models/Student");

const router = express.Router();

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("student")
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ISSUE BOOK
router.post("/issue", async (req, res) => {
  try {
    console.log("Issue request received:", req.body);

    const { student, book, dueDate } = req.body;

    // Check required fields
    if (!student || !book || !dueDate) {
      return res.status(400).json({
        message: "Student, book and due date are required",
      });
    }

    // Check student
    const studentData = await Student.findById(student);

    if (!studentData) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Check book
    const bookData = await Book.findById(book);

    if (!bookData) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    console.log("Book found:", bookData.bookName);
    console.log("Available:", bookData.availableQuantity);

    // Check availability
    if (bookData.availableQuantity <= 0) {
      return res.status(400).json({
        message: "Book is not available",
      });
    }

    // Create transaction
    const transaction = new Transaction({
      student: student,
      book: book,
      dueDate: dueDate,
    });

    await transaction.save();

    console.log("Transaction created");

    // Decrease available quantity
    bookData.availableQuantity =
      bookData.availableQuantity - 1;

    await bookData.save();

    console.log("Book quantity updated");

    // Get complete transaction
    const result = await Transaction.findById(
      transaction._id
    )
      .populate("student")
      .populate("book");

    console.log("Issue completed successfully");

    res.status(201).json(result);

  } catch (error) {
    console.error("ISSUE BOOK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// RETURN BOOK
router.put("/return/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.id
    );
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    if (transaction.status === "Returned") {
      return res.status(400).json({
        message: "Book already returned",
      });
    }
    transaction.status = "Returned";
    transaction.returnDate = new Date();
    await transaction.save();
    const book = await Book.findById(transaction.book);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }
    const result = await Transaction.findById(
      transaction._id
    )
      .populate("student")
      .populate("book");
    res.json(result);
  } catch (error) {
    console.error("RETURN BOOK ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;









