import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    isbn: "",
    category: "",
    quantity: "",
  });

  // Get all books
  const fetchBooks = async () => {
    try {
      const response = await API.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add or update book
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/books/${editingId}`, {
          ...formData,
          quantity: Number(formData.quantity),
        });

        alert("Book updated successfully");
      } else {
        await API.post("/books", {
          ...formData,
          quantity: Number(formData.quantity),
        });

        alert("Book added successfully");
      }

      setFormData({
        bookName: "",
        author: "",
        isbn: "",
        category: "",
        quantity: "",
      });

      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // Edit book
  const handleEdit = (book) => {
    setEditingId(book._id);

    setFormData({
      bookName: book.bookName,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      quantity: book.quantity,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete book
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/books/${id}`);
      alert("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert("Failed to delete book");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);

    setFormData({
      bookName: "",
      author: "",
      isbn: "",
      category: "",
      quantity: "",
    });
  };

  // Search
  const filteredBooks = books.filter((book) => {
    const text = search.toLowerCase();

    return (
      book.bookName.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text) ||
      book.isbn.toLowerCase().includes(text) ||
      book.category.toLowerCase().includes(text)
    );
  });

  return (
    <Layout>
      <div className="page-header">
        <h1>Books</h1>
        <p>Add and manage library books</p>
      </div>

      {/* Book Form */}

      <div className="form-container">
        <h2>{editingId ? "Edit Book" : "Add New Book"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Book Name</label>

              <input
                type="text"
                name="bookName"
                value={formData.bookName}
                onChange={handleChange}
                placeholder="Enter book name"
                required
              />
            </div>

            <div className="form-group">
              <label>Author</label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label>ISBN</label>

              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Computer Science"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Book" : "Add Book"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Books Table */}

      <div className="table-container">
        <div className="table-header">
          <h2>Book List</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>

                    <td>{book.bookName}</td>

                    <td>{book.author}</td>

                    <td>{book.isbn}</td>

                    <td>{book.category}</td>

                    <td>{book.quantity}</td>

                    <td>
                      <span
                        className={
                          book.availableQuantity > 0
                            ? "status available"
                            : "status unavailable"
                        }
                      >
                        {book.availableQuantity}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(book._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No books found
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

export default Books;