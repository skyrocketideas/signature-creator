# Email Sigs

A lightweight email signature manager for the FKP Scorpio template. It runs
entirely in the browser and stores workspace changes locally.

## Run locally

Open `index.html` directly, or serve this folder with any static web server.

For example:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Publish

The app has no build step and can be deployed as a static site on services such
as Netlify, Cloudflare Pages, GitHub Pages, or any standard web host.

## Current scope

- Manage multiple team members
- Edit only the fields needed for the client template
- Upload a company logo
- Swap the square bottom image placeholders
- Preview signatures on light and dark backgrounds
- Copy email-safe HTML or download it as a file
- Save workspace changes in the browser

For shared logins, central storage, and client-specific workspaces, the next
version should connect the interface to an authenticated database.
