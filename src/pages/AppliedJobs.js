import { useEffect, useState } from "react";
import "./AppliedJobs.css";
import axios from "axios";
import { useSelector } from "react-redux";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/applications/user/${user._id}`
        );
        setApplications(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="applied-container">
      <h2>My Applied Jobs</h2>
      {applications.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>
          You haven't applied to any jobs yet.
        </p>
      ) : (
        <div className="applied-list">
          {applications.map((app) => (
            <div key={app._id} className="applied-card">
              <div className="applied-info">
                <p className="applied-company">
                  🏢 {app.jobId?.company || "Company"}
                </p>
                <h3>{app.jobId?.title || "Job Title"}</h3>
                <div className="applied-details">
                  <span>📍 {app.jobId?.location || "Location"}</span>
                  <span>💰 {app.jobId?.salary || "Salary"}</span>
                </div>
                <span className="applied-date">
                  Applied on: {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div
                className={`status-badge ${
                  app.status === "Interview Scheduled"
                    ? "interview"
                    : app.status === "Rejected"
                    ? "rejected"
                    : "applied"
                }`}
              >
                {app.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppliedJobs;