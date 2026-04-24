import React from "react";
import "./Companies.css";

function Companies() {
  return (
    <div className="companies">
      <h2>Top companies hiring now</h2>

      <div className="company-cards">
        <div className="company-card">
          <h3>MNCs</h3>
          <p>2.2K+ are actively hiring</p>
        </div>
        <div className="company-card">
          <h3>Internet</h3>
          <p>249 are actively hiring</p>
        </div>
        <div className="company-card">
          <h3>Healthcare</h3>
          <p>7k+ are actively hiring</p>
        </div>
        <div className="company-card">
          <h3>Manufacturing</h3>
          <p>1.1k+ are actively hiring</p>
        </div>
        <div className="company-card">
          <h3>Products</h3>
          <p>1.3k are actively hiring</p>
        </div>
        <div className="company-card">
          <h3>IT Companies</h3>
          <p>10k+ are actively hiring</p>
        </div>
      </div>
    </div>
  );
}

export default Companies;