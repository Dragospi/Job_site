import React, { useState } from "react";
import "./EditProfile.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateProfile } from "../redux/authSlice";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


function EditProfile() {

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePic || "");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [address, setAddress] = useState(user?.address || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [resume, setResume] = useState(user?.resume || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalProfilePicUrl = profilePicUrl;

    if (profileImageFile) {
      const formData = new FormData();
      formData.append("image", profileImageFile);

      try {
        // This endpoint should handle the file upload and return the new URL
        const res = await axios.post("http://localhost:5000/api/upload", formData);
        finalProfilePicUrl = res.data.imageUrl;
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/update/${user._id}`,
        {
          name,
          email,
          profilePic: finalProfilePicUrl,
          address,
          mobile,
          bio,
          skills: skills.split(",").map(s => s.trim()),
          resume
        }
      );

      dispatch(updateProfile(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile Updated Successfully ✅");

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Profile update failed ❌");
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Update Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />

          <label>Profile Picture</label>
          <div className="profile-pic-uploader">
            <img src={profilePicUrl || "https://i.pravatar.cc/150"} alt="Profile Preview" className="profile-pic-preview" />
            <div className="upload-options">
              <label htmlFor="profile-pic-input" className="btn-style-file-input">
                Choose Image
              </label>
              <input
                id="profile-pic-input"
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProfileImageFile(file);
                    setProfilePicUrl(URL.createObjectURL(file));
                  }
                }}
                style={{ display: 'none' }}
              />
              <span className="or-divider">OR</span>
              <input
                type="text"
                className="url-input"
                placeholder="Paste Image URL"
                value={profilePicUrl.startsWith('blob:') ? '' : profilePicUrl}
                onChange={(e) => {
                  setProfilePicUrl(e.target.value);
                  setProfileImageFile(null); // Clear file if URL is used
                }}
              />
            </div>
          </div>

          <label>Current Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="City, Country"
          />

          <label>Mobile Number</label>
          <PhoneInput
            placeholder="Enter phone number"
            value={mobile}
            onChange={setMobile}
            international
            defaultCountry="IN"
          />

          <label>Professional Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short summary about your professional background..."
          ></textarea>

          <label>Skills (comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Node.js, Python, etc."
          />

          <label>Resume URL</label>
          <input
            type="text"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Google Drive / PDF link"
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;