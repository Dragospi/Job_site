import React, { useEffect, useState } from "react";
import "./EmpViewProfile.css";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EmpViewProfile() {
  const { id } = useParams(); // Get employer ID from URL
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);
  const employer = useSelector((state) => state.auth.employer);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine if the viewer is the owner of the profile or an admin
  const isOwner = employer && employer._id === id;
  const isAdmin = loggedInUser && loggedInUser.role === 'admin';

  const calculateProfileCompleteness = (profile) => {
    if (!profile) return 0;
    let score = 0;
    const totalPoints = 5; // Fields to check: companyName, website, location, phone, description

    if (profile.companyName && profile.companyName !== "") score++;
    if (profile.website && profile.website !== "") score++;
    if (profile.location && profile.location !== "") score++;
    if (profile.phone && profile.phone !== "") score++;
    if (profile.description && profile.description !== "") score++;

    return Math.round((score / totalPoints) * 100);
  };

  const completeness = calculateProfileCompleteness(profileData);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If there's an ID in the URL, fetch that employer's profile
        // This is for the admin view or direct link
        if (id) {
          const res = await axios.get(`http://localhost:5000/api/employer/${id}`);
          setProfileData(res.data.user);
        } 
        // Otherwise, show the logged-in employer's profile
        else if (employer) {
          setProfileData(employer);
        }
      } catch (error) {
        console.error("Error fetching employer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, employer]);

  if (loading) {
    return (
      <div className="emp-profile-wrapper">
        <h2 style={{ textAlign: "center" }}>Loading profile...</h2>
      </div>
    );
  }

  if (!profileData) {
    return <h2 style={{ textAlign: "center" }}>Profile not found or you do not have permission.</h2>;
  }

  return (
    <div className="emp-profile-wrapper">

      {/* Show navbar only if the viewer is the owner and not an admin */}
      {isOwner && !isAdmin && (
        <div className="emp-profile-nav">
          <span onClick={() => navigate("/employer/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/employer/jobs")}>Jobs</span>
          <span onClick={() => navigate("/employer/applicants")}>Applicants</span>
        </div>
      )}

      <div className="emp-profile-card">
        <div className="emp-profile-main">
          {/* HEADER */}
          <div className="emp-profile-header">
            <img
              src={profileData.profilePic || "https://i.pravatar.cc/120"}
              alt="profile"
              className="emp-profile-img"
            />

            <h2>{profileData.name}</h2>
            <p className="emp-email">{profileData.email}</p>
          </div>

          {/* COMPANY DETAILS */}
          <div className="emp-section">

            <h3>Company Details</h3>

            <p><strong>🏢 Company Name:</strong> {profileData.companyName || "N/A"}</p>
            <p><strong>🌐 Website:</strong> {profileData.website || "N/A"}</p>
            <p><strong>📍 Location:</strong> {profileData.location || "N/A"}</p>
            <p><strong>📞 Phone:</strong> {profileData.phone || "N/A"}</p>

          </div>
        </div>
        <div className="emp-profile-sidebar">
          <div className="completeness-meter-wrapper">
            <label>Profile Completeness: {completeness}%</label>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${completeness}%` }}></div>
            </div>
          </div>
          {/* DESCRIPTION */}
          <div className="emp-section">

            <h3>Description</h3>
            <p className="emp-desc">
              {profileData.description || "No description added"}
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}

export default EmpViewProfile;