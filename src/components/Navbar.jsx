// components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LiveClock from "./LiveClock";

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

   return (
    <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 sm:py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-700">{title}</h1>
          {user && <p className="text-xs text-slate-500">Welcome, {user.name}</p>}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
          <LiveClock />
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition px-4 py-2 rounded-lg whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
