import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";
import "react-datepicker/dist/react-datepicker.css";
import "./ScheduleInterview.css";
import { useSelector } from "react-redux";

// Register the locale to fix webpack warning
registerLocale("en-US", enUS);

function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const employer = useSelector((state) => state.auth.employer);
  const [application, setApplication] = useState(null);
  const [interviewDate, setInterviewDate] = useState(new Date());
  const [interviewMode, setInterviewMode] = useState("Online");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        if (!employer) {
          alert("You must be logged in as an employer to schedule an interview.");
          navigate("/employer-login");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/applications/details/${applicationId}`
        );

        if (res.data.jobId.employerId !== employer._id) {
          alert("You are not authorized to schedule an interview for this job.");
          navigate("/employer/dashboard");
          return;
        }

        setApplication(res.data);
      } catch (error) {
        console.error("Error fetching application details:", error);
        alert("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId, employer, navigate]);

  const handleConfirmSchedule = async () => {
    try {
      if (!employer || employer._id !== application.jobId.employerId) {
        alert("Authorization failed. You cannot schedule this interview.");
        navigate("/employer-login");
        return;
      }

      const interviewData = {
        interviewDate,
        interviewMode,
        interviewLocation,
        interviewLink,
        employerId: employer._id,
      };

      // 1. Schedule the interview (updates status and sends email automatically)
      await axios.put(
        `http://localhost:5000/api/applications/approve/${applicationId}`,
        interviewData
      );

      alert("Interview scheduled successfully! A confirmation email has been sent to the applicant.");
      navigate("/employer/dashboard"); // Redirect back to the dashboard
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert(
        "Failed to schedule interview. Please check the details and try again."
      );
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!application) {
    return <p>Could not load application data.</p>;
  }

  return (
    <div className="schedule-interview-container">
      <h1>Schedule Interview</h1>
      <div className="applicant-info">
        <p><strong>Applicant:</strong> {application.userId.name}</p>
        <p><strong>Applying for:</strong> {application.jobId.title}</p>
      </div>

      <div className="datepicker-section">
        <h2>Select Date and Time</h2>
        <DatePicker
          selected={interviewDate}
          onChange={(date) => setInterviewDate(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          inline
        />
      </div>

      <div className="interview-mode-section">
        <h2>Interview Mode</h2>
        <select value={interviewMode} onChange={(e) => setInterviewMode(e.target.value)}>
          <option value="Online">Online</option>
          <option value="F2F">F2F (Face-to-Face)</option>
        </select>
      </div>

      {interviewMode === "F2F" && (
        <div className="location-section">
          <h2>Interview Location</h2>
          <input
            type="text"
            value={interviewLocation}
            onChange={(e) => setInterviewLocation(e.target.value)}
            placeholder="Enter the full address of the interview location"
          />
        </div>
      )}

      {interviewMode === "Online" && (
        <div className="location-section">
          <h2>Interview Link</h2>
          <input
            type="text"
            value={interviewLink}
            onChange={(e) => setInterviewLink(e.target.value)}
            placeholder="Enter the Google Meet link for the interview"
          />
        </div>
      )}

      <div className="actions-section">
        <button onClick={handleConfirmSchedule} className="confirm-btn">
          Confirm Schedule
        </button>
        <button onClick={() => navigate(-1)} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ScheduleInterview;