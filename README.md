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

## Personalize

- Replace the profile placeholder by adding your own photo at `public/images/profile.jpg`, then update the portrait section in `src/App.jsx` to use that image.
- Update personal details and skills in `src/data/portfolio.js`.
- Add verified project repository URLs to the project data before linking cards directly to individual repositories. Currently, project links go to the GitHub profile because individual repository URLs were not present in the resume.
- The uploaded resume is copied to `public/files/Sumit-Bhoyar-Resume.pdf` and the download button points to it.

## Notes

- The resume lists CGPA as 8.15/10 and lists ResumeCraft and SigmaGPT as projects.
- Certification years and certificate URLs were not present in the uploaded resume, so they are not invented.
- No live demo links are shown because no deployed URLs were supplied.
