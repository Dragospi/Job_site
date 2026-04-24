import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./SavedJobs.css";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/${user._id}/saved-jobs`
        );
        setSavedJobs(res.data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  if (loading) {
    return <div className="loading-container">Loading saved jobs...</div>;
  }

  if (!user) {
    return (
      <div className="container">
        <h2>Access Denied</h2>
        <p>You must be logged in to view your saved jobs.</p>
      </div>
    );
  }

  return (
    <div className="saved-jobs-container">
      <h2>Your Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        <div className="job-list">
          {savedJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-details">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <p>{job.location}</p>
              </div>
              <Link to={`/job/${job._id}`} className="view-job-btn">
                View Job
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;