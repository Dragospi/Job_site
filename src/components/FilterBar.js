import React, { useState, useEffect } from "react";
import "./FilterBar.css";

function FilterBar({ initialFilters, onSearch }) {
  const [skills, setSkills] = useState(initialFilters.skills || "");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [experience, setExperience] = useState(initialFilters.experience || "");

  // Update state if the initial filters from URL change
  useEffect(() => {
    setSkills(initialFilters.skills || "");
    setLocation(initialFilters.location || "");
    setExperience(initialFilters.experience || "");
  }, [initialFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ skills, location, experience });
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-content">
        <form className="filter-form" onSubmit={handleSearch}>
          <div className="filter-field">
            <input
              type="text"
              placeholder="Skills, Designation, Company"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="filter-field">
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
          <div className="filter-field">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="filter-search-btn">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default FilterBar;