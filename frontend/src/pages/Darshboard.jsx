import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalStudents: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        booksResponse,
        studentsResponse,
        transactionsResponse,
      ] = await Promise.all([
        API.get("/books"),
        API.get("/students"),
        API.get("/transactions"),
      ]);

      const books = booksResponse.data;
      const students = studentsResponse.data;
      const transactions = transactionsResponse.data;

      const totalBooks = books.length;

      const availableBooks = books.reduce(
        (total, book) =>
          total + Number(book.availableQuantity || 0),
        0
      );

      const issuedBooks = transactions.filter(
        (transaction) =>
          transaction.status === "Issued"
      ).length;

      const totalStudents = students.length;

      setStats({
        totalBooks,
        availableBooks,
        issuedBooks,
        totalStudents,
      });

      // API already sorts newest transactions first
      setRecentTransactions(
        transactions.slice(0, 5)
      );

    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Layout>

      {/* Header */}

      <div className="page-header">
        <h1>Dashboard</h1>

        <p>
          Overview of your library
        </p>
      </div>

      {/* Statistics */}

      <div className="dashboard-cards">

        <div className="card dashboard-card">

          <div className="card-icon">
            📚
          </div>

          <div>
            <h3>Total Books</h3>

            <p>
              {loading
                ? "..."
                : stats.totalBooks}
            </p>
          </div>

        </div>

        <div className="card dashboard-card">

          <div className="card-icon">
            📖
          </div>

          <div>
            <h3>Available Books</h3>

            <p>
              {loading
                ? "..."
                : stats.availableBooks}
            </p>
          </div>

        </div>

        <div className="card dashboard-card">

          <div className="card-icon">
            📕
          </div>

          <div>
            <h3>Issued Books</h3>

            <p>
              {loading
                ? "..."
                : stats.issuedBooks}
            </p>
          </div>

        </div>

        <div className="card dashboard-card">

          <div className="card-icon">
            👨‍🎓
          </div>

          <div>
            <h3>Total Students</h3>

            <p>
              {loading
                ? "..."
                : stats.totalStudents}
            </p>
          </div>

        </div>

      </div>

      {/* Recent Transactions */}

      <div className="recent-container">

        <div className="recent-header">

          <div>
            <h2>Recent Transactions</h2>

            <p>
              Latest book activity
            </p>
          </div>

        </div>

        {recentTransactions.length > 0 ? (

          <div className="table-responsive">

            <table>

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {recentTransactions.map(
                  (transaction) => (

                    <tr key={transaction._id}>

                      <td>
                        {transaction.student
                          ?.studentName || "N/A"}
                      </td>

                      <td>
                        {transaction.book
                          ?.bookName || "N/A"}
                      </td>

                      <td>
                        {transaction.issueDate
                          ? new Date(
                              transaction.issueDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        {transaction.dueDate
                          ? new Date(
                              transaction.dueDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>

                        <span
                          className={
                            transaction.status ===
                            "Issued"
                              ? "status issued"
                              : "status returned"
                          }
                        >
                          {transaction.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="empty-transactions">
            No transactions yet.
          </div>

        )}

      </div>

      {/* Welcome */}

      <div className="welcome-box">

        <h2>
          Welcome to Library Management System
        </h2>

        <p>
          Manage books, students and book
          transactions from one simple dashboard.
        </p>

      </div>

    </Layout>
  );
}

export default Dashboard;