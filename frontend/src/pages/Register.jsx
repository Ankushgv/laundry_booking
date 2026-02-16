import { useState } from "react";
import { createUser } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await createUser(form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={submitHandler}>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
