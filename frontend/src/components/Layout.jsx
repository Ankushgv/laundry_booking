import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} />

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <div className="topbar">
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
