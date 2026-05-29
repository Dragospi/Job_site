import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaClock } from "react-icons/fa";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/job/${job._id}`);
  };

  // Truncate description for the card view
  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      <div className="job-card-main">
        <div className="job-card-header">
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-company">{job.company}</p>
        </div>
        <p className="job-card-description">
          {truncateDescription(job.description)}
        </p>
      </div>
      <div className="job-card-footer">
        <div className="job-card-info">
          <div className="info-item">
            <FaMapMarkerAlt />
            <span>{job.location}</span>
          </div>
          <div className="info-item">
            <FaMoneyBillWave />
            <span>{job.salary}</span>
          </div>
          <div className="info-item">
            <FaBriefcase />
            <span>{job.type || "Full-time"}</span>
          </div>
        </div>
        <div className="job-card-posted-date">
          <FaClock />
          <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;