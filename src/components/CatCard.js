import React from "react";
import { motion } from "framer-motion";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='sans-serif' font-size='20'>Image unavailable</text></svg>";

const handleImgError = (e) => {
  if (e.currentTarget.src !== FALLBACK_IMG) {
    e.currentTarget.src = FALLBACK_IMG;
  }
};

const CatCard = ({ cat, reduceMotion }) => {
  const breed = cat.breeds?.[0];
  const name = breed?.name || "Unknown Breed";
  const temperament = breed?.temperament;
  const wiki = breed?.wikipedia_url;

  const Wrapper = reduceMotion ? "article" : motion.article;
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      };

  return (
    <Wrapper
      {...motionProps}
      className="bg-white rounded-lg shadow-md overflow-hidden"
      aria-label={`Cat breed: ${name}`}
    >
      <img
        src={cat.url}
        alt={`A ${name} cat`}
        loading="lazy"
        decoding="async"
        onError={handleImgError}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{name}</h2>
        {temperament && (
          <div className="text-gray-600 text-sm">{temperament}</div>
        )}
        {wiki && (
          <a
            href={wiki}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm hover:underline mt-2 block focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Learn more about ${name} on Wikipedia`}
          >
            Learn more
          </a>
        )}
      </div>
    </Wrapper>
  );
};

export default CatCard;
