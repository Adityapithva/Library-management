import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function IssueBook() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    student: "",
    book: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch students and books
  const fetchData = async () => {
    try {
      const [studentsResponse, booksResponse] =
        await Promise.all([
          API.get("/students"),
          API.get("/books"),
        ]);

      setStudents(studentsResponse.data);
      setBooks(booksResponse.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load students or books");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Issue book
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student || !formData.book || !formData.dueDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/transactions/issue", formData);

      alert("Book issued successfully");

      setFormData({
        student: "",
        book: "",
        dueDate: "",
      });

      // Refresh book availability
      fetchData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to issue book"
      );
    } finally {
      setLoading(false);
    }
  };

  // Only show books that are available
  const availableBooks = books.filter(
    (book) => book.availableQuantity > 0
  );

  return (
    <Layout>
      <div className="page-header">
        <h1>Issue Book</h1>

        <p>
          Issue a library book to a student
        </p>
      </div>

      <div className="issue-container">

        <div className="issue-icon">
          📕
        </div>

        <h2>Issue a Book</h2>

        <p className="issue-description">
          Select a student, choose an available book,
          and set the due date.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Student */}

          <div className="form-group">
            <label>Student</label>

            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Student
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.studentName} -
                  {" "}
                  {student.enrollmentNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Book */}

          <div className="form-group">
            <label>Book</label>

            <select
              name="book"
              value={formData.book}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Book
              </option>

              {availableBooks.map((book) => (
                <option
                  key={book._id}
                  value={book._id}
                >
                  {book.bookName} -
                  {" "}
                  Available: {book.availableQuantity}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}

          <div className="form-group">
            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary issue-button"
            disabled={loading}
          >
            {loading
              ? "Issuing..."
              : "Issue Book"}
          </button>

        </form>

      </div>

      {availableBooks.length === 0 && (
        <div className="info-message">
          No books are currently available.
        </div>
      )}

      {students.length === 0 && (
        <div className="info-message">
          Please add a student before issuing a book.
        </div>
      )}

    </Layout>
  );
}

export default IssueBook;