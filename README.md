# VYRA static website

This is a dependency-free static site built with HTML, CSS, and browser JavaScript.

## Production build

From this folder, run `npm run build`. The build validates local HTML links and asset references, then writes the deployable site to `dist/`.

## Vercel

Set the Vercel project's **Root Directory** to `vyra-site`. The included `vercel.json` runs `npm run build` and publishes `dist/`.

No environment variables or API keys are used by this site. Google Fonts are requested from Google Fonts at runtime; the CSS font-family fallbacks remain available if that service cannot be reached.

The contact form is disabled until a secure endpoint is configured. Set `CONTACT_FORM_ENDPOINT` in `script.js` to an endpoint that accepts a JSON `POST` with `name`, `email`, and `message`, then verify that endpoint's validation, spam protection, retention and CORS behavior. Keep private API keys on the server; do not put them in this static site. Until configured, visitors see a clear setup message and the form cannot send data.

Team photos belong in `assets/team/`, and confirmed venture activity photos belong in `assets/journey/`. Add verified content to the `TEAM_MEMBERS` and `JOURNEY_ACTIVITIES` arrays in `script.js`. Team profiles need a confirmed role, contribution and real photo to appear on the public site; the supplied names are shown as placeholders only in local development. Journey items remain hidden until confirmed activity details and photos are added. To preview labeled placeholders during local development, use `?content-preview=development` on a localhost URL.

The “What we’re exploring” section describes areas of curiosity, not launched products or completed projects.
