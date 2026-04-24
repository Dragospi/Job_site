import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';
import { FaTachometerAlt, FaUsers, FaBuilding, FaBriefcase, FaChartBar, FaFileAlt, FaDollarSign } from 'react-icons/fa';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">GAIN</div>
          <div className="admin-panel-text">Admin Panel</div>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="admin-nav-link">
            <FaTachometerAlt /><span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" className="admin-nav-link">
            <FaUsers /><span>Users Management</span>
          </NavLink>
          <NavLink to="/admin/companies" className="admin-nav-link">
            <FaBuilding /><span>Companies Management</span>
          </NavLink>
          <NavLink to="/admin/jobs" className="admin-nav-link">
            <FaBriefcase /><span>Jobs Management</span>
          </NavLink>
          <NavLink to="/admin/analytics" className="admin-nav-link">
            <FaChartBar /><span>Platform Analytics</span>
          </NavLink>
          <NavLink to="/admin/logs" className="admin-nav-link">
            <FaFileAlt /><span>Audit Logs</span>
          </NavLink>
          <NavLink to="/admin/finance" className="admin-nav-link">
            <FaDollarSign /><span>Finance</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">N</div>
            <div className="admin-details">
              <div className="admin-name">nirmal r</div>
              <div className="admin-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;