/* ============================================================
   SYBERMAD — Inline icon set (1.5px stroke, rounded)
   Usage: <span data-ico="shield"></span>  (or on any element)
   ============================================================ */
(function () {
  const S = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    chip:   S('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/><circle cx="12" cy="12" r="2"/>'),
    pulse:  S('<path d="M3 12h4l2-6 4 12 2-6h6"/>'),
    scan:   S('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>'),
    gov:    S('<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>'),
    cap:    S('<path d="M22 9 12 5 2 9l10 4 10-4Z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>'),
    link:   S('<path d="M9 12a3 3 0 0 0 3 3h3a3 3 0 0 0 0-6h-1M15 12a3 3 0 0 0-3-3H9a3 3 0 0 0 0 6h1"/>'),
    target: S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>'),
    hand:   S('<path d="M7 11V6a2 2 0 0 1 4 0v5M11 11V4a2 2 0 0 1 4 0v7M15 11V6a2 2 0 0 1 4 0v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-3l-2.5-4a2 2 0 0 1 3.4-2L7 13"/>'),
    shield: S('<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z"/><path d="m9 12 2 2 4-4"/>'),
    mic:    S('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    doc:    S('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    book:   S('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 5v14"/>'),
    lock:   S('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    search: S('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    code:   S('<path d="m9 8-4 4 4 4M15 8l4 4-4 4M13 5l-2 14"/>'),
    eye:    S('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
    fish:   S('<path d="M6 12c4-6 11-6 15 0-4 6-11 6-15 0Z"/><path d="M6 12c-2 0-3 2-4 3 1-3 1-3 0-6 1 1 2 3 4 3M15.5 11.5h.01"/>'),
    bolt:   S('<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>'),
    server: S('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
    users:  S('<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M16 5.2a3.2 3.2 0 0 1 0 6M17 20a6 6 0 0 0-2-4.5"/>'),
    file:   S('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>'),
    check:  S('<path d="M20 6 9 17l-5-5"/>'),
    phone:  S('<path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>'),
    mail:   S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    map:    S('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>'),
    bag:    S('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>'),
    network:S('<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5 6 16.5M12 7.5l6 9M7.5 19h9"/>'),
    alert:  S('<path d="M12 3 2 20h20Z"/><path d="M12 9v5M12 17h.01"/>'),
    key:    S('<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v4M15 12v3"/>'),
    cloud:  S('<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A4 4 0 0 1 17 18Z"/>'),
    refresh:S('<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>'),
    rocket: S('<path d="M5 15c-1 1-2 4-2 4s3-1 4-2M9 11a6 6 0 0 1 9-7 6 6 0 0 1-7 9l-2 3-3-3Z"/><circle cx="14.5" cy="9.5" r="1.3"/>'),
    arrow:  S('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    award:  S('<circle cx="12" cy="9" r="6"/><path d="M9 14.5 7 22l5-3 5 3-2-7.5"/>'),
    flag:   S('<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>'),
    layers: S('<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>'),
    globe:  S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>'),
    ticket: S('<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" transform="rotate(0)"/><path d="M14 5v12" stroke-dasharray="2 2"/>'),
  };
  window.ICONS = ICONS;
  document.querySelectorAll("[data-ico]").forEach(el => {
    const ic = ICONS[el.getAttribute("data-ico")];
    if (ic) el.innerHTML = ic;
  });
})();
