import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import "./styles/global.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
