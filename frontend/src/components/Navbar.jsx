import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("ecosort_user")
  );

  const handleLogout = () => {
    localStorage.removeItem("ecosort_user");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2>EcoSort AI</h2>
      </div>

      <div className="navbar-right">

        {user && (
          <span className="navbar-user">
            {user.name}
          </span>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;