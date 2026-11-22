/* ============================================================
   SYBERMAD — Bilingual engine (FR default / EN)
   Two mechanisms:
   1) data-i18n="key"  -> central DICT below (shared chrome)
   2) data-fr / data-en -> inline per-element page content
   Add `data-html` to allow rich (innerHTML) content.
   ============================================================ */

const DICT = {
  /* ---- Navigation ---- */
  nav_solutions:   { fr: "Solutions",     en: "Solutions" },
  nav_why:         { fr: "Le cabinet",    en: "Company" },
  nav_partners:    { fr: "Partenaires",   en: "Partners" },
  nav_resources:   { fr: "Ressources",    en: "Resources" },
  nav_careers:     { fr: "Carrières",     en: "Careers" },
  nav_contact:     { fr: "Contact",       en: "Contact" },

  /* mega - solutions columns */
  mega_products:   { fr: "Produits",                 en: "Products" },
  mega_managed:    { fr: "Cameleon SOC (MDR)",       en: "Cameleon SOC (MDR)" },
  mega_audit:      { fr: "Audit & Offensif",         en: "Audit & Offensive" },
  mega_gov:        { fr: "Conseil & Gouvernance",    en: "Advisory & Governance" },
  mega_training:   { fr: "Formation",                en: "Training" },

  s_ikare:     { fr: "Cameleon Detection — Scanner de vulnérabilités", en: "Cameleon Detection — Vulnerability Scanner" },
  s_ikare_d:   { fr: "Détection continue des failles",     en: "Continuous flaw detection" },
  s_reveelium: { fr: "Cameleon Mill — SIEM / XDR",             en: "Cameleon Mill — SIEM / XDR" },
  s_reveelium_d:{ fr: "Détection par IA",                  en: "AI-powered detection" },
  s_cameleon:  { fr: "Cameleon SOC",                        en: "Cameleon SOC" },
  s_cameleon_d:{ fr: "SOC managé (MDR)",                    en: "Managed SOC (MDR)" },
  s_soc:       { fr: "Supervision continue",               en: "Continuous monitoring" },
  s_soc_d:     { fr: "Triage humain des alertes",          en: "Human alert triage" },
  s_edr:       { fr: "Détection & réponse (MDR)",          en: "Detection & response (MDR)" },
  s_edr_d:     { fr: "Confinement coordonné",              en: "Coordinated containment" },
  s_csirt:     { fr: "Réponse à incident incluse",         en: "Incident response included" },
  s_csirt_d:   { fr: "Gestion de crise cyber",             en: "Cyber crisis handling" },
  s_pentest:   { fr: "Test d'intrusion (Pentest)",         en: "Penetration Testing" },
  s_pentest_d: { fr: "Évaluez votre résistance",           en: "Test your resilience" },
  s_passi:     { fr: "Audit de vulnérabilités & config",   en: "Vulnerability & config audit" },
  s_passi_d:   { fr: "Configuration · architecture · code", en: "Configuration · architecture · code" },
  s_gov:       { fr: "Conseil & RSSI",                     en: "Consulting & CISO" },
  s_gov_d:     { fr: "Stratégie & gouvernance",            en: "Strategy & governance" },
  s_compliance:{ fr: "Conformité (RGPD · NIS-2 · DORA)",   en: "Compliance (GDPR · NIS-2 · DORA)" },
  s_compliance_d:{ fr: "Mise en conformité réglementaire", en: "Regulatory readiness" },
  s_academy:   { fr: "SyberMad Academy",                   en: "SyberMad Academy" },
  s_academy_d: { fr: "Cyber · IA · Sensibilisation",       en: "Cyber · AI · Awareness" },

  /* resources mega */
  r_blog:    { fr: "Blog",                 en: "Blog" },
  r_talk:    { fr: "Cyber Talk",           en: "Cyber Talk" },
  r_webinar: { fr: "Webinars",             en: "Webinars" },
  r_white:   { fr: "Livres blancs",        en: "Whitepapers" },
  r_sheets:  { fr: "Fiches produit",       en: "Datasheets" },
  r_glossary:{ fr: "Glossaire",            en: "Glossary" },
  r_demo:    { fr: "Démos & Essais",       en: "Demos & Trials" },
  r_press:   { fr: "Espace presse",        en: "Press room" },

  /* CTAs */
  cta_expert:  { fr: "Échanger avec un expert", en: "Talk to an expert" },
  cta_demo:    { fr: "Demander une démo",    en: "Book a demo" },
  cta_contact: { fr: "Nous contacter",       en: "Contact us" },
  cta_discover:{ fr: "Découvrir",            en: "Discover" },
  cta_all_sol: { fr: "Toutes nos solutions", en: "All solutions" },
  cta_more:    { fr: "En savoir plus",       en: "Learn more" },

  /* footer */
  f_tagline:   { fr: "Une cybersécurité claire, concrète et humaine pour les PME, collectivités et ESN françaises.",
                 en: "Clear, practical and human cybersecurity for French SMEs, local authorities and IT-service firms." },
  f_solutions: { fr: "Solutions",   en: "Solutions" },
  f_company:   { fr: "Cabinet",     en: "Company" },
  f_resources: { fr: "Ressources",  en: "Resources" },
  f_legal:     { fr: "Mentions légales", en: "Legal notice" },
  f_privacy:   { fr: "Politique de confidentialité", en: "Privacy policy" },
  f_sitemap:   { fr: "Plan du site", en: "Sitemap" },
  f_rights:    { fr: "Tous droits réservés.", en: "All rights reserved." },
  f_built:     { fr: "ISO 27001 · ISO 27005 · EBIOS RM · ITIL", en: "ISO 27001 · ISO 27005 · EBIOS RM · ITIL" },
  f_brand:     { fr: "Marque",            en: "Brand" },
  f_logos:     { fr: "Logos",             en: "Logos" },
  f_logo_anim: { fr: "Animation du logo", en: "Logo animation" },
};

const I18N = {
  lang: localStorage.getItem("sybermad-lang") || "fr",

  apply(root = document) {
    const lang = this.lang;
    document.documentElement.lang = lang;

    root.querySelectorAll("[data-i18n]").forEach(el => {
      const entry = DICT[el.getAttribute("data-i18n")];
      if (!entry) return;
      const val = entry[lang] ?? entry.fr;
      if (el.hasAttribute("data-html")) el.innerHTML = val; else el.textContent = val;
    });

    root.querySelectorAll("[data-fr],[data-en]").forEach(el => {
      const val = el.getAttribute("data-" + lang) ?? el.getAttribute("data-fr");
      if (val == null) return;
      if (el.hasAttribute("data-html")) el.innerHTML = val; else el.textContent = val;
    });

    document.querySelectorAll(".lang-toggle button").forEach(b => {
      b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
    });
  },

  set(lang) {
    this.lang = lang;
    localStorage.setItem("sybermad-lang", lang);
    this.apply();
  },

  t(key) { return (DICT[key] && (DICT[key][this.lang] ?? DICT[key].fr)) || key; }
};

window.I18N = I18N;
