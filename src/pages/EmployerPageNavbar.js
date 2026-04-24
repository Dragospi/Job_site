import React from "react";
import "./EmployerPageNavbar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

function EmployerPageNavbar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const employer = useSelector((state) => state.auth.employer);

  const handleLogout = () => {
    console.log("Logging out...");

    localStorage.removeItem("user");
    localStorage.removeItem("employerUser");

    dispatch(logout());

    window.location.href = "/login";
  };

  return (
    <nav className="emp-navbar">

      {/* LEFT */}
      <div className="emp-left">
        <h2 onClick={() => navigate("/employer/dashboard")} style={{ cursor: "pointer" }}>
          EPortal
        </h2>
      </div>

      {/* MIDDLE */}
      <div className="emp-middle">
        <button onClick={() => navigate("/employer/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/post-job")}>
          Jobs
        </button>

        <button onClick={() => navigate("/employer/applicants")}>Applicants</button>
      </div>

      {/* RIGHT */}
      <div className="emp-right">

        <img
          src={employer?.profilePic || "https://i.pravatar.cc/40"}
          alt="profile"
          className="profile-pic"
        />

        {/* DROPDOWN - Now always in DOM, controlled by CSS hover */}
        <div className="dropdown-menu">
          <p onClick={() => navigate("/emp-profile")}>View Profile</p>
          <p onClick={() => navigate("/emp-edit-profile")}>Edit Profile</p>
          <p onClick={handleLogout} className="logout">Logout</p>
        </div>

      </div>

    </nav>
  );
}

export default EmployerPageNavbar;