import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./JobDetails.css";
import { useSelector } from "react-redux";
import SimilarJobs from "./SimilarJobs";

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
      <div className="job-details-container">
        <div className="job-details-main">
          <div className="job-header-details">
            <h1>{job.title}</h1>
            <p>
              {job.company} - {job.location}
            </p>
          </div>
          <div className="job-body-details">
            <h2>Job Description</h2>
            <p>{job.description}</p>
            <h2>Skills Required</h2>
            <ul className="skills-list">
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="job-details-sidebar">
          <div className="company-info-card">
            <h2>About Company</h2>
            <p>{job.aboutCompany || "No information provided."}</p>
            <button
              className="apply-btn-sidebar"
              onClick={() => handleApply(job._id)}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      <SimilarJobs currentJobId={job._id} skills={job.skills} />
    </div>
  );
}

export default JobDetails;