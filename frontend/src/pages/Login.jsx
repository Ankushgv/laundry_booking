import { useState } from "react"
import { Link } from "react-router-dom"

export default function Login() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-50">
          <form>
            <div>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="test@gmail.com" className="form-control rounded-0" />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" className="form-control rounded-0" />
                <br />
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-0">Login</button>
              <br />
            </div>
          </form>
          <a href="forgot_email.html">forgot password</a>
          <br />
          <Link class="btn btn-default w-100" to="/Register">Register New</Link>
        </div>
      </div>
    </>
  )
};