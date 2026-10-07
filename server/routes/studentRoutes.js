const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD student
router.post("/", async (req, res) => {
  try {
    const student = new Student({
      studentName: req.body.studentName,
      enrollmentNumber: req.body.enrollmentNumber,
      email: req.body.email,
      phone: req.body.phone,
      branch: req.body.branch,
      semester: req.body.semester,
    });

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Student creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;