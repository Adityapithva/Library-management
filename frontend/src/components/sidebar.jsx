import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        📚 Library
      </div>

      <nav>

        <NavLink to="/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/books">
          📖 Books
        </NavLink>

        <NavLink to="/students">
          👨‍🎓 Students
        </NavLink>

        <NavLink to="/issue-book">
          📕 Issue Book
        </NavLink>

        <NavLink to="/transactions">
          📋 Transactions
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;