import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="back-button-container">
      <button onClick={() => navigate("/")} className="back-button">
        &larr; Back to Home
      </button>
    </div>
  );
};

export default BackButton;