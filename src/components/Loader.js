import React from "react";
import { motion } from "framer-motion";

const Loader = () => (
  <div
    className="flex flex-col items-center justify-center h-screen"
    role="status"
    aria-live="polite"
  >
    <motion.div
      className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity }}
      aria-hidden="true"
    />
    <p className="text-lg font-semibold text-gray-700 mt-4">
      Fetching cute cats...
    </p>
  </div>
);

export default Loader;
