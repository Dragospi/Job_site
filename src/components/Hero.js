import React, { useState } from "react";
import "./Hero.css";
import { FaSearch, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";

function Hero({ onSearch }) {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ skills, experience, location });
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Find Your Dream Job</h1>
        <p>Search from thousands of available jobs across top companies</p>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-field">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Skills, Designations, Companies"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="search-field">
            <FaBriefcase className="icon" />
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Select Experience</option>
              <option value="0-1">0-1 Years</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5-10">5-10 Years</option>
              <option value="10+">10+ Years</option>
            </select>
          </div>
          <div className="search-field">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>
    </div>
  );
}

export default Hero;