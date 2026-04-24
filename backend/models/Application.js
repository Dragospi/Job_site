const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  status: {
    type: String,
    enum: ["Applied", "Interview Scheduled", "Rejected"],
    default: "Applied"
  },
  interviewDate: {
    type: Date
  },
  interviewMode: {
    type: String,
    enum: ["F2F", "Online"],
  },
  interviewLocation: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", applicationSchema);