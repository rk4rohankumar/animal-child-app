# Animals · Micro Frontend remote

Cat breeds gallery (photo, breed name, temperament, Wikipedia link) with a debounced search. Built with CRA 5 + CRACO 7, React 19, Tailwind 3, axios and framer-motion, and exposed as a webpack Module Federation remote for [micro-frontend-host](https://github.com/rk4rohankumar/micro-frontend-host). It also runs standalone.

## Data

[TheCatAPI](https://thecatapi.com/) — `GET https://api.thecatapi.com/v1/images/search?limit=30&has_breeds=1&size=med`.

Put your key in `.env` (see `.env.example`):

```
REACT_APP_CAT_API_KEY=your_thecatapi_key_here
```

Without a key the API still answers, but with a smaller result cap.

## Scripts

```bash
npm install
npm start        # dev server on http://localhost:3000
npm run build    # production build in build/ (includes remoteEntry.js)
```

## How the host consumes it

- Scope: `AnimalApp`
- Exposed module: `./AnimalApp` → `src/App`
- Remote entry: `https://animal-child-app.vercel.app/remoteEntry.js`

The host injects `remoteEntry.js` at runtime, calls `container.init(shareScope)` and then `container.get('./AnimalApp')`. In production `output.publicPath` is `'auto'`, so chunks resolve relative to wherever `remoteEntry.js` is embedded.

`react`, `react-dom`, `framer-motion` and `axios` are shared as non-eager singletons (`requiredVersion` from `package.json`), so the host's copies are used when present. Standalone rendering goes through `src/index.js` → `import('./bootstrap')` so the shared modules are negotiated before React renders.
