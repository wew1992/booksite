# William Martino website

Static HTML/CSS/JavaScript source intended for GitHub + Cloudflare Pages.

## 2026-09-13 update
- Added `04-Blood-Pact.html`.
- Added the fourth post card to `blog.html`.
- Replaced Weebly `{menu}` tokens with a real static top navigation on every page.
- Converted `/files/theme/...` references to repository-local `/images`, `/styles`, and `/scripts` paths.
- Added Cloudflare Pages `_redirects` for the old Weebly-style page names and common route variants.
- Kept the direct author contact destination used by the working Whisper form.

## Important existing image
The new post expects this existing repository file:

`images/Pactbound-Trilogy-annuncement.png`

Keep the image already present in GitHub under that exact spelling. This update package does not replace it because it was not present in the supplied local theme ZIP.

## Cloudflare Pages
Publish the repository root as the site output. No npm/build step is required.

## Static-path rule

All site-owned links use paths relative to the repository root (for example
`styles/custom.css`, `scripts/custom.js`, `images/...`, and `blog.html`).

This is intentional: a cloned copy can be opened directly from a local folder,
while the same files also work when deployed at the root of the Cloudflare site.

Do not change these to `/styles/...`, `/scripts/...`, `/images/...`, or other
leading-slash paths unless the local-folder preview requirement is removed.

The canonical shared assets are:

- `styles/custom.css`
- `scripts/custom.js`

There is no required `styles/main.css` or `scripts/site.js`.
