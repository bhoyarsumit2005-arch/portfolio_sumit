# Sumit Bhoyar — Portfolio

Minimal, responsive React + Vite + JavaScript portfolio built from the uploaded resume.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

`npm run build` runs `vite build` and then `scripts/prerender.mjs`, which renders the app to
static HTML (so the hero paints before JS loads) and inlines the built stylesheet into
`dist/index.html`.

## Performance notes

- Fonts are self-hosted (latin subset, variable) in `public/fonts`. Only the three files the
  design actually uses are loaded; keep it that way instead of re-adding Google Fonts.
- Icons are inline SVG from Font Awesome Free (CC BY 4.0), defined in `src/components/Icon.jsx`.
  Add new icons there instead of reinstalling the icon webfont.
- The hero must not use `data-reveal`; that animation starts hidden and delays LCP.
- `ResumeModal` is lazy-loaded and the certificate PDFs are checked during idle time.

## SEO and discovery

- `public/llms.txt` is the Markdown index for LLM crawlers. Keep the H1 and links intact.
- `public/.well-known/ard.json` is the Agentic Resource Discovery manifest. Its entries point at
  the skill docs in `public/.well-known/agent-skills/`; re-validate it after editing.
- `public/404.html` is the real 404 page. `netlify.toml` sends unknown paths to it with a 404
  status, so search engines never see a soft 404 from the old SPA fallback.
- `public/images/og-cover.jpg` (1200×630) is the social share card. Its source layout is
  `scripts/og-template.html`; render it through a local preview server so the fonts resolve.
- Structured data lives in `index.html` (`WebSite`, `ProfilePage`, `Person`, `ItemList`). Update
  the projects and credentials there when the data in `src/data/portfolio.js` changes.
- When the content changes, bump `lastmod` in `public/sitemap.xml`.

## Analytics

Google Analytics 4 is configured in `index.html` with measurement ID `G-NE4Y1MXCY1`. The tag is
plain HTML in the Vite entry, so it survives `vite build` and the prerender step.

- The `gtag` loader is injected at runtime and skipped on `localhost`/`127.0.0.1`, so local dev
  and preview visits do not reach GA.
- `gtag()` is defined unconditionally, so custom events can be called anywhere. On localhost they
  queue in `dataLayer` and are never sent.
- Verify after deploying with GA4 Realtime or the Google Tag Assistant.

## Personalize

- Replace the profile placeholder by adding your own photo at `public/images/profile.jpg`, then update the portrait section in `src/App.jsx` to use that image.
- Update personal details and skills in `src/data/portfolio.js`.
- Add verified project repository URLs to the project data before linking cards directly to individual repositories. Currently, project links go to the GitHub profile because individual repository URLs were not present in the resume.
- The uploaded resume is copied to `public/files/Sumit-Bhoyar-Resume.pdf` and the download button points to it.

## Notes

- The resume lists CGPA as 8.15/10 and lists ResumeCraft and SigmaGPT as projects.
- Certification years and certificate URLs were not present in the uploaded resume, so they are not invented.
- No live demo links are shown because no deployed URLs were supplied.
