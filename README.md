# A Diwali Surprise

Romantic, mobile-first Diwali greeting built with React and Vite. The welcome interaction leads into five greeting moments, each with cracker artwork and a full-screen Canvas particle transition. Background music uses one persistent looping audio element; the small corner control mutes and unmutes it.

## Run

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Deploy with GitHub Pages

Build with `GITHUB_PAGES=true npm run build`, then configure GitHub Pages to deploy from the `main` branch and `/docs` folder. The built site is written to `docs/`.

## Personalize audio and messages

Edit `src/config/diwaliConfig.js` to set her name, copy, palette, and volumes. The provided background song is at `public/audio/background-music.mp3` and starts at low volume. Cracker effects use distinct Web Audio fallbacks until the real recordings are added under `public/audio/sfx/`; see that folder’s README for the expected filenames.
