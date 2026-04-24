import React, { useEffect, useState } from "react";
import "./ViewProfile.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/authSlice";
import { Link } from "react-router-dom";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function ViewProfile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const calculateProfileCompleteness = (user) => {
    if (!user) return 0;
    let score = 0;
    const totalPoints = 6; // Fields to check: profilePic, address, mobile, bio, skills, resume

    if (user.profilePic && user.profilePic !== "") score++;
    if (user.address && user.address !== "") score++;
    if (user.mobile && user.mobile !== "") score++;
    if (user.bio && user.bio !== "") score++;
    if (user.skills && user.skills.length > 0) score++;
    if (user.resume && user.resume !== "") score++;

    return Math.round((score / totalPoints) * 100);
  };

  const completeness = calculateProfileCompleteness(user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        try {
          // Fetch the latest user data from the backend to ensure it's up to date
          const res = await axios.get(`http://localhost:5000/api/user/${parsedUser._id}`);
          dispatch(login(res.data.user));
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If fetch fails, still use stored user data
          dispatch(login(parsedUser));
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Please login to view profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-header">
            <img
              src={user.profilePic || "https://i.pravatar.cc/150"}
              alt="profile"
              className="profile-image"
            />
            <h2>{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="profile-info-grid">
            <div className="info-item">
              <label>Mobile Number</label>
              <PhoneInput
                value={user.mobile}
                disabled
                displayInitialValueAsLocalNumber
              />
            </div>

            <div className="info-item">
              <label>Address</label>
              <p>{user.address || "Not provided"}</p>
            </div>

            <div className="info-item profile-bio">
              <label>Professional Bio</label>
              <p>{user.bio || "No bio added yet. Tell employers about yourself!"}</p>
            </div>
          </div>
        </div>
        <div className="profile-sidebar">
          <div className="completeness-meter-wrapper">
            <label>Profile Completeness: {completeness}%</label>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${completeness}%` }}></div>
            </div>
          </div>

          <div className="info-item skills-list">
            <label>Skills & Expertise</label>
            <div className="skills-list">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>No skills added yet</p>
              )}
            </div>
          </div>

          <div className="info-item profile-resume">
            <label>Resume / CV</label>
            {user.resume ? (
              <a 
                href={user.resume} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resume-link"
              >
                📄 View Resume
              </a>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>No resume uploaded</p>
            )}
          </div>
          <Link to="/edit-profile" className="edit-profile-btn">
            Edit Profile Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;