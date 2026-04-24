import React, { useState } from "react";
import "./EmployerDashboard.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";


function EmployerDashboard() {
  const employer = useSelector((state) => state.auth.employer);
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [showPostedJobs, setShowPostedJobs] = useState(false);
  const navigate = useNavigate();

  // Delete job function
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
        alert("Job deleted successfully!");
        // Remove the job from local state instead of re-fetching
        setPostedJobs(postedJobs.filter(job => job._id !== jobId));
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  const fetchApplicants = async () => {
    // 🔥 Toggle if already showing
    if (showApplicants) {
      setShowApplicants(false);
      return;
    }
    setShowPostedJobs(false); // Hide jobs if showing applicants

    if (!employer || !employer._id) {
      alert("Employer session not found ❌");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/employer/${employer._id}`
      );

      setApplicants(res.data);
      setShowApplicants(true);

    } catch (error) {
      console.log(error);
      alert("Failed to load applicants ❌");
    }
  };

  const fetchPostedJobs = async () => {
    // Toggle
    if (showPostedJobs) {
      setShowPostedJobs(false);
      return;
    }
    setShowApplicants(false); // Hide applicants if showing jobs

    if (!employer || !employer._id) {
      alert("Employer session not found ❌");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/jobs/employer-jobs-with-count/${employer._id}`
      );

      setPostedJobs(res.data);
      setShowPostedJobs(true);

    } catch (error) {
      console.error(error);
      alert("Failed to load posted jobs ❌");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Employer Dashboard</h2>
      <p className="dashboard-text">Welcome {employer?.name || "Employer"} 👋</p>

      <div className="dashboard-actions">
        <button
          className="dashboard-btn post-btn"
          onClick={() => navigate("/post-job")}
        >
          Post a Job
        </button>

        <button
          className="dashboard-btn view-btn"
          onClick={fetchPostedJobs}
        >
          {showPostedJobs ? "Hide Posted Jobs" : "My Posted Jobs"}
        </button>

        <button
          className="dashboard-btn view-btn"
          onClick={fetchApplicants}
        >
          {showApplicants ? "Hide Applicants" : "View Applicants"}
        </button>
      </div>

      {/* ================= POSTED JOBS ================= */}
      {showPostedJobs && (
        <div className="posted-jobs-section">
          <h2>Your Posted Jobs</h2>
          {postedJobs.length === 0 ? (
            <p className="no-applicants">You haven't posted any jobs yet.</p>
          ) : (
            <div className="posted-jobs-list">
              {postedJobs.map((job) => (
                <div key={job._id} className="posted-job-item">
                  <div className="job-card-top-section">
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                      <div className="job-meta">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                        <span>📅 Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                        <span>📝 {job.type || 'Full-time'}</span>
                      </div>
                    </div>
                    <div className="job-sidebar">
                      <div className="job-stats">
                        <div className="applicant-badge">
                          <span className="count">{job.applicantCount || 0}</span>
                          <span className="label">Applicants</span>
                        </div>
                      </div>
                      <div className="posted-job-actions">
                        <button 
                          className="view-applicants-btn"
                          onClick={() => navigate(`/job/${job._id}/applicants`)}
                        >
                          View Applicants
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => navigate(`/edit-job/${job._id}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  {job.description && (
                    <p className="job-description-preview">
                      {job.description.substring(0, 100)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= APPLICANTS ================= */}
      {showApplicants && (
        <div className="applicants-section">

          <h2>Applicants List</h2>

          {applicants.length === 0 ? (
            <p className="no-applicants">No applicants yet</p>
          ) : (

            <div className="applicants-grid">
              {applicants.map((app, index) => {
                return (
                  <Link to={`/applicant/${app._id}`} key={app._id} className="applicant-card-link">
                    <div className="applicant-card">
                      <div className="applicant-number">Applicant {index + 1}</div>
                      <div className="applicant-header">
                        <span className="job-title">
                          {app.jobId?.title || "Job Application"}
                        </span>
                      </div>
                      <img
                        src={app.userId?.profilePic || "https://i.pravatar.cc/100"}
                        alt="profile"
                        className="profile-img"
                      />
                      <div className="applicant-body">
                        <p><b>Name:</b> {app.userId?.name}</p>
                        <p><b>Email:</b> {app.userId?.email}</p>
                        <p><b>Address:</b> {app.userId?.address || "N/A"}</p>
                      </div>
                      {app.userId?.resume && (
                        <a
                          href={app.userId.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="resume-btn"
                        >
                          View Resume 📄
                        </a>
                      )}
                      <div className="app-footer">
                        Applied on:{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          )}

        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;