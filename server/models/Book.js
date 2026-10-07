const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model("Book", bookSchema);