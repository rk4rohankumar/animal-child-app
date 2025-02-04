import React,{ useEffect, useState,memo } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import 'tailwindcss/tailwind.css';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      ></motion.div>
      <p className="text-lg font-semibold text-gray-700 mt-4">Fetching cute cats...</p>
    </div>
  );
};

const AnimalPage = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("https://api.thecatapi.com/v1/images/search?limit=30&has_breeds=1&api_key=live_bFfdOxUTcCcf9Es6W617qiAQLZ6Eimni0YaC8izjF0ugXikwe0ANMOzTg7gb2u7g");
        setCats(response.data);
      } catch (err) {
        setError("Failed to fetch cat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) return <p className="text-center text-lg"><Loader/></p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🐱 Cat Breeds</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cats.map((cat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={cat.url}
              alt="Cat"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{cat.breeds?.[0]?.name || "Unknown Breed"}</h2>
              <div className="text-gray-600 text-sm">{cat.breeds?.[0]?.temperament}</div>
              <a
                href={cat.breeds?.[0]?.wikipedia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline mt-2 block"
              >
                Learn more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(AnimalPage);
