import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111827" }}>
        Voting App
      </Link>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {user && user.isAdmin && (
          <Link to="/create" style={{ textDecoration: "none", fontSize: "0.9rem" }}>
            Create Election
          </Link>
        )}
        {user ? (
          <>
            <span style={{ fontSize: "0.9rem" }}>Hi, {user.name}</span>
            <button className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
