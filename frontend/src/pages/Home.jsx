import { useEffect, useState } from "react";
import { createBooking, getBookings } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Home() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    bookingDate: "",
    bookingTime: "",
    duration: 3,
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate date is not in the past
    const selectedDate = new Date(form.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Please select a future date");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await createBooking(form);
      setSuccess("Booking created successfully!");
      
      // Reset form
      setForm({
        bookingDate: "",
        bookingTime: "",
        duration: 3,
      });

      // Refresh bookings list
      fetchBookings();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create booking. Please try again."
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      fetchBookings();
      setSuccess("Booking deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete booking");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div>
      <div className="card booking-form">
        <h2>Book a Laundry Time Slot</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
          Maximum booking duration: 3 hours
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="bookingDate">Select Date</label>
            <input
              type="date"
              id="bookingDate"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookingTime">Select Time</label>
            <input
              type="time"
              id="bookingTime"
              name="bookingTime"
              value={form.bookingTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (hours)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min="1"
              max="3"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Booking"}
          </button>
        </form>
      </div>

      <div className="bookings-container">
        <h3>Your Bookings</h3>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px' }}>Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3>No bookings yet</h3>
            <p>Create your first booking using the form above</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <p>
                    <strong>Date:</strong> {formatDate(booking.bookingDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(booking.bookingTime)}
                  </p>
                  <p>
                    <strong>Duration:</strong> {booking.duration} hour{booking.duration > 1 ? 's' : ''}
                  </p>
                  <p>
                    <span className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
