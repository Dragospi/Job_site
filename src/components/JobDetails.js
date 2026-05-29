import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./JobDetails.css";
import { useSelector } from "react-redux";
import SimilarJobs from "./SimilarJobs";
import { FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaClock } from "react-icons/fa";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleApply = async (jobId) => {
    if (!user) {
      alert("Please login first ❌");
      navigate("/login");
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
      navigate("/applied-jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Apply failed ❌");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) {
    return (
      <div className="loading-container">
        <p className="loading">Loading Job Details...</p>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-main">
        <div className="job-details-content">
          <div className="job-header">
            <h1>{job.title}</h1>
            <p className="company">{job.company}</p>
            <div className="job-info-grid">
              <div className="info-item">
                <FaMapMarkerAlt />
                <span className="value">{job.location}</span>
              </div>
              <div className="info-item">
                <FaMoneyBillWave />
                <span className="value">{job.salary}</span>
              </div>
              <div className="info-item">
                <FaBriefcase />
                <span className="value">{job.type || "Full-time"}</span>
              </div>
              <div className="info-item">
                <FaClock />
                <span className="value">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="job-section">
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="job-section">
            <h3>Skills Required</h3>
            <div className="skills-container">
              {(job.skills || []).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="job-details-sidebar">
          <div className="sidebar-card">
            <button
              className="apply-btn"
              onClick={() => handleApply(job._id)}
            >
              Apply Now
            </button>
            {/* Placeholder for save job button */}
            <button className="save-btn">Save Job</button>
          </div>
          <div className="sidebar-card">
            <h3>About {job.company}</h3>
            <p>{job.aboutCompany || "No information provided about the company."}</p>
          </div>
        </div>
      </div>
      {job.skills && job.skills.length > 0 && (
        <SimilarJobs currentJobId={job._id} skills={job.skills} />
      )}
    </div>
  );
}

export default JobDetails;