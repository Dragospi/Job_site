import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditJob.css"; // Using the new dedicated CSS
import { useSelector } from "react-redux";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employer = useSelector((state) => state.auth.employer);
  const [jobData, setJobData] = useState(null); // Start with null to indicate loading

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!employer) {
          alert("You must be logged in as an employer to edit a job.");
          navigate("/employer-login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);

        if (res.data.employerId !== employer._id) {
          alert("You are not authorized to edit this job.");
          navigate("/employer/dashboard");
          return;
        }

        const fetchedData = res.data;

        // Ensure skills is always an array
        const skills = Array.isArray(fetchedData.skills)
          ? fetchedData.skills
          : typeof fetchedData.skills === "string"
          ? fetchedData.skills.split(",").map((s) => s.trim())
          : [];

        const formattedDeadline = fetchedData.deadline
          ? new Date(fetchedData.deadline).toISOString().split("T")[0]
          : "";
        setJobData({ ...fetchedData, skills, deadline: formattedDeadline });
      } catch (error) {
        console.error("Error fetching job data:", error);
        alert("Failed to load job data.");
        navigate("/employer/dashboard");
      }
    };
    fetchJobData();
  }, [id, employer, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setJobData({
        ...jobData,
        skills: value.split(",").map((skill) => skill.trim()),
      });
    } else {
      setJobData({
        ...jobData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employer || employer._id !== jobData.employerId) {
      alert("Authorization failed. You cannot update this job.");
      navigate("/employer-login");
      return;
    }

    // Create a payload with a correctly formatted deadline
    const payload = {
      ...jobData,
      deadline: jobData.deadline ? new Date(jobData.deadline).toISOString() : null,
    };

    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, payload);
      alert("Job updated successfully!");
      navigate("/employer/dashboard");
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    }
  };

  if (!jobData) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="edit-job-container">
      <form className="edit-job-form" onSubmit={handleSubmit}>
        <h2>Edit Job Posting</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input
              type="text"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Type (e.g., Full-time, Part-time)</label>
            <input
              type="text"
              name="type"
              value={jobData.type}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Experience Level</label>
            <input
              type="text"
              name="experience"
              value={jobData.experience}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>Skills Required (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={jobData.skills.join(", ")}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>Job Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group full-width">
            <label>About Company</label>
            <textarea
              name="aboutCompany"
              value={jobData.aboutCompany}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={jobData.deadline}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={jobData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="IT">IT</option>
              <option value="MNCs">MNCs</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Update Job
        </button>
      </form>
    </div>
  );
}

export default EditJob;