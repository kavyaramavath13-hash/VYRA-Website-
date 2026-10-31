# VYRA static website

This is a dependency-free static site built with HTML, CSS, and browser JavaScript.

## Production build

From this folder, run `npm run build`. The build validates local HTML links and asset references, then writes the deployable site to `dist/`.

## Vercel

Set the Vercel project's **Root Directory** to `vyra-site`. The included `vercel.json` runs `npm run build` and publishes `dist/`.

No environment variables or API keys are used by this site. Google Fonts are requested from Google Fonts at runtime; the CSS font-family fallbacks remain available if that service cannot be reached.

The contact form is currently a front-end preview. It does not deliver submissions; connect a form provider or server endpoint before relying on it for production contact.

Team photos belong in `assets/team/`, and confirmed venture activity photos belong in `assets/journey/`. Add verified content to the `TEAM_MEMBERS` and `JOURNEY_ACTIVITIES` arrays in `script.js`. Those sections remain hidden when the arrays are empty. To preview labeled placeholders during local development, use `?content-preview=development` on a localhost URL.
