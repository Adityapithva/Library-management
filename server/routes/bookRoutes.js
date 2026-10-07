const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD book
router.post("/", async (req, res) => {
  try {
    const {
      bookName,
      author,
      isbn,
      category,
      quantity,
    } = req.body;

    const book = new Book({
      bookName,
      author,
      isbn,
      category,
      quantity,
      availableQuantity: quantity,
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE book
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const oldQuantity = book.quantity;
    const newQuantity = Number(req.body.quantity);

    // Number of books currently issued
    const issuedCount =
      oldQuantity - book.availableQuantity;

    if (newQuantity < issuedCount) {
      return res.status(400).json({
        message:
          "Quantity cannot be less than the number of issued books",
      });
    }

    book.bookName = req.body.bookName;
    book.author = req.body.author;
    book.isbn = req.body.isbn;
    book.category = req.body.category;
    book.quantity = newQuantity;

    // Maintain correct available quantity
    book.availableQuantity =
      newQuantity - issuedCount;

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;