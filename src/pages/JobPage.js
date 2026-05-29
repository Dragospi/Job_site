import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JobList from "../components/JobList";
import JobFilters from "../components/JobFilters";
import "./JobPage.css";

function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const initialFilters = React.useMemo(() => ({
    skills: searchParams.get("skills") || "",
    location: searchParams.get("location") || "",
    experience: searchParams.get("experience") || "",
    type: searchParams.get("type") || "",
    salary: searchParams.get("salary") || "",
  }), [searchParams]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/jobs", {
          params: initialFilters,
        });
        setJobs(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [initialFilters]);

  const handleFilterChange = (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    navigate(`/jobs?${queryParams}`);
  };

  return (
    <div className="job-page">
      <div className="job-page-content">
        <div className="filters-container">
          <JobFilters onFilterChange={handleFilterChange} initialFilters={initialFilters} />
        </div>
        <div className="job-listings-container">
          {loading && <p className="status-text">Loading jobs...</p>}
          {error && <p className="status-text error">{error}</p>}
          {!loading && !error && (
            <>
              <div className="job-count">
                Showing <strong>{jobs.length}</strong> jobs
              </div>
              {jobs.length > 0 ? (
                <JobList jobs={jobs} />
              ) : (
                <p className="status-text">No jobs found matching your criteria.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobPage;