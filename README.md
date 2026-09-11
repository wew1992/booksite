# William Martino Booksite

Static website for William Martino, prepared for deployment with **GitHub + Cloudflare Pages**.

## Repository layout

```text
/
├── index.html
├── bibliography.html
├── blog.html
├── about-william-martino.html
├── 01-meet-william-martino.html
├── 02-the-battle-of-good-and-evil.html
├── 03-exploring-obsession.html
├── images/
├── scripts/
│   └── custom.js
├── styles/
│   └── custom.css
├── _redirects
└── README.md
```

The old Weebly `partials/`, template metadata, and unused LESS source were intentionally removed.  
`Home.html` is now `index.html`, and mixed-case page names were normalized for case-sensitive hosting.

## Local testing

Because the site uses relative links, the HTML pages can be opened directly from an extracted folder for basic review.

For the most accurate browser test, serve the repository with any simple local static web server.

## Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages and deploy it as a **static site**.

No database, npm package install, Worker backend, or build framework is required.

Recommended settings:

- Production branch: `main`
- Framework preset: None
- Build command: leave blank
- Build output directory: `/` (repository root)

After the first successful deployment, test the generated `*.pages.dev` address before assigning the production domain.

The `_redirects` file preserves the old exported filenames such as `Home.html` and `Bibliography.html`.

## Updating the site

1. Edit the HTML, CSS, JavaScript, or image files in this repository.
2. Commit the changes to the production branch.
3. Cloudflare Pages will publish the updated commit automatically.

## Contact form

The current contact form uses the visitor's local email application (`mailto:`) and sends to:

`williammartino@writeme.com`

There is no server-side form processor or database in this repository.

## License and site content

The website source code is released under the MIT License; see `LICENSE`.

The MIT license applies to the software/code portions of this repository. Unless explicitly stated otherwise, William Martino's books, excerpts, author biography, logos, photographs, cover artwork, and other literary/visual content remain copyright of William Martino and/or their respective rights holders and are **not** relicensed for reuse by the MIT License.
