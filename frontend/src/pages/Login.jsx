import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/global.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Attempting login...");

    try {
      const { data } = await loginUser(form);
      console.log("Login response received:", data);
      
      // Store user data
      const userData = data.user || { _id: data._id, name: data.name, email: data.email };
      const token = data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      
      console.log("User data saved to localStorage");
      console.log("Navigating to home page...");
      
      // Navigate to home page
      navigate("/", { replace: true });
      
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={submitHandler}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your LaundryPro account</p>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
