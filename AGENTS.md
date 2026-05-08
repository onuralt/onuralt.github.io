# Repository Guidelines

## Project Structure & Module Organization
This repository is a static portfolio site. The root `index.html` contains the page structure and links to all styles and scripts. CSS is split by concern in `css/`: `base.css` for global tokens and layout defaults, `slides.css` for presentation sections, `robot.css` and `vlsi.css` for project-specific experiences, and `responsive.css` for breakpoint overrides. JavaScript lives in `js/robot-scroll.js` and drives scroll-based robot and VLSI interactions. Visual evidence is stored in `images/`, grouped by project where useful, and `vlsi.pdf` is a downloadable/reference artifact.

## Build, Test, and Development Commands
There is no build step or package manager configuration. Open `index.html` directly for a quick check, or serve the directory locally to avoid browser restrictions around local assets:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Use a different port if 8000 is already in use. For a lightweight syntax check, run:

```sh
npx prettier --check "index.html" "css/**/*.css" "js/**/*.js"
```

Only use `npx` formatting commands when network/tool availability is acceptable.

## Coding Style & Naming Conventions
Use two-space indentation in HTML, CSS, and JavaScript. Keep class names descriptive and kebab-case, matching existing patterns such as `case-slide`, `evidence-grid`, and `vlsi-evidence-item`. Prefer CSS custom properties for shared colors and interaction state. Keep project-specific styling in the matching CSS file, and place cross-cutting mobile adjustments in `responsive.css`. JavaScript should stay plain browser JavaScript with `const`/`let`, small helper functions, and no new framework dependencies unless the repository is intentionally restructured.

## Testing Guidelines
No automated test suite is currently configured. Before submitting changes, manually verify the site in a local browser at desktop and mobile widths. Check sticky navigation, section anchors, image loading, scroll animations, hover/focus zoom behavior, and reduced layout overlap around project evidence grids. When adding new assets, confirm paths and alt text in `index.html`.

## Commit & Pull Request Guidelines
The current history uses short, imperative commit subjects such as `Publish portfolio site` and `Initial commit`. Follow that style: concise, capitalized, and focused on the user-visible change. Pull requests should include a brief summary, screenshots or screen recordings for visual changes, notes on manual browser testing, and any linked issue or context for new portfolio content.

## Security & Configuration Tips
Do not commit private contact details, unpublished project material, or oversized raw source assets. Optimize images before adding them, keep filenames lowercase and descriptive, and update references in `index.html` when moving assets.
