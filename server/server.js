const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bookRoutes = require("./routes/bookRoutes");
const studentRoutes = require("./routes/studentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
// Test route
app.get("/", (req, res) => {
  res.send("Library Management System API is running");
});
app.use("/api/students", studentRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});