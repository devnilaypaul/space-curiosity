# AGENTS.md

## Questioning

Ask the user one question at a time. One question's answer can change the next question and its answers, so never batch multiple questions together. Explain options in plain words before calling the question tool.

## Run and verify

- Serve over HTTP, never `file://`: `npx serve .` (ES modules and `fetch` break on file open). Use the `localhost` URL it prints.
- No build, tests, or linter. Verify with `node --check js/*.js` and screenshots.
- Visual verification: use `playwright-cli` (`screenshot`, `goto`, `eval`). Capture screenshots after UI changes and review them before finishing. Screenshot artifacts go to `.playwright-cli/` (gitignored).

## Architecture

- Plain static site, no framework: six pages (`index`, `launches`, `astronauts`, `rockets`, `solar-system`, `discoveries`, plus `404`), `css/` (reset, tokens, styles), `js/` (main, ui, api, store, starfield), content in `data/*.json`.
- Served URLs are clean (`/launches`, not `/launches.html`). `initChrome()` in `js/main.js` normalizes both shapes; keep that working if you touch nav matching.

## Gotchas

- Launch data: SpaceX endpoint is CORS-blocked in browsers, so `getUpcomingLaunches()` falls through to Launch Library 2 by design. Do not "fix" that fallback chain.
- Launch Library list payload uses flat fields (`lsp_name`, string `pad`, string `mission`, `image`). `normalize()` in `js/api.js` handles old nested and new flat shapes; keep both paths.
- Upcoming results are cached in `localStorage`. Clear site data when verifying `api.js` normalize changes or you will see stale cards.
- Favorites are one `localStorage` set shared by all pages; Home renders every kind (launch, upcoming, astronaut, rocket, engine, world, discovery). Keep new saveable IDs visible there.
- Every list page syncs its filters to the URL and has a Saved-only toggle plus Clear. Keep param names and the shared toolbar markup in sync when adding filters.
- Dialogs use one runtime-created `#detail-dialog` with focus return and a single backdrop handler. Do not add per-open listeners.
- `bindFavorites()` dedupes via a dataset guard, so calling it after each render is safe and required for new nodes.
- Images are remote (Unsplash, Launch Library). New `<img>` needs `width`/`height`, `loading="lazy"`, `decoding="async"`, and `onerror` removal; aspect ratio lives in CSS.
- Dark-only token system in `css/tokens.css`; display face Space Grotesk, body Inter via Google Fonts. Page meta stays minimal (theme-color plus descriptions, no social cards) per owner decision.
