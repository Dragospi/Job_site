const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Employer Register
router.post("/register", async (req, res) => {
  const { name, companyName, email, password, secretCode } = req.body;

  try {
    // Verify secret code
    if (secretCode !== process.env.EMPLOYER_SECRET) {
      return res.status(401).json({ message: "Invalid access code" });
    }

    const existingEmployer = await User.findOne({ email });

    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const newEmployer = new User({
      name,
      companyName,
      email,
      password,
      role: "employer",
    });

    await newEmployer.save();

    res.status(201).json({ message: "Employer registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Employer Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await User.findOne({ email, role: "employer" });

    if (!employer) {
      return res.status(400).json({ message: "Employer not found" });
    }

    if (employer.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      user: employer
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET Employer Profile
router.get("/:id", async (req, res) => {
  try {
    const employer = await User.findOne({ _id: req.params.id, role: "employer" });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json({ user: employer });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employer profile" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedEmployer = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.json({ user: updatedEmployer });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;