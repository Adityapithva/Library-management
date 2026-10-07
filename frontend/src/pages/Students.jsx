import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    enrollmentNumber: "",
    email: "",
    phone: "",
    branch: "",
    semester: "",
  });

  // Get all students
  const fetchStudents = async () => {
    try {
      const response = await API.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const studentData = {
        ...formData,
        semester: Number(formData.semester),
      };

      if (editingId) {
        await API.put(`/students/${editingId}`, studentData);

        alert("Student updated successfully");
      } else {
        await API.post("/students", studentData);

        alert("Student added successfully");
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      studentName: student.studentName,
      enrollmentNumber: student.enrollmentNumber,
      email: student.email,
      phone: student.phone,
      branch: student.branch,
      semester: student.semester,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${id}`);

      alert("Student deleted successfully");

      fetchStudents();
    } catch (error) {
      console.error(error);

      alert("Failed to delete student");
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      studentName: "",
      enrollmentNumber: "",
      email: "",
      phone: "",
      branch: "",
      semester: "",
    });
  };

  // Search students
  const filteredStudents = students.filter((student) => {
    const text = search.toLowerCase();

    return (
      student.studentName.toLowerCase().includes(text) ||
      student.enrollmentNumber
        .toLowerCase()
        .includes(text) ||
      student.email.toLowerCase().includes(text) ||
      student.branch.toLowerCase().includes(text)
    );
  });

  return (
    <Layout>
      {/* Header */}

      <div className="page-header">
        <h1>Students</h1>

        <p>
          Add and manage library students
        </p>
      </div>

      {/* Student Form */}

      <div className="form-container">
        <h2>
          {editingId
            ? "Edit Student"
            : "Add New Student"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Student Name */}

            <div className="form-group">
              <label>Student Name</label>

              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            {/* Enrollment */}

            <div className="form-group">
              <label>Enrollment Number</label>

              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                placeholder="Enter enrollment number"
                required
              />
            </div>

            {/* Email */}

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            {/* Phone */}

            <div className="form-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Branch */}

            <div className="form-group">
              <label>Branch</label>

              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Branch
                </option>

                <option value="Computer Engineering">
                  Computer Engineering
                </option>

                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="Electronics Engineering">
                  Electronics Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>
              </select>
            </div>

            {/* Semester */}

            <div className="form-group">
              <label>Semester</label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Semester
                </option>

                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingId
                ? "Update Student"
                : "Add Student"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>
        </form>
      </div>

      {/* Student Table */}

      <div className="table-container">

        <div className="table-header">

          <h2>Student List</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search students..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="table-responsive">

          <table>

            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Enrollment</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.length > 0 ? (
                filteredStudents.map(
                  (student, index) => (
                    <tr key={student._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {student.studentName}
                      </td>

                      <td>
                        {student.enrollmentNumber}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>
                        {student.branch}
                      </td>

                      <td>
                        {student.semester}
                      </td>

                      <td>
                        <div className="action-buttons">

                          <button
                            className="btn btn-edit"
                            onClick={() =>
                              handleEdit(student)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-delete"
                            onClick={() =>
                              handleDelete(
                                student._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="no-data"
                  >
                    No students found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </Layout>
  );
}

export default Students;