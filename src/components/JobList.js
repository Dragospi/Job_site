import React from "react";
import "./JobList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function JobList({ jobs = [] }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleApply = async (jobId) => {
    if (!user) {
      alert("Please login first ❌");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/applications/apply",
        {
          userId: user._id,
          jobId: jobId,
        }
      );

      alert(res.data.message);
      navigate("/applied-jobs"); // Navigate to applied jobs on success
    } catch (error) {
      alert(error.response?.data?.message || "Apply failed ❌");
    }
  };

  return (
    <div className="joblist-section">
      <h2 className="joblist-title">Featured Jobs</h2>
      <p className="joblist-subtitle">Find your dream career from top companies hiring now</p>

      {jobs.length === 0 ? (
        <p className="no-jobs">No jobs available at the moment</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="job-card"
              onClick={() => navigate(`/job/${job._id}`)}
            >
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">🏢 {job.company}</p>

              <div className="job-details-row">
                <div className="job-detail-item">📍 {job.location}</div>
                <div className="job-detail-item">💰 {job.salary}</div>
                <div className="job-detail-item">💼 {job.type || "Full-time"}</div>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-footer">
                <span className="job-posted-date">
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <button 
                  className="apply-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(job._id);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default JobList;