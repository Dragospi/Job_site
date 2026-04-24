import React, { useState } from "react";
import "./JobFilters.css";

function JobFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    jobType: "",
    experience: "",
    salary: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      jobType: "",
      experience: "",
      salary: "",
      location: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="job-filters">
      <h3 className="filters-title">Filter By</h3>

      <div className="filter-group">
        <label htmlFor="jobType">Job Type</label>
        <select
          name="jobType"
          id="jobType"
          className="filter-select"
          onChange={handleInputChange}
          value={filters.jobType}
        >
          <option value="">All</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="experience">Experience Level</label>
        <select
          name="experience"
          id="experience"
          className="filter-select"
          onChange={handleInputChange}
          value={filters.experience}
        >
          <option value="">All</option>
          <option value="Entry-level">Entry-level</option>
          <option value="Mid-level">Mid-level</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="salary">Salary Range (in ₹)</label>
        <select
          name="salary"
          id="salary"
          className="filter-select"
          onChange={handleInputChange}
          value={filters.salary}
        >
          <option value="">All</option>
          <option value="0-500000">₹0 - ₹5,00,000</option>
          <option value="500000-1000000">₹5,00,000 - ₹10,00,000</option>
          <option value="1000000-1500000">₹10,00,000 - ₹15,00,000</option>
          <option value="1500000+">₹15,00,000+</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          id="location"
          className="filter-input"
          placeholder="e.g., Mumbai"
          onChange={handleInputChange}
          value={filters.location}
        />
      </div>

      <div className="filter-actions">
        <button className="btn-apply-filters" onClick={handleApplyFilters}>
          Apply
        </button>
        <button className="btn-clear-filters" onClick={handleClearFilters}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default JobFilters;