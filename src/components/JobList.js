import React from "react";
import JobCard from "./JobCard";
import "./JobList.css";

const JobList = ({ jobs = [] }) => {
  if (jobs.length === 0) {
    return <p className="no-jobs-found">No jobs found matching your criteria. Try broadening your search!</p>;
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;