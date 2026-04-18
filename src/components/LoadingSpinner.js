import React from "react";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-3">
      <div className="spinner-border text-primary me-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div>{message}</div>
    </div>
  );
}

export default LoadingSpinner;
