import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";

import "tailwindcss/tailwind.css";

import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import CatCard from "./components/CatCard";

const API_URL =
  "https://api.thecatapi.com/v1/images/search?limit=30&has_breeds=1&size=med";

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return reduced;
};

const AnimalPage = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const reduceMotion = usePrefersReducedMotion();
  const reqIdRef = useRef(0);

  const fetchCats = useCallback(async () => {
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.REACT_APP_CAT_API_KEY;
      const url = apiKey ? `${API_URL}&api_key=${apiKey}` : API_URL;
      const response = await axios.get(url);
      if (reqId === reqIdRef.current) {
        setCats(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      if (reqId === reqIdRef.current) {
        setError("Failed to fetch cat data.");
      }
    } finally {
      if (reqId === reqIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  const filteredCats = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return cats;
    return cats.filter((cat) => {
      const b = cat.breeds?.[0];
      if (!b) return false;
      const name = (b.name || "").toLowerCase();
      const temperament = (b.temperament || "").toLowerCase();
      return name.includes(q) || temperament.includes(q);
    });
  }, [cats, debouncedQuery]);

  const breedCount = useMemo(() => new Set(cats.map((c) => c.breeds?.[0]?.id).filter(Boolean)).size, [cats]);
  const originCount = useMemo(() => new Set(cats.map((c) => c.breeds?.[0]?.origin).filter(Boolean)).size, [cats]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={fetchCats} />;

  return (
    <section aria-labelledby="cat-breeds-heading" className="mx-auto max-w-6xl p-4 text-slate-900">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-700">Animals remote</p>
          <h1 id="cat-breeds-heading" className="mt-1 text-2xl font-semibold text-slate-900">Breed atlas</h1>
        </div>
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-slate-500">Records</dt>
            <dd className="text-lg font-semibold text-slate-900">{cats.length}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Breeds</dt>
            <dd className="text-lg font-semibold text-slate-900">{breedCount}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Origins</dt>
            <dd className="text-lg font-semibold text-slate-900">{originCount}</dd>
          </div>
        </dl>
      </header>

      <div className="mb-6">
        <label htmlFor="cat-search" className="sr-only">
          Search by breed or temperament
        </label>
        <input
          id="cat-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by breed or temperament..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Search by breed or temperament"
        />
      </div>

      <section aria-label="Cat breeds">
        {filteredCats.length === 0 ? (
          <EmptyState
            message={
              debouncedQuery
                ? `No cats match "${debouncedQuery}".`
                : "No cats found."
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCats.map((cat) => (
              <CatCard key={cat.id} cat={cat} reduceMotion={reduceMotion} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default AnimalPage;
