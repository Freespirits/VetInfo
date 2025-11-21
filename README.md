# VetInfo Prototype

A minimal full-stack prototype for browsing veterinary guideline content. The Node.js backend proxies an optional upstream
guideline API and falls back to local sample data. The bundled frontend lets you filter by species, topic, or keyword.

## Running locally

1. Install Node.js 18+.
2. (Optional) export an upstream guideline service:

   ```bash
   export GUIDELINES_API_BASE="https://your-guideline-api.example.com"
   export GUIDELINES_API_KEY="token-if-required"
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open the frontend at http://localhost:3000.

## API routes

- `GET /api/health` – returns readiness and whether an upstream API is configured.
- `GET /api/guidelines?species=&topic=&search=` – fetches guidelines from the upstream service if configured; otherwise returns
  filtered sample data from `data/sample-guidelines.json`.

## Frontend

The static frontend (served from `public/`) provides:

- A filter form for species, topic, and keyword search.
- Inline status showing whether data comes from the external API or local sample dataset.
- Cards listing the title, summary, actionable steps, and source for each guideline.

## Notes

- The project intentionally avoids external npm dependencies to keep the environment lightweight. If you prefer Express or other
  middleware, add them to `package.json` and `npm install` in an environment with registry access.
- Replace `data/sample-guidelines.json` with your production data model or extend the backend fetcher to match your upstream API
  schema.
