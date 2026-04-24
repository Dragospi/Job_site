import React from "react";
import "./OfferBanner.css";

function OfferBanner() {
  return (
    <div className="offer-banner">
      <div>
        <h4>ELEVATE YOUR CAREER</h4>
        <h2>25% Off on Pro</h2>
      </div>

      <div className="offer-btn">
        <button>Claim your offer</button>
        <span className="offer-disclaimer">Limited time only!</span>
      </div>
    </div>
  );
}

export default OfferBanner;