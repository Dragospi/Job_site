import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApplicantProfile.css";
import { useSelector } from "react-redux";

function ApplicantProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const employer = useSelector((state) => state.auth.employer);

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplication = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/details/${applicationId}`
      );

      // Security Check: Ensure the logged-in employer owns the job
      if (employer && res.data.jobId.employerId !== employer._id) {
        alert("You are not authorized to view this applicant.");
        navigate("/employer/dashboard");
        return;
      }
      setApplication(res.data);
    } catch (error) {
      console.error("Error fetching applicant data:", error);
      alert("Failed to load applicant data.");
    } finally {
      setLoading(false);
    }
  }, [applicationId, employer, navigate]);

  useEffect(() => {
    if (!employer) {
      alert("Please log in as an employer to view applicants.");
      navigate("/employer-login");
      return;
    }
    fetchApplication();
  }, [employer, navigate, fetchApplication]);

  const handleApprove = () => {
    navigate(`/schedule-interview/${applicationId}`);
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/reject/${applicationId}`
      );
      alert("Applicant rejected.");
      // Refetch to get the updated status
      fetchApplication();
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      alert("Failed to reject applicant. Please try again.");
    }
  };

  const handleSendFollowUp = async () => {
    if (
      !window.confirm(
        "Are you sure you want to send a follow-up email to this applicant?"
      )
    ) {
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/applications/send-follow-up/${applicationId}`,
        { employerId: employer._id }
      );
      alert("Follow-up email sent successfully!");
    } catch (error) {
      console.error("Error sending follow-up email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  if (loading) {
    return <p className="loading-text">Loading applicant profile...</p>;
  }

  if (!application) {
    return <p className="error-text">Could not find application details.</p>;
  }

  const { userId: applicant, jobId: job, status } = application;

  return (
    <div className="applicant-profile-container">
      <div className="profile-header">
        <h1 className="applicant-name">{applicant.name}</h1>
        <p className="applicant-email">Applied for: {job.title}</p>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-container">
          {applicant.skills && applicant.skills.length > 0 ? (
            applicant.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))
          ) : (
            <p>No skills listed.</p>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Resume</h2>
        {applicant.resume ? (
          <a
            href={applicant.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-link"
          >
            View Resume
          </a>
        ) : (
          <p>No resume uploaded.</p>
        )}
      </div>

      <div className="profile-section">
        <h2 className="section-title">Contact Information</h2>
        <p>
          <strong>Email:</strong> {applicant.email}
        </p>
      </div>

      <div className="status-section">
        <h2 className="section-title">Application Status</h2>
        <p className={`status-badge ${status.replace(" ", "-").toLowerCase()}`}>
          {status}
        </p>
      </div>

      <div className="profile-actions">
        {status === "Applied" && (
          <>
            <button onClick={handleApprove} className="approve-btn">
              Schedule Interview
            </button>
            <button onClick={handleReject} className="reject-btn">
              Reject
            </button>
          </>
        )}
        <button onClick={handleSendFollowUp} className="email-btn">
          Send Follow-up Email
        </button>
      </div>
    </div>
  );
}

export default ApplicantProfile;