import { useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../App";

function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <span className="navbar-logo-icon">♻️</span>
        <h2>EcoSort AI</h2>
      </div>

      <div className="navbar-right">

        {user && (
          <>
            {/* Avatar – always visible */}
            <div className="user-avatar" title={user.name}>
              {initials}
            </div>

            {/* Name – hidden on mobile */}
            <span className="navbar-user navbar-user-name">
              {user.name}
            </span>

            {/* Logout – hidden on mobile (available via bottom nav More menu) */}
            <button
              className="logout-button navbar-logout-desktop"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
