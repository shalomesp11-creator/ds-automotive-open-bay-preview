# D&S Automotive Repair Solutions — OPEN BAY

Local multi-page automotive service website for Columbus, Ohio, using the existing OPEN BAY design. The site contains the original homepage, an About Us page, 16 category pages, 138 individual service guides, and a service directory. The request form remains an explicit demonstration; it does not send or save information. Business phone and hours remain unconfirmed as documented in TASK 007. Nothing has been published.

## Open these

| File | What it shows |
|---|---|
| **[index.html](index.html)** | **Desktop preview.** The full page: hero, popular services, Service Menu with search, How It Works, the American-iron band, the visit section, and the request form. It is responsive, so narrowing the window or opening it on a phone gives the mobile layout. |
| **[about/index.html](about/index.html)** | **About Us.** The full family story, preserved verbatim, with the shared navigation and request form. The homepage includes a short introduction and a Read Our Story link. |
| **[mobile.html](mobile.html)** | **Mobile preview.** Three live iPhone-width frames: first screen, Service Menu (Brakes), and the Repair Order form. |
| **[background.html](background.html)** | **Live background preview.** The storefront environment at a large size, with a wind gauge and a legend for each layer. |
| [checks/open-bay-live-10s.mp4](checks/open-bay-live-10s.mp4) | 10-second recording of the live first screen in Microsoft Edge (1440 × 900, 25 fps). |
| [design-notes.md](design-notes.md) | Design rationale and specification: why this works, the color and type system, the services menu, the form, mobile. |
| [asset-notes.md](asset-notes.md) | Logo, photo credit and license, fonts, what is drawn in code, placeholders to replace. |

Screenshots are in `checks/`: `desktop-first-screen.png`, `desktop-full.png`, `desktop-services.png`, `desktop-request.png`, `mobile-first-screen.png`, `mobile-full.png`, `mobile-request.png`, `mobile-preview.png`, `background.png`.

For the complete static site, run `python -m http.server 8000` in this folder and open `http://localhost:8000/`. Category and service directories each contain a real `index.html`, so direct links and reloads work without SPA routing. All assets and routes also work under a hosting subdirectory. No internet connection or runtime framework is required.

## Try this

1. Open `index.html` and don't scroll. The door rises, the flag starts moving, the bay lights come up, the OPEN sign warms up, and cloud shadows cross the siding.
2. Click **Brakes** in the Popular Services strip, or type "check engine" or "squeak" into the search.
3. Click a category or service name to read its guide. Use **Request Service** to open the Repair Order with the individual service already filled in. Form submission only previews the request.
4. Use **Pause motion** (top right of the stage), or turn on your system's "reduce motion" setting.

## Developer checks

TASK 012 story and responsive checks:

```
python tools/build_services.py
python checks/task012.py
python checks/task012.py --webkit --layout-only
```

`content/about.txt` is the exact supplied story. The builder generates `about/index.html` alongside the service pages and shares the homepage navigation, hours, footer, and request form. TASK 012 checks the story character for character, all local page links, unchanged service content against the saved baseline, responsive layouts at 320–1920 px, navigation, request actions, and motion controls. See `TASK-012.md` and `checks/task012-*.json` for results and limits.

TASK 008 content and build:

```
python tools/build_services.py
python checks/task008_static.py
python checks/task008_browser.py
python checks/task008_browser.py --webkit --layout-only
```

`content/01.md` through `content/16.md` contain individually authored category and service text. Each `## category` or `## 01.01` block contains a lead paragraph, body sections, and an explicit `Related:` list of approved IDs. Edit these source files, then rebuild. Do not edit generated HTML directly. The builder validates IDs and names against `../ds-services-final.md` and `assets/catalog.js`; neither inventory is changed.

`content/site-data.json`, `assets/service-routes.js`, and `services/**/index.html` are generated outputs. Shared navigation and the existing form are reused from `index.html`; `app.js` runs the same form on both homepage and inner pages. `service-pages.css` supplies the inner-page layout using the established palette, fonts, logo, buttons, and category icons. No domain, canonical URL, business-hours claim, review rating, or telephone number is invented.

The static check covers all pages and local link targets, exact substantive paragraph reuse, shared five-word phrases, and TF-IDF similarity. The browser check starts a temporary HTTP server, tests every category/service URL and reload, checks all service prefills, and exercises representative pages at seven widths. `--layout-only` skips the exhaustive URL pass for secondary-engine checks. See `TASK-008.md` for results and limits.

TASK 006 adds the local shop-location card, a 170-make searchable catalog, optional vehicle fields, General Consultation, and an explicit form demo state. See [TASK-006.md](TASK-006.md) for sources, update instructions, and mobile verification. No real requests are sent.

They require Python Playwright and an installed Microsoft Edge (FFmpeg as well for the recording).

```
python claude-design-concept/checks/verify.py    # functional checks -> checks/results.json
python claude-design-concept/checks/shoot.py     # screenshots
python claude-design-concept/checks/extras.py    # background/mobile previews + flag fallback still
python claude-design-concept/checks/record.py    # 10 s MP4 of the live hero
```

Nothing outside this folder was modified. The earlier concepts (`../design-concept`, `../design-concept-v2`), the logo, and the service documents are untouched.
