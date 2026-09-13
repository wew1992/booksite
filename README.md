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
