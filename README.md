# APU Dance Club — Website

A multi-page website for a university dance club, built with plain HTML, CSS, and vanilla JavaScript (no frameworks, no build step).

## Running it locally

No installation needed. Either:

- Open `index.html` directly in a browser, **or**
- Serve it with a local server (recommended, since some browsers restrict things like `fetch`/relative paths when opened via `file://`):
  ```
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Project structure

```
├── index.html            Homepage (hero slider, previews of other sections)
├── about.html             Mission, vision, history
├── events.html            Upcoming & past events
├── showcase.html          Member performance highlights
├── gallery.html           Photo + video gallery (with lightbox)
├── team.html               Committee profiles
├── membership.html         Sign-up form
├── resources.html          Dancewear + safety guides
├── blog.html                Club blog posts
├── testimonials.html       Member quotes
├── faq.html                 FAQ accordion with live search
├── contact.html             Contact form + embedded map
├── 404.html                  Custom not-found page
├── robots.txt / sitemap.xml  Basic SEO plumbing
├── css/
│   ├── style.css            Main stylesheet (design tokens, layout, components)
│   └── theme.css            Light/Dark theme overrides (toggled from the nav)
└── js/
    ├── script.js             Nav, hero slider, scroll-reveal, forms, FAQ, lightbox
    └── theme.js               Light/Dark/Current theme switcher (persists via localStorage)
```

## Notes for whoever picks this up next

- **Forms don't send real data yet.** `contact.html`, `membership.html`, and the homepage newsletter form all simulate a submission (see `handleFormSubmit` in `script.js`) so the UI is fully demonstrable without a backend. Swap in a real endpoint (e.g. [Formspree](https://formspree.io), a small serverless function, or your own backend) when one exists.
- **Social links** (`Instagram` / `Facebook` / `WhatsApp Group` in the footer) are placeholder `#` links — point them at the club's real accounts before going live.
- **Replace the placeholder domain.** `og:url`, `canonical`, `robots.txt`, and `sitemap.xml` all currently use `https://apudanceclub.example.com` — swap this for the real domain once the site is deployed.
- **Images** referenced under `images/` (hero backgrounds, gallery photos, team headshots, favicon) aren't included in this repo snapshot — drop your actual photos into an `images/` folder alongside these files, using the filenames already referenced in the HTML.
- **Theming**: the "Others" dropdown in the nav includes a Current/Light/Dark theme switcher, implemented in `theme.js` + `theme.css`. It stores the choice in `localStorage` under the `apu-theme` key.

## Accessibility & performance choices worth knowing about

- Fonts load via a `<link rel="stylesheet">` in `<head>` (not a CSS `@import`), which loads in parallel with other assets instead of blocking render.
- Gallery/showcase/team images use `loading="lazy"` so off-screen images don't hold up initial page load.
- The gallery lightbox is fully keyboard-operable (Tab to a photo, Enter/Space to open, Escape to close, focus returns to the thumbnail you opened).
- Every page has a unique `<title>`, meta description, and Open Graph/Twitter card tags for link previews and search results.
