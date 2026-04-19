import React from "react";

const ErrorState = ({ message, onRetry }) => (
  <div
    className="flex flex-col items-center justify-center p-8 text-center"
    role="alert"
    aria-live="assertive"
  >
    <p className="text-red-500 text-lg mb-4">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
