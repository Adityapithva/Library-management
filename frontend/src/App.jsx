import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Darshboard";
import Books from "./pages/Books";
import Students from "./pages/Students";
import IssueBook from "./pages/IssueBook";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/books" element={<Books />} />

        <Route path="/students" element={<Students />} />

        <Route path="/issue-book" element={<IssueBook />} />

        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;