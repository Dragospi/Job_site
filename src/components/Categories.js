import React from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const categories = [
  "Remote",
  "MNC",
  "Analytics",
  "Banking & Finance",
  "Fresher",
  "Engineering",
  "Startup",
  "Internship",
  "Marketing"
];

function Categories() {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/jobs/${category}`);
  };

  return (
    <div className="categories">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="category-card"
          onClick={() => handleClick(cat)}
        >
          {cat} →
        </div>
      ))}
    </div>
  );
}

export default Categories;