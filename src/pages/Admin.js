import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleViewApplicants = (jobId) => {
    setSelectedJob(jobId);

    axios.get(`http://localhost:5000/api/applications/job/${jobId}`)
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Portal</h2>

      <h3>All Jobs</h3>

      {jobs.map((job) => (
        <div key={job._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{job.title}</h4>
          <p>{job.company}</p>
          <button onClick={() => handleViewApplicants(job._id)}>
            View Applicants
          </button>
        </div>
      ))}

      {selectedJob && (
        <>
          <h3>Applicants</h3>

          {applications.length === 0 ? (
            <p>No applicants for this job</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} style={{ border: "1px solid green", margin: "10px", padding: "10px" }}>
                <p><strong>Name:</strong> {app.name}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Resume:</strong> {app.resume}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Admin;


