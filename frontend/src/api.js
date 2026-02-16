import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// -------- AUTH --------
export const createUser = (formData) =>
  API.post("/register", formData);

export const loginUser = (formData) =>
  API.post("/login", formData);

// -------- BOOKINGS --------
export const createBooking = (formData) =>
  API.post("/bookings", formData);

export const getBookings = () =>
  API.get("/bookings");

export const deleteBooking = (id) =>
  API.delete(`/bookings/${id}`);

// -------- SETTINGS --------
export const getProfile = () => {
  API.get("/settings/profile");
};

export const updateEmail = (formData) => {
  API.put("/settings/email", formData);
};

export const updatePassword = (formData) => {
  API.put("/settings/password", formData);
};

export const updateName = (formData) => {
  API.put("/settings/name", formData);
};

export default API;
