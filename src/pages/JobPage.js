import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JobList from "../components/JobList";
import FilterBar from "../components/FilterBar"; // Import the new component
import "./JobPage.css";

function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize search params to avoid re-calculating on every render
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const initialFilters = {
    skills: searchParams.get("skills") || "",
    location: searchParams.get("location") || "",
    experience: searchParams.get("experience") || "",
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/jobs", {
          params: {
            skills: initialFilters.skills,
            location: initialFilters.location,
            experience: initialFilters.experience,
          },
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
  }, [location.search, initialFilters.skills, initialFilters.location, initialFilters.experience]); // Dependency array updated for clarity

  const handleSearch = (searchCriteria) => {
    const { skills, location, experience } = searchCriteria;
    const queryParams = new URLSearchParams({
      skills: skills || "",
      location: location || "",
      experience: experience || "",
    }).toString();
    navigate(`/jobs?${queryParams}`);
  };

  return (
    <div className="job-page-container">
      <FilterBar initialFilters={initialFilters} onSearch={handleSearch} />
      {loading && <p className="loading-text">Loading jobs...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && (
        <>
          {jobs.length > 0 ? (
            <JobList jobs={jobs} />
          ) : (
            <p className="loading-text">No jobs found matching your criteria.</p>
          )}
        </>
      )}
    </div>
  );
}

export default JobPage;