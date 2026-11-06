import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function BottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ecosort_user");
    sessionStorage.removeItem("ecosort_user");
    setSheetOpen(false);
    navigate("/login");
  };

  const closeSheet = () => setSheetOpen(false);

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="bottom-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "bottom-nav-item active" : "bottom-nav-item"
          }
        >
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">Home</span>
        </NavLink>

        <NavLink
          to="/scan"
          className={({ isActive }) =>
            isActive ? "bottom-nav-item active" : "bottom-nav-item"
          }
        >
          <span className="bottom-nav-icon">📷</span>
          <span className="bottom-nav-label">Scan</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive ? "bottom-nav-item active" : "bottom-nav-item"
          }
        >
          <span className="bottom-nav-icon">🗺️</span>
          <span className="bottom-nav-label">Map</span>
        </NavLink>

        <NavLink
          to="/chatbot"
          className={({ isActive }) =>
            isActive ? "bottom-nav-item active" : "bottom-nav-item"
          }
        >
          <span className="bottom-nav-icon">🤖</span>
          <span className="bottom-nav-label">AI Chat</span>
        </NavLink>

        <button
          className="bottom-nav-item"
          onClick={() => setSheetOpen(true)}
          type="button"
        >
          <span className="bottom-nav-icon">⋯</span>
          <span className="bottom-nav-label">More</span>
        </button>
      </nav>

      {/* Slide-up Sheet Backdrop */}
      {sheetOpen && (
        <div
          className="bottom-sheet-backdrop"
          onClick={closeSheet}
        />
      )}

      {/* Slide-up Sheet */}
      <div className={`bottom-nav-sheet${sheetOpen ? " open" : ""}`}>
        <div className="bottom-sheet-handle" />
        <div className="bottom-sheet-title">More Options</div>

        <div className="bottom-sheet-items">
          <NavLink to="/impact"  className="bottom-sheet-item" onClick={closeSheet}>
            <span>🌱</span><span>Environmental Impact</span>
          </NavLink>

          <NavLink to="/history" className="bottom-sheet-item" onClick={closeSheet}>
            <span>🕘</span><span>Scan History</span>
          </NavLink>

          <NavLink to="/roadmap" className="bottom-sheet-item" onClick={closeSheet}>
            <span>🛣️</span><span>Roadmap</span>
          </NavLink>

          <NavLink to="/profile" className="bottom-sheet-item" onClick={closeSheet}>
            <span>👤</span><span>Profile</span>
          </NavLink>

          <NavLink to="/settings" className="bottom-sheet-item" onClick={closeSheet}>
            <span>⚙️</span><span>Settings</span>
          </NavLink>

          <button
            className="bottom-sheet-item bottom-sheet-logout"
            onClick={handleLogout}
            type="button"
          >
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default BottomNav;