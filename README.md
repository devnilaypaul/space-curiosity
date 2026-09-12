# Space Curiosity

Static site about space history and future. Launches, astronauts, rockets and engines, solar system, discoveries. Built with HTML, CSS, and JS only.

## Run locally

ES modules and fetch need HTTP, not file open. From repo root run one of:

```
npx serve .
```

or with VS Code Live Server, open `index.html`.

Then visit the local URL shown.

## Structure

```
index.html launches.html astronauts.html rockets.html solar-system.html discoveries.html
css/ js/ data/ assets/
```

## Data

Core content lives in `data/*.json`. Upcoming launches try SpaceX and Launch Library 2 live, then fall back to `data/upcoming-fallback.json` and cached results. Images are remote URLs with lazy loading.
