import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SimilarJobs.css";

function SimilarJobs({ currentJobId, skills }) {
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      if (skills && skills.length > 0) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/jobs/${currentJobId}/similar`,
            {
              params: {
                skills: skills.join(","),
              },
            }
          );
          setSimilarJobs(res.data);
        } catch (error) {
          console.error("Error fetching similar jobs:", error);
        }
      }
    };
    fetchSimilarJobs();
  }, [currentJobId, skills]);

  if (similarJobs.length === 0) {
    return null;
  }

  return (
    <div className="similar-jobs-container">
      <h2>Similar Jobs</h2>
      <div className="similar-jobs-list">
        {similarJobs.map((job) => (
          <div key={job._id} className="similar-job-card">
            <Link to={`/jobs/${job._id}`} onClick={() => window.scrollTo(0, 0)}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarJobs;