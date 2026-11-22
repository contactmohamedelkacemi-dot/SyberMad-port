/* ============================================================
   SYBERMAD — Shared chrome (header + footer) injection
   Renders identical nav/footer on every page. Pages only set
   data-page="<id>" on <body> to drive active states & base path.
   ============================================================ */

(function () {
  const BASE = document.body.dataset.base || "";   // e.g. "" at root, "../" in subfolders
  const PAGE = document.body.dataset.page || "";
  const u = p => BASE + p;

  const LOGO = `
  <svg class="brand__mark" viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#6366F1"/>
      </linearGradient>
    </defs>
    <path class="mark__shield" d="M24 4 7 13v13c0 11 9 16 17 18 8-2 17-7 17-18V13z" fill="none" stroke="url(#bg)" stroke-width="2.4" stroke-linejoin="round"/>
    <circle class="mark__ping" cx="24" cy="24" r="8.6" fill="none" stroke="url(#bg)" stroke-width="1"/>
    <g class="mark__ring">
      <circle cx="24" cy="24" r="8.6" fill="none" stroke="url(#bg)" stroke-width="1" stroke-dasharray="2.25 4.5" opacity=".55"/>
    </g>
    <g class="mark__eye">
      <circle class="eye__iris" cx="24" cy="24" r="4.4" fill="none" stroke="url(#bg)" stroke-width="1.2"/>
      <g class="eye__gx"><g class="eye__gy">
        <circle class="eye__pupil" cx="24" cy="24" r="2.4" fill="url(#bg)"/>
        <circle class="eye__spark" cx="23" cy="23" r=".62" fill="#EAFBFF" opacity=".95"/>
      </g></g>
    </g>
  </svg>`;

  const caret = `<svg class="nav__caret" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* Mega menu link helper */
  const ml = (href, k, kd) =>
    `<a class="mega__link" href="${u(href)}"><strong data-i18n="${k}"></strong><small data-i18n="${kd}"></small></a>`;

  const solutionsMega = `
    <div class="mega">
      <div class="mega__grid">
        <div>
          <p class="mega__col-title" data-i18n="mega_products"></p>
          ${ml("solutions/produits.html#cameleon-detection", "s_ikare", "s_ikare_d")}
          ${ml("solutions/produits.html#cameleon-mill", "s_reveelium", "s_reveelium_d")}
          ${ml("solutions/cameleon-soc.html", "s_cameleon", "s_cameleon_d")}
          <p class="mega__col-title" data-i18n="mega_managed"></p>
          ${ml("solutions/cameleon-soc.html#piliers", "s_soc", "s_soc_d")}
          ${ml("solutions/cameleon-soc.html#piliers", "s_edr", "s_edr_d")}
          ${ml("solutions/cameleon-soc.html#reponse", "s_csirt", "s_csirt_d")}
        </div>
        <div>
          <p class="mega__col-title" data-i18n="mega_audit"></p>
          ${ml("solutions/audit.html#pentest", "s_pentest", "s_pentest_d")}
          ${ml("solutions/audit.html#passi", "s_passi", "s_passi_d")}
          <p class="mega__col-title" data-i18n="mega_gov"></p>
          ${ml("solutions/gouvernance.html#conseil", "s_gov", "s_gov_d")}
          ${ml("solutions/gouvernance.html#conformite", "s_compliance", "s_compliance_d")}
          <p class="mega__col-title" data-i18n="mega_training"></p>
          ${ml("solutions/formation.html", "s_academy", "s_academy_d")}
        </div>
      </div>
    </div>`;

  const resourcesMega = `
    <div class="mega mega--sm">
      <div class="mega__grid">
        <div>
          ${ml("ressources.html#blog", "r_blog", "r_blog")}
          ${ml("ressources.html#cybertalk", "r_talk", "r_talk")}
          ${ml("ressources.html#webinars", "r_webinar", "r_webinar")}
          ${ml("ressources.html#livres-blancs", "r_white", "r_white")}
        </div>
        <div>
          ${ml("ressources.html#fiches", "r_sheets", "r_sheets")}
          ${ml("ressources.html#glossaire", "r_glossary", "r_glossary")}
          ${ml("ressources.html#demos", "r_demo", "r_demo")}
          ${ml("ressources.html#presse", "r_press", "r_press")}
        </div>
      </div>
    </div>`;

  const navItem = (id, href, key, mega = "") => `
    <li class="nav__item">
      <a class="nav__link" href="${u(href)}" ${PAGE === id ? 'aria-current="page"' : ""} data-i18n="${key}">
      </a>${mega ? caret : ""}${mega}
    </li>`;

  const langToggle = (cls = "") => `
    <div class="lang-toggle ${cls}" role="group" aria-label="Language">
      <button data-lang="fr" aria-pressed="true">FR</button>
      <button data-lang="en" aria-pressed="false">EN</button>
    </div>`;

  /* ---------------- HEADER ---------------- */
  const header = `
  <a class="skip-link" href="#main" data-fr="Aller au contenu" data-en="Skip to content">Aller au contenu</a>
  <div class="scroll-progress" id="scrollProgress"></div>
  <header class="site-header" id="siteHeader">
    <div class="container">
      <a class="brand" href="${u('index.html')}" aria-label="SyberMad — accueil">
        ${LOGO}<span><b>SyberMad</b></span>
      </a>
      <nav class="nav" aria-label="Principale">
        <ul style="display:flex;gap:4px;align-items:center">
          ${navItem("solutions", "solutions.html", "nav_solutions", solutionsMega)}
          ${navItem("why", "le-cabinet.html", "nav_why")}
          ${navItem("partners", "partenaires.html", "nav_partners")}
          ${navItem("resources", "ressources.html", "nav_resources", resourcesMega)}
          ${navItem("careers", "carrieres.html", "nav_careers")}
        </ul>
      </nav>
      <div class="header-actions">
        ${langToggle()}
        <a class="btn btn--primary" href="${u('contact.html?subject=commercial')}" data-i18n="cta_expert"></a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="drawer">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="drawer" id="drawer">
    <div class="acc" id="drawerAcc">
      <div class="acc__item">
        <button class="acc__head">${I18N.t('nav_solutions')}<span class="acc__ico">+</span></button>
        <div class="acc__body"><div>${solutionsMega.replace('class="mega"','class="mega-inner"').replace('class="mega mega--sm"','class="mega-inner"')}</div></div>
      </div>
      <div class="acc__item"><button class="acc__head acc__link" data-href="${u('le-cabinet.html')}">${I18N.t('nav_why')}</button></div>
      <div class="acc__item"><button class="acc__head acc__link" data-href="${u('partenaires.html')}">${I18N.t('nav_partners')}</button></div>
      <div class="acc__item">
        <button class="acc__head">${I18N.t('nav_resources')}<span class="acc__ico">+</span></button>
        <div class="acc__body"><div>${resourcesMega.replace('class="mega mega--sm"','class="mega-inner"')}</div></div>
      </div>
      <div class="acc__item"><button class="acc__head acc__link" data-href="${u('carrieres.html')}">${I18N.t('nav_careers')}</button></div>
      <div class="acc__item"><button class="acc__head acc__link" data-href="${u('contact.html?subject=commercial')}">${I18N.t('nav_contact')}</button></div>
    </div>
    <div class="header-actions">
      ${langToggle("in-drawer")}
      <a class="btn btn--primary in-drawer" href="${u('contact.html?subject=commercial')}" data-i18n="cta_expert"></a>
    </div>
  </div>`;

  /* ---------------- FOOTER ---------------- */
  const fcol = (title, links) => `
    <div class="footer-col">
      <h4 data-i18n="${title}"></h4>
      ${links.map(([href, k, isDict]) => `<a href="${u(href)}" ${isDict ? `data-i18n="${k}"` : `data-fr="${k}" data-en="${k}"`}></a>`).join("")}
    </div>`;

  const social = (label, path) => `<a href="#" aria-label="${label}"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${path}</svg></a>`;

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${u('index.html')}">${LOGO}<span><b>SyberMad</b></span></a>
          <p data-i18n="f_tagline"></p>
          <div class="footer-badges">
            <span class="chip" data-i18n="f_built"></span>
          </div>
        </div>
        ${fcol("f_solutions", [
          ["solutions/produits.html", "Cameleon Detection & Cameleon Mill", false],
          ["solutions/cameleon-soc.html", "Cameleon SOC (MDR)", false],
          ["solutions/audit.html", "Audit & Pentest", false],
          ["solutions/gouvernance.html", "Conseil & Conformité", false],
          ["solutions/formation.html", "SyberMad Academy", false],
        ])}
        ${fcol("f_company", [
          ["le-cabinet.html", "À propos", false],
          ["notre-approche.html", "Notre approche", false],
          ["pour-qui.html", "Pour qui ?", false],
          ["partenaires.html", "Partenaires", false],
          ["carrieres.html", "Carrières", false],
          ["contact.html?subject=general", "Contact", false],
        ])}
        ${fcol("f_resources", [
          ["ressources.html#blog", "Blog", false],
          ["ressources.html#cybertalk", "Cyber Talk", false],
          ["ressources.html#livres-blancs", "Livres blancs", false],
          ["ressources.html#glossaire", "Glossaire", false],
        ])}
      </div>
      <div class="footer-bottom">
        <span>© <span id="year"></span> SyberMad — <span data-i18n="f_rights"></span></span>
        <nav class="socials" aria-label="Réseaux sociaux">
          ${social("LinkedIn", '<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.34 18.34V9.9H5.67v8.44zM7 8.67a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18.34v-4.63c0-2.48-1.33-3.63-3.1-3.63a2.67 2.67 0 0 0-2.42 1.33v-1.5H10.2v8.44h2.66v-4.46c0-1.18.22-2.32 1.68-2.32s1.45 1.35 1.45 2.4v4.38z"/>')}
          ${social("X", '<path d="M18.9 2H22l-7.3 8.34L23 22h-6.84l-5-6.55L5.4 22H2.3l7.8-8.92L1.5 2h6.9l4.5 5.96zm-1.2 18h1.9L7.4 4H5.4z"/>')}
          ${social("YouTube", '<path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7c.4-1.5.4-4.7.4-4.7zM9.8 15.3V8.7l6 3.3z"/>')}
        </nav>
        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <a href="${u('mentions-legales.html')}" data-i18n="f_legal"></a>
          <a href="${u('confidentialite.html')}" data-i18n="f_privacy"></a>
          <a href="${u('cookies.html')}" data-fr="Cookies" data-en="Cookies"></a>
        </div>
      </div>
    </div>
  </footer>
  <div class="curtain" id="curtain"></div>`;

  /* ---- Inject ---- */
  document.getElementById("site-header-slot").innerHTML = header;
  document.getElementById("site-footer-slot").innerHTML = footer;
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Wire interactions ---- */
  // language
  document.querySelectorAll(".lang-toggle button").forEach(b =>
    b.addEventListener("click", () => I18N.set(b.dataset.lang)));

  // drawer
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const toggleDrawer = (open) => {
    burger.classList.toggle("open", open);
    drawer.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleDrawer(!drawer.classList.contains("open")));
  drawer.querySelectorAll(".acc__link").forEach(b =>
    b.addEventListener("click", () => { if (b.dataset.href) location.href = b.dataset.href; }));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) toggleDrawer(false); });

  // drawer accordions (those with bodies)
  drawer.querySelectorAll(".acc__item > .acc__head:not(.acc__link)").forEach(head => {
    head.addEventListener("click", () => {
      const item = head.parentElement;
      const body = item.querySelector(".acc__body");
      const open = item.classList.toggle("open");
      body.style.maxHeight = open ? body.scrollHeight + "px" : 0;
    });
  });

  // Apply translations to freshly injected chrome
  I18N.apply();
})();
