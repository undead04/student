import React from "react";

const LoadingReact = () => {
  return (
    <>
      <div className="h-75 d-flex align-items-center justify-content-center">
        <div
          className="spinner-border"
          role="status"
          style={{ width: 50, height: 50 }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};
export default LoadingReact;
