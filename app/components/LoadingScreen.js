// components/LoadingScreen.js
import React from "react";
import "./LoadingScreen.css"; // Import the CSS for styling

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
      </div>
      <h2 className="loading-text">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
