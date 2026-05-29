import React, { useState, useEffect } from "react";
import "./JobFilters.css";

const JobFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      skills: "",
      location: "",
      experience: "",
      type: "",
      salary: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-card">
      <h3 className="filters-title">Filter Jobs</h3>

      <div className="filter-group">
        <label>Skills / Designation</label>
        <input
          type="text"
          name="skills"
          value={filters.skills}
          onChange={handleInputChange}
          placeholder="e.g., React, Node.js"
        />
      </div>

      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          placeholder="e.g., London"
        />
      </div>

      <div className="filter-group">
        <label>Experience</label>
        <select
          name="experience"
          value={filters.experience}
          onChange={handleInputChange}
        >
          <option value="">All Levels</option>
          <option value="0-1">0-1 Years</option>
          <option value="1-3">1-3 Years</option>
          <option value="3-5">3-5 Years</option>
          <option value="5-10">5-10 Years</option>
          <option value="10+">10+ Years</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Job Type</label>
        <select name="type" value={filters.type} onChange={handleInputChange}>
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="filter-buttons">
        <button className="apply-btn" onClick={handleApplyFilters}>
          Apply Filters
        </button>
        <button className="clear-btn" onClick={handleClearFilters}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default JobFilters;