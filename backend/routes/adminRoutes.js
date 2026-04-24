const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming employers are users
const Job = require("../models/Jobs");
const Application = require("../models/Application");
const { protect, isAdmin } = require("../middleware/auth");

// GET /api/admin/stats - Get platform statistics (Protected, Admin only)
router.get("/stats", protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ role: "job_seeker" });
    const employers = await User.countDocuments({ role: "employer" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      jobSeekers,
      employers,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/employers - Get all employers (Protected, Admin only)
router.get("/employers", protect, isAdmin, async (req, res) => {
  try {
    const employers = await User.find({ role: "employer" }).select(
      "-password"
    );
    res.json(employers);
  } catch (error) {
    console.error("Error fetching employers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/employers/:id/verify - Verify an employer (Protected, Admin only)
router.put("/employers/:id/verify", protect, isAdmin, async (req, res) => {
  try {
    const employer = await User.findById(req.params.id);

    if (employer && employer.role === "employer") {
      employer.isVerified = true;
      await employer.save();
      res.json({ message: "Employer verified successfully" });
    } else {
      res.status(404).json({ message: "Employer not found" });
    }
  } catch (error) {
    console.error("Error verifying employer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/employers/:id - Delete an employer (Protected, Admin only)
router.delete("/employers/:id", protect, isAdmin, async (req, res) => {
  try {
    const employer = await User.findById(req.params.id);

    if (employer && employer.role === "employer") {
      await employer.deleteOne(); // Use deleteOne() for Mongoose v6+
      res.json({ message: "Employer removed" });
    } else {
      res.status(404).json({ message: "Employer not found" });
    }
  } catch (error) {
    console.error("Error deleting employer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;