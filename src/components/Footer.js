import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h2 className="footer-logo" onClick={() => navigate("/")}>
            jobshere.com
          </h2>
          <p>
            Your gateway to a world of career opportunities. We connect talented
            individuals with top companies.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <div className="footer-section">
            <h3>Job Seekers</h3>
            <ul>
              <li onClick={() => navigate("/jobs")}>Find Jobs</li>
              <li onClick={() => navigate("/register")}>Create Account</li>
              <li onClick={() => navigate("/profile")}>Your Profile</li>
              <li onClick={() => navigate("/applied-jobs")}>Applied Jobs</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>For Employers</h3>
            <ul>
              <li onClick={() => navigate("/employer-login")}>Employer Login</li>
              <li onClick={() => navigate("/employer-register")}>Register Company</li>
              <li onClick={() => navigate("/employer/dashboard")}>Dashboard</li>
              <li onClick={() => navigate("/post-a-job")}>Post a Job</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li onClick={() => navigate("/about-us")}>About Us</li>
              <li onClick={() => navigate("/contact-us")}>Contact Us</li>
              <li onClick={() => navigate("/careers")}>Careers</li>
              <li onClick={() => navigate("/faqs")}>FAQs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} jobshere.com. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;