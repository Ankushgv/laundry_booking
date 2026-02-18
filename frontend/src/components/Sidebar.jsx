import { Link, useNavigate } from "react-router-dom";

function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo">
        {!collapsed && <span>LaundryPro</span>}
      </div>

      <nav>
        <Link to="/">Home</Link>

        {!user && !collapsed && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && !collapsed && (
          <>
            <Link to="/settings">Settings</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
