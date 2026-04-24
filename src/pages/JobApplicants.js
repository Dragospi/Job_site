import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./JobApplicants.css";

function JobApplicants() {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      try {
        // Fetch job details
        const jobRes = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(jobRes.data);

        // Fetch applicants for the job
        const applicantsRes = await axios.get(`http://localhost:5000/api/applications/job/${id}`);
        setApplicants(applicantsRes.data);

      } catch (error) {
        console.error("Error fetching job and applicants:", error);
        alert("Failed to load job applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicants();
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading applicants...</div>;
  }

  if (!job) {
    return <div className="loading-container">Job not found.</div>;
  }

  return (
    <div className="job-applicants-container">
      <div className="job-header-info">
        <h2>Applicants for {job.title}</h2>
        <p>{job.company} - {job.location}</p>
      </div>

      {applicants.length === 0 ? (
        <p className="no-applicants-message">No one has applied to this job yet.</p>
      ) : (
        <div className="applicants-list-grid">
          {applicants.map((app) => (
            <Link to={`/applicant/${app._id}`} key={app._id} className="applicant-card-link">
              <div className="applicant-card">
                <img
                  src={app.userId?.profilePic || "https://i.pravatar.cc/100"}
                  alt="profile"
                  className="profile-img"
                />
                <div className="applicant-info">
                  <h4>{app.userId?.name}</h4>
                  <p>{app.userId?.email}</p>
                  {app.userId?.resume && (
                    <a
                      href={app.userId.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-link"
                    >
                      View Resume 📄
                    </a>
                  )}
                </div>
                <div className="applied-date">
                  Applied on: {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobApplicants;