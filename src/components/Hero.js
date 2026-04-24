import React, { useState } from "react";
import "./Hero.css";

function Hero({ onSearch }) {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Pass the search criteria up to the parent component
    onSearch({ skills, experience, location });
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Find Your Dream Job</h1>
        <p>Search from 100+ available jobs across top companies</p>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-field">
            <i className="fa fa-search"></i>
            <input
              type="text"
              placeholder="Skills, Designations, Companies"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="search-field">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Experience</option>
              <option value="0-1">0-1 Years</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
          <div className="search-field">
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