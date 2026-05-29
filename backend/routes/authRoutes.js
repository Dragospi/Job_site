const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password,
      role: "user", // Only allow 'user' role
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials or not a user account" });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =================================================================
//                     EMPLOYER AUTH ROUTES
// =================================================================

// EMPLOYER REGISTER
router.post("/employer-register", async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployer = new User({
      name,
      email,
      password: hashedPassword,
      companyName,
      role: "employer", // Set role to employer
      isEmployer: true, // Set isEmployer to true
    });

    await newEmployer.save();
    res.json({ message: "Employer registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// EMPLOYER LOGIN
router.post("/employer-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employer = await User.findOne({
      email,
      password,
      role: { $in: ["employer", "admin"] }, // Allow employer or admin
    });

    if (!employer) {
      return res.status(400).json({ message: "Invalid credentials or not an employer/admin account" });
    }

    res.json({
      message: "Employer login successful",
      user: {
        _id: employer._id,
        name: employer.name,
        email: employer.email,
        role: employer.role,
        companyName: employer.companyName,
        profilePic: employer.profilePic
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE PROFILE
router.put("/update/:id", async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    console.log("User ID:", req.params.id);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    console.log("Updated User:", updatedUser);

    res.json({ message: "Profile updated", user: updatedUser });

  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;