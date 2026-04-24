const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: String,
  type: String,
  experience: String,
  skills: [String],
  description: {
    type: String,
    required: true
  },
  aboutCompany: String,
  companyLogo: String,
  companyWebsite: String,
  deadline: String,
  category: String,
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postedByName: String,
  postedByEmail: String
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);