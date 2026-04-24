import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, jobSeekers: 0, employers: 0 });
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState(null); // For modal
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Protect the route
  useEffect(() => {
    if (!user || user.role !== "admin") {
      // Silently redirect non-admins to the home page
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and employers in parallel
        const [statsRes, employersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats"),
          axios.get("http://localhost:5000/api/admin/employers")
        ]);
        setStats(statsRes.data);
        setEmployers(employersRes.data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        alert("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handleVerify = async (employerId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/verify-employer/${employerId}`);
      alert("Employer verified successfully!");
      // Update the local state to reflect the change
      setEmployers(employers.map(emp => 
        emp._id === employerId ? { ...emp, verified: true } : emp
      ));
    } catch (error) {
      console.error("Failed to verify employer:", error);
      alert("Failed to verify employer.");
    }
  };

  const handleDelete = async (employerId) => {
    // Confirmation dialog
    if (window.confirm("Are you sure you want to delete this employer? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/employer/${employerId}`);
        alert("Employer deleted successfully!");
        // Remove the employer from the local state
        setEmployers(employers.filter(emp => emp._id !== employerId));
      } catch (error) {
        console.error("Failed to delete employer:", error);
        alert("Failed to delete employer.");
      }
    }
  };

  const openDetailsModal = (employer) => {
    setSelectedEmployer(employer);
  };

  const closeDetailsModal = () => {
    setSelectedEmployer(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="platform-overview">
        <h3>Platform Overview</h3>
        <div className="stats-cards">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h4>Job Seekers</h4>
            <p>{stats.jobSeekers}</p>
          </div>
          <div className="stat-card">
            <h4>Employers</h4>
            <p>{stats.employers}</p>
          </div>
        </div>
      </div>

      <div className="manage-employers">
        <h3>Manage Employers</h3>
        <p>Verify and manage employer accounts.</p>
        <div className="employer-list">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Status</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employers.map((employer) => (
                <tr key={employer._id}>
                  <td>{employer.companyName || "N/A"}</td>
                  <td>{employer.name}</td>
                  <td>{employer.email}</td>
                  <td>
                    <span className={`status ${employer.verified ? "verified" : "not-verified"}`}>
                      {employer.verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => openDetailsModal(employer)} className="details-btn">
                      View Details
                    </button>
                  </td>
                  <td>
                    {!employer.verified && (
                      <button 
                        className="verify-btn"
                        onClick={() => handleVerify(employer._id)}
                      >
                        Verify
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(employer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEmployer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeDetailsModal}>✖</button>
            <h3>Employer Details</h3>
            <div className="modal-body">
              <p><strong>Company Name:</strong> {selectedEmployer.companyName || "N/A"}</p>
              <p><strong>Contact Person:</strong> {selectedEmployer.name}</p>
              <p><strong>Email:</strong> {selectedEmployer.email}</p>
              <p><strong>Website:</strong> {selectedEmployer.website || "N/A"}</p>
              <p><strong>Location:</strong> {selectedEmployer.location || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedEmployer.phone || "N/A"}</p>
              <p><strong>Description:</strong> {selectedEmployer.description || "No description provided."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;