const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Jobs");


// GET profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,   // 🔥 IMPORTANT FIX
      { new: true }
    );

    res.json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed"
    });
  }
});


// Save a job
router.post("/:userId/save-job", async (req, res) => {
  try {
    const { userId } = req.params;
    const { jobId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.json({ message: "Job saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving job" });
  }
});

// Unsave a job
router.post("/:userId/unsave-job", async (req, res) => {
  try {
    const { userId } = req.params;
    const { jobId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    res.json({ message: "Job unsaved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unsaving job" });
  }
});

// Get saved jobs
router.get("/:userId/saved-jobs", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("savedJobs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
});


module.exports = router;