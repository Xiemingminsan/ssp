// components/Loading.js
import React from "react";
import { ClipLoader } from "react-spinners"; // Example using react-spinners

const Loading = () => {
  return (
    <div className="loading-container">
      <ClipLoader color="#000" loading={true} size={50} />
    </div>
  );
};

export default Loading;
