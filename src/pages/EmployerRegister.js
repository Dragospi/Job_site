import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployerAuth.css"; // Use the new CSS file

function EmployerRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/employer-register",
        { name, email, companyName, password }
      );
      alert(res.data.message);
      navigate("/employer-login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="employer-register-container">
      <div className="employer-register-card">
        <h2>Create Your Employer Account</h2>
        <p className="subtitle">Join our platform to find the best talent.</p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Company Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Company's Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-btn">
            Register as Employer
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/employer-login")}
            className="employer-switch-auth"
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default EmployerRegister;