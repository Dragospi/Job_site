import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  // 🔍 Handle Search
  const handleSearch = () => {
    onSearch({
      skills,
      experience,
      location
    });
  };

  // 🔄 Reset Fields
  const handleReset = () => {
    setSkills("");
    setExperience("");
    setLocation("");
  };

  return (
    <div className="search-container">

      <span className="search-icon">🔍</span>

      {/* SKILLS */}
      <input
        type="text"
        placeholder="Skills, Designations, Companies"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        className="input-field"
      />

      <div className="divider"></div>

      {/* EXPERIENCE */}
      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="input-field"
      >
        <option value="">Experience</option>
        <option value="0-1">0-1 years</option>
        <option value="1-3">1-3 years</option>
        <option value="3-5">3-5 years</option>
        <option value="5+">5+ years</option>
      </select>

      <div className="divider"></div>

      {/* LOCATION */}
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="input-field"
      />

      {/* SEARCH BUTTON */}
      <button onClick={handleSearch} className="search-btn">
        Search
      </button>

      {/* RESET BUTTON */}
      {(skills || experience || location) && (
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      )}

    </div>
  );
}

export default SearchBar;