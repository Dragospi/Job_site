import React, { useState } from "react";
import "./PostAJob.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function PostAJob() {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    experience: "",
    skills: "",
    description: "",
    aboutCompany: "",
    companyLogo: "",
    companyWebsite: "",
    deadline: "",
    category: "",
  });

  const employer = useSelector((state) => state.auth.employer);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employer || !employer._id) {
      alert("Please login as an employer to post a job ❌");
      navigate("/employer-login");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/jobs", {
        ...jobData,
        employerId: employer._id, // ✅ attach employer
        postedByName: employer.name,
        postedByEmail: employer.email,
        company: jobData.company || employer.companyName, // Use employer's company name if not provided
      });

      alert("Job Posted Successfully!");

      // 🔥 Clear form after submit
      setJobData({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "",
        experience: "",
        skills: "",
        description: "",
        aboutCompany: "",
        companyLogo: "",
        companyWebsite: "",
        deadline: "",
        category: "",
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error posting job";
      alert(errorMessage);
    }
  };

  return (
    <div className="postjob-page">


      <h2>Post a Job</h2>

      <form className="postjob-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Job Title</label>
          <input type="text" name="title" value={jobData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company"
            value={jobData.company}
            onChange={handleChange}
            placeholder={employer?.companyName || "Your Company Name"}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={jobData.location} onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input type="text" name="salary" value={jobData.salary} onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label>Job Type</label>
          <select name="type" value={jobData.type} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={jobData.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="IT">IT</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Remote">Remote</option>
            <option value="MNC">MNC</option>
            <option value="Startup">Startup</option>
            <option value="Fresher">Fresher</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="form-group">
          <label>Experience Required</label>
          <input type="text" name="experience" value={jobData.experience} onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label>Skills Required</label>
          <input type="text" name="skills" value={jobData.skills} onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea name="description" rows="4" value={jobData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>About Company</label>
          <textarea name="aboutCompany" rows="4" value={jobData.aboutCompany} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Company Logo URL</label>
          <input
            type="text"
            name="companyLogo"
            value={jobData.companyLogo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="form-group">
          <label>Company Website</label>
          <input
            type="text"
            name="companyWebsite"
            value={jobData.companyWebsite}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label>Application Deadline</label>
          <input type="date" name="deadline" value={jobData.deadline} onChange={handleChange}/>
        </div>

        <button type="submit" className="post-btn">Post Job</button>

      </form>

    </div>
  
  );
}

export default PostAJob;