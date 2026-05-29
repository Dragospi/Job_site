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

        <div className="nav-auth">
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
      <div className="nav-auth">
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
                    <div className="dropdown-header">
                      Signed in as <strong>{user?.name || employer?.name}</strong>
                    </div>
                    <div className="dropdown-divider"></div>
                    {user ? (
                      <>
                        <div className="dropdown-item" onClick={() => navigate("/profile")}>
                          Your Profile
                        </div>
                        <div className="dropdown-item" onClick={() => navigate("/applied-jobs")}>
                          Applied Jobs
                        </div>
                        <div className="dropdown-item" onClick={() => navigate("/saved-jobs")}>
                          Saved Jobs
                        </div>
                      </>
                    ) : employer ? (
                      <>
                        <div className="dropdown-item" onClick={() => navigate("/employer/dashboard")}>
                          Dashboard
                        </div>
                        <div className="dropdown-item" onClick={() => navigate("/employer/jobs")}>
                          Manage Jobs
                        </div>
                      </>
                    ) : null}
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item logout" onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="nav-btn login" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="nav-btn register" onClick={() => navigate("/register")}>
                Register
              </button>
              <div className="employer-link-container">
                <a href="/employer-login" className="employer-link">
                  For Employers
                </a>
              </div>
            </>
          )}
        </div>
    </nav>
  );
}

export default Navbar;