const express = require("express");
const router = express.Router();
const Job = require("../models/Jobs");
const Application = require("../models/Application");
const jwt = require("jsonwebtoken");

// Middleware to check for employer/admin role
const isEmployer = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user id to request for later use
    req.user = { id: decoded.id, role: decoded.role }; 

    if (req.user.role === "employer" || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Employer or admin role required." });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// GET all jobs with applicant count (Employer Specific)
router.get("/employer-jobs-with-count/:employerId", async (req, res) => {
  try {
    const { employerId } = req.params;

    const jobs = await Job.find({ employerId }).sort({ createdAt: -1 }).lean();
    
    // For each job, count applications
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const count = await Application.countDocuments({ 
        jobId: { $in: [job._id, job._id.toString()] }
      });

      return {
        ...job,
        applicantCount: count
      };
    }));

    res.json(jobsWithCounts);

  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs with counts" });
  }
});

// GET all jobs with optional search filters
router.get("/", async (req, res) => {
  try {
    const { skills, location, experience } = req.query;
    const query = {};

    if (skills) {
      // Case-insensitive regex search for skills, designation, or company
      const searchRegex = new RegExp(skills, "i");
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: { $in: [searchRegex] } }, // Assumes skills is an array in the model
      ];
    }

    if (location) {
      query.location = new RegExp(location, "i");
    }

    // Note: Experience filtering can be complex. This is a basic implementation.
    // For a "1-3" years string, you might need more advanced logic
    // if your Job model stores experience as a number.
    if (experience) {
      query.experience = new RegExp(experience, "i"); // Simple text match for now
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// POST new job
router.post("/", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: "Error posting job" });
  }
});

// Get jobs by employer
router.get("/employer/:id", async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

// UPDATE a job - PROTECTED
router.put("/:id", isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user owns the job or is an admin
    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "User not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
});

// DELETE a job - PROTECTED
router.delete("/:id", isEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user owns the job or is an admin
    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "User not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
});

// Get similar jobs
router.get("/:id/similar", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      skills: { $in: job.skills },
    }).limit(3);

    res.json(similarJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching similar jobs" });
  }
});

module.exports = router;