import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import "./Auth.css"; // We'll create a shared CSS file for auth pages

function EmployerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/employer-login",
        { email, password }
      );
      alert(res.data.message);
      dispatch(login({ user: res.data.user, isEmployer: true }));
      localStorage.setItem("employerUser", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employer/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-card">
      <h2>Employer & Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login">
          Login
        </button>
      </form>
      <p>
        Don't have an employer account?{" "}
        <span onClick={() => navigate("/employer-register")} className="switch-auth">
          Register here
        </span>
      </p>
    </div>
  );
}

export default EmployerLogin;