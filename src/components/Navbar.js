import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import Notifications from "./Notifications";
import { FaBell } from "react-icons/fa";
import axios from "axios";


function Navbar({ resetSearch }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const employer = useSelector((state) => state.auth.employer);
  const isLoggedIn = !!user || !!employer; // Derive directly

  const [openMenu, setOpenMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications only for regular users
    if (user && user.role !== 'admin') {
      axios
        .get(`http://localhost:5000/api/notifications/${user._id}`)
        .then((res) => {
          const unread = res.data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [user]);

  const menuRef = useRef();
  
  const goHome = () => {
    if (resetSearch) resetSearch();
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("employerUser");
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const profileImage =
    (user || employer)?.profilePic ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${(user || employer)?.name}`;

  // Render a special navbar for admins
  if (user && user.role === 'admin') {
    return (
      <nav className="navbar">
        {/* ADMIN LOGO */}
        <div className="logo">
          <h2 onClick={() => navigate("/admin/dashboard")} style={{ cursor: "pointer" }}>
            jobshere.com
          </h2>
        </div>

        {/* Spacer to push profile to the right */}
        <div style={{ flexGrow: 1 }}></div>

        {/* RIGHT SIDE - ADMIN */}
        <div className="nav-buttons">
          <div className="navbar-profile-container" ref={menuRef}>
            <img
              src={profileImage}
              alt="profile"
              className="profile-pic"
              onClick={() => setOpenMenu(!openMenu)}
            />
            {openMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => navigate("/admin/dashboard")}>
                  Dashboard
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // Render the default navbar for users and employers
  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo">
        <h2 onClick={goHome} style={{ cursor: "pointer" }}>
          jobshere.com
        </h2>
      </div>

      {/* NAV LINKS */}
      <ul className={`nav-links ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
        <li onClick={() => navigate("/companies")}>Companies</li>
        <li onClick={() => navigate("/jobs")}>Jobs</li>
        <li onClick={() => navigate("/guide")}>Guide</li>
      </ul>

      {/* HAMBURGER ICON */}
      <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-buttons">
        {isLoggedIn ? (
          <>
            {user && user.role !== 'admin' && (
              <div className="notification-icon" onClick={() => setOpenNotifications(!openNotifications)}>
                <FaBell />
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                {openNotifications && <Notifications />}
              </div>
            )}
            <div className="navbar-profile-container" ref={menuRef}>
              <img
                src={profileImage}
                alt="profile"
                className="profile-pic"
                onClick={() => setOpenMenu(!openMenu)}
              />
              {openMenu && (
                <div className="profile-dropdown">
                  {user ? (
                    <>
                      <div className="dropdown-item" onClick={() => navigate("/applied-jobs")}>
                        Applied Jobs
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/saved-jobs")}>
                        Saved Jobs
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/profile")}>
                        View Profile
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/edit-profile")}>
                        Edit Profile
                      </div>
                      <div className="dropdown-item logout" onClick={handleLogout}>
                        Logout
                      </div>
                    </>
                  ) : employer ? (
                    <>
                      <div className="dropdown-item" onClick={() => navigate("/employer/dashboard")}>
                        Dashboard
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/emp-profile")}>
                        View Profile
                      </div>
                      <div className="dropdown-item" onClick={() => navigate("/emp-edit-profile")}>
                        Edit Profile
                      </div>
                      <div className="dropdown-item logout" onClick={handleLogout}>
                        Logout
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="register" onClick={() => navigate("/register")}>
              Register
            </button>
            <button className="register" onClick={() => navigate("/employer-login")}>
              For Employers
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;