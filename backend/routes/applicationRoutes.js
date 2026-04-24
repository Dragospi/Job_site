const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Jobs");
const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
require("dotenv").config();
require("dotenv").config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= APPLY JOB ================= */

router.post("/apply", async (req, res) => {
  const { userId, jobId, employerId } = req.body;

  try {
    // 🔥 Check already applied
    const existing = await Application.findOne({ userId, jobId });

    if (existing) {
      return res.status(400).json({
        message: "Already applied for this job ❌",
      });
    }

    // ✅ Save new application
    const newApplication = new Application({
      userId,
      jobId,
      employerId,
    });

    await newApplication.save();

    res.json({
      message: "Application submitted successfully ✅",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error applying ❌",
    });
  }
});


/* ================= GET APPLICANTS FOR A JOB ================= */

router.get("/job/:jobId", async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId
    }).populate("userId", "name email profilePic address")
      .populate("jobId", "title company location");

    res.json(applications);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching applicants ❌"
    });
  }
});

/* ================= GET SINGLE APPLICATION DETAILS ================= */

router.get("/details/:applicationId", async (req, res) => {
  const { applicationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  try {
    const application = await Application.findById(applicationId)
      .populate("userId", "name email resume skills")
      .populate({
        path: "jobId",
        select: "title company employerId",
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ message: "Error fetching application details ❌" });
  }
});


/* ================= APPROVE APPLICATION (SCHEDULE INTERVIEW) ================= */

router.put("/approve/:applicationId", async (req, res) => {
  const { applicationId } = req.params;
  const { interviewDate, interviewMode, interviewLocation, employerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  if (!interviewDate) {
    return res.status(400).json({ message: "Interview date is required" });
  }

  try {
    // 1. Find the application and populate the job details
    const application = await Application.findById(applicationId).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 2. Verify that the employer owns the job
    if (application.jobId.employerId.toString() !== employerId) {
      return res.status(403).json({ message: "You are not authorized to schedule this interview." });
    }

    // 3. Update the application with the interview details
    application.status = "Interview Scheduled";
    application.interviewDate = interviewDate;
    application.interviewMode = interviewMode;
    application.interviewLocation = interviewLocation;
    application.interviewLink = interviewLink;

    await application.save();

    // Create a notification for the user
    const notification = new Notification({
      userId: application.userId,
      message: `Your interview for ${application.jobId.title} has been scheduled.`,
    });
    await notification.save();

    // Automatically send a professional confirmation email
    const formattedDate = new Date(interviewDate).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.userId.email,
      subject: `Interview Scheduled for ${application.jobId.title} at ${application.jobId.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${application.userId.name},</p>
          <p>Congratulations! We would like to invite you for an interview for the <strong>${application.jobId.title}</strong> position at <strong>${application.jobId.company}</strong>.</p>
          <p>Your interview has been scheduled for:</p>
          <ul>
            <li><strong>Date & Time:</strong> ${formattedDate}</li>
            <li><strong>Mode:</strong> ${interviewMode}</li>
            ${interviewMode === "Online" && interviewLink ? `<li><strong>Meeting Link:</strong> <a href="${interviewLink}">${interviewLink}</a></li>` : ""}
            ${interviewMode !== "Online" && interviewLocation ? `<li><strong>Location:</strong> ${interviewLocation}</li>` : ""}
          </ul>
          <p>Please let us know if you have any questions. We look forward to speaking with you.</p>
          <p>Best regards,</p>
          <p>The Hiring Team at ${application.jobId.company}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Interview scheduled successfully!",
      application,
    });

  } catch (dbError) {
    console.error("Database error while scheduling interview:", dbError);
    return res.status(500).json({
      message: "Error scheduling interview ❌",
    });
  }
});

/* ================= REJECT APPLICATION ================= */

router.put("/reject/:applicationId", async (req, res) => {
  const { applicationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: "Rejected" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application rejected",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error rejecting application ❌",
    });
  }
});

/* ================= GET ALL APPLICANTS FOR AN EMPLOYER ================= */

router.get("/employer/:employerId", async (req, res) => {
  try {
    const { employerId } = req.params;

    // 1. Get all job IDs for this employer
    const jobs = await Job.find({ employerId: employerId });
    const jobIds = jobs.map(job => job._id);

    // 2. Find all applications for those jobs
    // We allow jobId to be either ObjectId or string for old data
    const applications = await Application.find({
      jobId: { $in: jobIds }
    }).populate("userId", "name email profilePic")
      .populate("jobId", "title company location");

    // If some applications were saved with string jobId, try to find them too
    const stringJobIds = jobIds.map(id => id.toString());
    const applications2 = await Application.find({
      jobId: { $in: stringJobIds }
    }).populate("userId", "name email profilePic address")
      .populate("jobId", "title company location");

    // Merge and remove duplicates
    const allApplications = [...applications];
    applications2.forEach(app2 => {
      if (!allApplications.find(app1 => app1._id.toString() === app2._id.toString())) {
        allApplications.push(app2);
      }
    });

    res.json(allApplications);

  } catch (error) {
    console.error("Error in /employer/:employerId:", error);
    res.status(500).json({
      message: "Error fetching employer applicants ❌"
    });
  }
});


/* ================= GET USER APPLIED JOBS ================= */

router.get("/user/:userId", async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.params.userId
    }).populate("jobId");

    res.json(applications);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching applied jobs ❌"
    });
  }
});

/* ================= SEND CUSTOM EMAIL ================= */

router.post("/send-custom-email/:applicationId", async (req, res) => {
  const { applicationId } = req.params;
  const { subject, message, employerId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  try {
    // 1. Find the application and populate necessary details
    const application = await Application.findById(applicationId)
      .populate("userId", "name email")
      .populate("jobId", "employerId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 2. Security Check: Ensure the logged-in employer owns the job
    if (application.jobId.employerId.toString() !== employerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to email this applicant." });
    }

    // 3. Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.userId.email,
      subject: subject,
      text: message,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending custom email:", error);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
});

// @route   POST /api/applications/send-follow-up/:applicationId
// @desc    Send a pre-defined follow-up email to an applicant
// @access  Private (Employer)
router.post("/send-follow-up/:applicationId", async (req, res) => {
  const { applicationId } = req.params;
  const { employerId } = req.body; // Sent from frontend for authorization

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  try {
    // 1. Find application and populate necessary details
    const application = await Application.findById(applicationId)
      .populate("userId", "name email")
      .populate("jobId", "title company employerId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 2. Security Check: Ensure the logged-in employer owns the job
    if (application.jobId.employerId.toString() !== employerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to email this applicant." });
    }

    // 3. Email options with a pre-defined template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.userId.email,
      subject: `Following up on your application for ${application.jobId.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${application.userId.name},</p>
          <p>This is a follow-up regarding your application for the <strong>${application.jobId.title}</strong> position at <strong>${application.jobId.company}</strong>.</p>
          <p>We are currently reviewing applications and will update you on the status of your application soon.</p>
          <p>Thank you for your continued interest.</p>
          <p>Best regards,</p>
          <p>The Hiring Team at ${application.jobId.company}</p>
        </div>
      `,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Follow-up email sent successfully!" });
  } catch (error) {
    console.error("Error sending follow-up email:", error);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
});

module.exports = router;