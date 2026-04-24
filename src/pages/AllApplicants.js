import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./AllApplicants.css";

function AllApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const employer = useSelector((state) => state.auth.employer);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      if (!employer || !employer._id) { // <-- Check for employer and employer._id
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/applications/employer/${employer._id}`
        );
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching all applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplicants();
  }, [employer]);

  if (loading) {
    return <div className="loading-container">Loading applicants...</div>;
  }

  if (!employer) {
    return (
      <div className="container">
        <h2>Access Denied</h2>
        <p>You must be logged in as an employer to view this page.</p>
      </div>
    );
  }

  return (
    <div className="all-applicants-container">
      <h2>All Job Applicants</h2>
      {applications.length === 0 ? (
        <p>No applicants have applied to your jobs yet.</p>
      ) : (
        <div className="applicant-list">
          {applications.map((app) => (
            <div key={app._id} className="applicant-card">
              <div className="applicant-details">
                <h4>{app.userId?.name || "N/A"}</h4>
                <p>
                  Applied for: <strong>{app.jobId?.title || "N/A"}</strong>
                </p>
                <p>
                  Status: <span className={`status ${app.status ? app.status.toLowerCase() : ''}`}>{app.status || 'N/A'}</span>
                </p>
              </div>
              <Link to={`/applicant/${app.userId?._id}`} className="view-profile-btn">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllApplicants;