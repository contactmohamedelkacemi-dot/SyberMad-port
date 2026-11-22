# SyberMad — Website

A fully static, bilingual (FR/EN) premium cybersecurity website. **HTML + CSS + Vanilla JavaScript only** — no frameworks, no build step, no backend.

> Original redesign merging the content of two reference firms (ITrust + ORNISEC) into one new brand. Content is preserved; design, IA and identity are entirely original.

## Run locally
Open `index.html` with **VS Code Live Server** (or any static file server). No install required.

## Structure
```
/
├── index.html                  Home
├── solutions.html              Solutions overview (lifecycle spine)
├── solutions/
│   ├── produits.html           Cameleon Detection + Cameleon Mill
│   ├── services-manages.html   SOC · SOC public · EDR · CSIRT · Tickets
│   ├── audit.html              Pentest · Vuln · PASSI · Code · Flash 360° · Dark web · Phishing · Stress test
│   ├── gouvernance.html        Conseil/RSSI · RGPD · NIS-2 · DORA · Crise
│   └── formation.html          SyberMad Academy
├── le-cabinet.html             About · philosophy · qualifications · testimonials
├── partenaires.html            Channel First (models · offer · training · integrations)
├── ressources.html             Blog · Cyber Talk · Webinars · Whitepapers · Datasheets · Glossary · Demos · Press
├── carrieres.html              Culture · Academy · Jobs · Events
├── contact.html                Contact form + info
├── mentions-legales.html       Legal notice
├── confidentialite.html        Privacy policy (GDPR)
└── assets/
    ├── css/  tokens · base · components · layout · animations
    └── js/   i18n · ui · icons · app
```

## How it works
- **Shared chrome** — `assets/js/ui.js` injects the identical header + footer into every page via `#site-header-slot` / `#site-footer-slot`. Edit nav/footer once, there. Each page sets `data-page` (active state) and `data-base` (`""` at root, `"../"` in `solutions/`).
- **Bilingual** — `assets/js/i18n.js`. Shared UI strings use `data-i18n="key"` (central `DICT`); page copy uses inline `data-fr` / `data-en` (+ `data-html` for rich text). FR is default; choice persists in `localStorage`. The FR/EN toggle is in the header.
- **Icons** — `assets/js/icons.js`. Add `data-ico="name"` to any element; the SVG is injected. Icon set defined in one object.
- **Motion** — `assets/js/app.js`: scroll reveal (`data-reveal`), staggered groups (`data-stagger`), counters (`data-count`), parallax (`data-parallax`), scroll progress, condensing header, accordions (`data-acc`), filters (`data-filterbar`), segmented tabs (`data-seg`), smooth anchors, and page-transition curtain. All motion respects `prefers-reduced-motion`.
- **Design tokens** — all colors, type, spacing, radii, shadows and motion live in `assets/css/tokens.css`. Change the theme there.

## Accessibility
Semantic landmarks, one `h1` per page, skip link, visible focus rings, keyboard-operable menus/drawer/accordions (`Esc` closes), `aria-current`/`aria-expanded`, reduced-motion support, labelled form fields.
