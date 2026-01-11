
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Register() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-50">
          <form>
            <div>
              <div className="mb-3">
                <label htmlFor="firstname">First Name</label>
                <input type="text" name="firstname" placeholder="John" className="form-control rounded-0" />
              </div>
              <div className="mb-3">
                <label htmlFor="lastname">Last Name</label>
                <input type="text" name="lastname" placeholder="Doe" className="form-control rounded-0" />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="test@gmail.com" className="form-control rounded-0" />
              </div>
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" className="form-control rounded-0" />
                <br />
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
              <br />
            </div>
          </form>
          <p>Already have an account?</p>
          <Link to="/login" className="btn btn-default border-100 w-100 rounded-0">Login</Link>
        </div>
      </div>
    </>
  )
};