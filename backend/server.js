const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Routes
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const employerRoutes = require("./routes/employerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route Middleware
app.use("/api/auth", authRoutes);          // 👤 User auth
app.use("/api/applications", applicationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ================= IMAGE UPLOAD ROUTE =================
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Upload image to Cloudinary from buffer
    cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
      if (error) {
        console.error("Cloudinary Error:", error);
        return res.status(500).json({ message: "Image upload failed" });
      }
      res.status(200).json({ imageUrl: result.secure_url });
    }).end(req.file.buffer);

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error during image upload" });
  }
});

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});