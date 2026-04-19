import React from "react";

const EmptyState = ({ message = "No cats found." }) => (
  <div
    className="flex items-center justify-center p-8 text-center text-gray-500"
    role="status"
  >
    <p className="text-lg">{message}</p>
  </div>
);

export default EmptyState;
