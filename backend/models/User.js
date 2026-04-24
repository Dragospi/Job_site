const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "user"
  },

  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }],

  profilePic: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  mobile: {
    type: String,
    default: ""
  },

    bio: {
    type: String,
    default: ""
  },

  skills: {
    type: [String],
    default: []
  },

  resume: {
    type: String,
    default: ""
  },

  // 🔥 ADD THESE FOR EMPLOYER

  companyName: {
    type: String,
    default: ""
  },

  website: {
    type: String,
    default: ""
  },

  location: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  description: {
    type: String,
    default: ""
  },

  verified: {
    type: Boolean,
    default: false
  },

  isEmployer: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);