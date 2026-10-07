const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },

    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;