import React, { useState } from "react";
import "./EditProfile.css"; // Reusing the same CSS for consistency
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateProfile } from "../redux/authSlice";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function EmpEditProfile() {
  const employer = useSelector((state) => state.auth.employer);
  const dispatch = useDispatch();

  const [name, setName] = useState(employer?.name || "");
  const [email, setEmail] = useState(employer?.email || "");
  const [profilePicUrl, setProfilePicUrl] = useState(employer?.profilePic || "");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [companyName, setCompanyName] = useState(employer?.companyName || "");
  const [website, setWebsite] = useState(employer?.website || "");
  const [location, setLocation] = useState(employer?.location || "");
  const [phone, setPhone] = useState(employer?.phone || "");
  const [description, setDescription] = useState(employer?.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalProfilePicUrl = profilePicUrl;

    if (profileImageFile) {
      const formData = new FormData();
      formData.append("image", profileImageFile);

      try {
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
        `http://localhost:5000/api/auth/update/${employer._id}`,
        {
          name,
          email,
          profilePic: finalProfilePicUrl,
          companyName,
          website,
          location,
          phone,
          description,
        }
      );

      dispatch(updateProfile({ employer: res.data.user }));
      localStorage.setItem("employerUser", JSON.stringify(res.data.user));

      alert("Profile Updated Successfully ✅");

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Profile update failed ❌");
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Update Company Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Contact Person Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter contact person's name"
            required
          />

          <label>Company Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter company email"
            required
          />

          <label>Company Logo</label>
          <div className="profile-pic-uploader">
            <img src={profilePicUrl || "https://i.pravatar.cc/150"} alt="Logo Preview" className="profile-pic-preview" />
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
          </div>

          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter the company name"
          />

          <label>Company Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://your-company.com"
          />

          <label>Headquarters Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />

          <label>Contact Phone</label>
          <PhoneInput
            placeholder="Enter phone number"
            value={phone}
            onChange={setPhone}
            international
            defaultCountry="IN"
          />

          <label>Company Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your company..."
          ></textarea>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EmpEditProfile;