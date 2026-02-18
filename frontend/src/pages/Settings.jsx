import { useState, useEffect } from "react";
import { getProfile, updateEmail, updatePassword, updateName } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Settings() {
  const navigate = useNavigate();
  
  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({
    name: false,
    email: false,
    password: false,
  });

  // Form states
  const [nameForm, setNameForm] = useState({ name: "" });
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Message states
  const [messages, setMessages] = useState({
    name: { type: "", text: "" },
    email: { type: "", text: "" },
    password: { type: "", text: "" },
  });

  // Check authentication and load profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data);
      setNameForm({ name: data.name });
      setEmailForm({ email: data.email, password: "" });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear message after 5 seconds
  const showMessage = (section, type, text) => {
    setMessages(prev => ({
      ...prev,
      [section]: { type, text }
    }));
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [section]: { type: "", text: "" }
      }));
    }, 5000);
  };

  // Handle name update
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(prev => ({ ...prev, name: true }));
    setMessages(prev => ({ ...prev, name: { type: "", text: "" } }));

    try {
      const { data } = await updateName(nameForm);
      
      // Update local storage
      const user = JSON.parse(localStorage.getItem("user"));
      user.name = data.user.name;
      localStorage.setItem("user", JSON.stringify(user));
      
      // Update profile state
      setProfile(prev => ({ ...prev, name: data.user.name }));
      
      showMessage("name", "success", "Name updated successfully!");
    } catch (err) {
      showMessage("name", "error", err.response?.data?.message || "Failed to update name");
    } finally {
      setSubmitting(prev => ({ ...prev, name: false }));
    }
  };

  // Handle email update
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(prev => ({ ...prev, email: true }));
    setMessages(prev => ({ ...prev, email: { type: "", text: "" } }));

    try {
      const { data } = await updateEmail(emailForm);
      
      // Update local storage
      const user = JSON.parse(localStorage.getItem("user"));
      user.email = data.user.email;
      localStorage.setItem("user", JSON.stringify(user));
      
      // Update profile state
      setProfile(prev => ({ ...prev, email: data.user.email }));
      
      // Clear password field
      setEmailForm(prev => ({ ...prev, password: "" }));
      
      showMessage("email", "success", "Email updated successfully!");
    } catch (err) {
      showMessage("email", "error", err.response?.data?.message || "Failed to update email");
    } finally {
      setSubmitting(prev => ({ ...prev, email: false }));
    }
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(prev => ({ ...prev, password: true }));
    setMessages(prev => ({ ...prev, password: { type: "", text: "" } }));

    // Client-side validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("password", "error", "New passwords do not match");
      setSubmitting(prev => ({ ...prev, password: false }));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage("password", "error", "New password must be at least 6 characters");
      setSubmitting(prev => ({ ...prev, password: false }));
      return;
    }

    try {
      await updatePassword(passwordForm);
      
      // Clear all password fields
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      showMessage("password", "success", "Password updated successfully!");
    } catch (err) {
      showMessage("password", "error", err.response?.data?.message || "Failed to update password");
    } finally {
      setSubmitting(prev => ({ ...prev, password: false }));
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "16px" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <p className="settings-subtitle">Manage your account information</p>

      <div className="card settings-section">
        <h3>Update Name</h3>
        
        {messages.name.text && (
          <p className={messages.name.type === "success" ? "success" : "error"}>
            {messages.name.text}
          </p>
        )}

        <form onSubmit={handleNameSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={nameForm.name}
              onChange={(e) => setNameForm({ name: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting.name || nameForm.name === profile.name}
          >
            {submitting.name ? "Updating..." : "Update Name"}
          </button>
        </form>
      </div>

      <div className="card settings-section">
        <h3>Update Email</h3>
        <p className="settings-info">
          Current email: <strong>{profile.email}</strong>
        </p>
        
        {messages.email.text && (
          <p className={messages.email.type === "success" ? "success" : "error"}>
            {messages.email.text}
          </p>
        )}

        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label htmlFor="email">New Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter new email address"
              value={emailForm.email}
              onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-password">Current Password</label>
            <input
              type="password"
              id="email-password"
              name="password"
              placeholder="Enter your current password to confirm"
              value={emailForm.password}
              onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <small className="form-hint">
              For security, we need your current password to update your email
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting.email || emailForm.email === profile.email}
          >
            {submitting.email ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>

      <div className="card settings-section">
        <h3>Update Password</h3>
        
        {messages.password.text && (
          <p className={messages.password.type === "success" ? "success" : "error"}>
            {messages.password.text}
          </p>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              name="currentPassword"
              placeholder="Enter your current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ 
                ...prev, 
                currentPassword: e.target.value 
              }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              name="newPassword"
              placeholder="Enter new password (min 6 characters)"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ 
                ...prev, 
                newPassword: e.target.value 
              }))}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ 
                ...prev, 
                confirmPassword: e.target.value 
              }))}
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting.password}
          >
            {submitting.password ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
