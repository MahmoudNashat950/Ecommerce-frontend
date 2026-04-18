import React from "react";

function AlertMessage({ type = "info", children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export default AlertMessage;
