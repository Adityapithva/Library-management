import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Return book
  const handleReturn = async (id) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) return;

    try {
      await API.put(`/transactions/return/${id}`);

      alert("Book returned successfully");

      fetchTransactions();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to return book"
      );
    }
  };

  // Search transactions
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const text = search.toLowerCase();

      const studentName =
        transaction.student?.studentName?.toLowerCase() ||
        "";

      const enrollment =
        transaction.student?.enrollmentNumber?.toLowerCase() ||
        "";

      const bookName =
        transaction.book?.bookName?.toLowerCase() ||
        "";

      return (
        studentName.includes(text) ||
        enrollment.includes(text) ||
        bookName.includes(text)
      );
    }
  );

  return (
    <Layout>
      <div className="page-header">
        <h1>Transactions</h1>

        <p>
          View issued and returned books
        </p>
      </div>

      <div className="table-container">

        <div className="table-header">

          <h2>Transaction History</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search transactions..."
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
                <th>Student</th>
                <th>Enrollment</th>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(
                  (transaction, index) => (
                    <tr key={transaction._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {transaction.student
                          ?.studentName || "N/A"}
                      </td>

                      <td>
                        {transaction.student
                          ?.enrollmentNumber || "N/A"}
                      </td>

                      <td>
                        {transaction.book
                          ?.bookName || "N/A"}
                      </td>

                      <td>
                        {new Date(
                          transaction.issueDate
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {new Date(
                          transaction.dueDate
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {transaction.returnDate
                          ? new Date(
                              transaction.returnDate
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

                      <td>

                        {transaction.status ===
                        "Issued" ? (
                          <button
                            className="btn btn-return"
                            onClick={() =>
                              handleReturn(
                                transaction._id
                              )
                            }
                          >
                            Return
                          </button>
                        ) : (
                          <span className="returned-text">
                            Completed
                          </span>
                        )}

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="no-data"
                  >
                    No transactions found
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

export default Transactions;