import React, { useState } from "react";
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

  const [favourite, setFavourite] = useState(false);
  // Publish on the window event bus; the host shell listens without importing this app.
  const toggleFavourite = () => {
    const on = !favourite;
    setFavourite(on);
    window.dispatchEvent(
      new CustomEvent("mfe:event", { detail: { app: "animals", type: "favourite", id: cat.id, name, on } })
    );
  };
  const origin = breed?.origin;
  const life = breed?.life_span;
  const traits = (temperament || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);

  return (
    <Wrapper
      {...motionProps}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      aria-label={`Cat breed: ${name}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={cat.url}
          alt={`A ${name} cat`}
          width={cat.width || 400}
          height={cat.height || 300}
          loading="lazy"
          decoding="async"
          onError={handleImgError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
        {origin && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800 backdrop-blur">
            {origin}
          </span>
        )}
      </div>
      <div className="p-4 pt-1">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
          <button
            type="button"
            onClick={toggleFavourite}
            aria-pressed={favourite}
            aria-label={`${favourite ? "Remove" : "Add"} ${name} ${favourite ? "from" : "to"} favourites`}
            className={`ml-auto rounded-full px-2 text-lg leading-none focus:outline-none focus:ring-2 focus:ring-emerald-500 ${favourite ? "text-rose-500" : "text-slate-400 hover:text-rose-400"}`}
          >
            {favourite ? "♥" : "♡"}
          </button>
          {life && <span className="shrink-0 text-xs text-slate-500">{life} yrs</span>}
        </div>
        {traits.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Temperament">
            {traits.map((t) => (
              <li key={t} className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                {t}
              </li>
            ))}
          </ul>
        )}
        {wiki && (
          <a
            href={wiki}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-sky-700 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label={`Learn more about ${name} on Wikipedia`}
          >
            Learn more ↗
          </a>
        )}
      </div>
    </Wrapper>
  );
};

export default CatCard;
