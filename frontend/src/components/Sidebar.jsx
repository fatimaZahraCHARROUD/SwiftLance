import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    // remove auth token
    localStorage.removeItem("token");

    // redirect to login page
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>SwiftLance</h2>

      <ul>
        <li>
          <Link to="/app">Dashboard</Link>
        </li>
        <li>
          <Link to="/app/clients">Clients</Link>
        </li>
        <li>
          <Link to="/app/projects">Projects</Link>
        </li>
      </ul>

      {/* Logout button */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;