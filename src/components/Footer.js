import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">


        <div className="footer-section">
          <h2 className="footer-logo" onClick={() => navigate("/")}>jobshere.com</h2>
          <p>
            Find your dream job with India's leading job portal.
            Explore thousands of opportunities across industries.
          </p>
        </div>

        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li onClick={() => navigate("/about-us")}>About Us</li>
            <li onClick={() => navigate("/contact-us")}>Contact Us</li>
            <li onClick={() => navigate("/careers")}>Careers</li>
            <li onClick={() => navigate("/faqs")}>FAQs</li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h3>Popular Categories</h3>
          <ul>
            <li onClick={() => navigate("/jobs/category/IT")}>IT Jobs</li>
            <li onClick={() => navigate("/jobs/category/Marketing")}>Marketing Jobs</li>
            <li onClick={() => navigate("/jobs/category/Finance")}>Finance Jobs</li>
            <li onClick={() => navigate("/jobs/category/Engineering")}>Engineering Jobs</li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
         {new Date().getFullYear()} jobshere.com. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;