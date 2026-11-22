/* ============================================================
   SYBERMAD — Motion & interaction engine
   (scroll reveal, counters, parallax, progress, accordions,
    filters, segmented tabs, smooth anchors, splash, curtain)
   ============================================================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
    initSplash();
    initHeaderScroll();
    initReveal();
    initCounters();
    initParallax();
    initAccordions();
    initFilters();
    initSegmented();
    initSmoothAnchors();
    initCurtain();
    initSelects();
    initForms();
});

/* ---- Loading splash ---- */
function initSplash() {
    const splash = document.getElementById("splash");
    if (!splash) return;
    const done = () => splash.classList.add("done");
    window.addEventListener("load", () => setTimeout(done, 120));
    setTimeout(done, 700); // fail-safe: never block the first interaction
}

/* ---- Header condense + scroll progress ---- */
function initHeaderScroll() {
    const header = document.getElementById("siteHeader");
    const bar = document.getElementById("scrollProgress");
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle("scrolled", y > 24);
        if (bar) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
        }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

/* ---- Scroll reveal + stagger ---- */
function initReveal() {
    const els = document.querySelectorAll("[data-reveal],[data-stagger]");
    document.body.classList.add("has-motion");
    if (reduceMotion) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
}

/* ---- Animated counters ---- */
function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    const animate = (el) => {
        const target = parseFloat(el.dataset.count);
        const dec = (el.dataset.count.split(".")[1] || "").length;
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        if (reduceMotion) { el.textContent = prefix + target.toLocaleString("fr-FR") + suffix; return; }
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            el.textContent = prefix + val.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animate(e.target);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
}

/* ---- Parallax (subtle) ---- */
function initParallax() {
    const els = document.querySelectorAll("[data-parallax]");
    if (!els.length || reduceMotion) return;
    let ticking = false;
    const update = () => {
        const vh = window.innerHeight;
        els.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.15;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
            el.style.setProperty("--py", offset.toFixed(1) + "px");
        });
        ticking = false;
    };
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
    update();
}

/* ---- Accordions (in-page, FAQ, services) ---- */
function initAccordions() {
    document.querySelectorAll("[data-acc] .acc__head").forEach(head => {
        if (head.classList.contains("acc__link")) return;
        head.setAttribute("aria-expanded", "false");
        head.addEventListener("click", () => {
            const item = head.closest(".acc__item");
            const body = item.querySelector(".acc__body");
            const open = item.classList.toggle("open");
            head.setAttribute("aria-expanded", open);
            body.style.maxHeight = open ? body.scrollHeight + "px" : 0;
        });
    });
}

/* ---- Resource / content filters ---- */
function initFilters() {
    document.querySelectorAll("[data-filterbar]").forEach(bar => {
        const targetSel = bar.dataset.filterbar;
        const items = document.querySelectorAll(targetSel + " [data-cat]");
        bar.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                bar.querySelectorAll("button").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const f = btn.dataset.filter;
                items.forEach(it => {
                    const show = f === "all" || it.dataset.cat.split(" ").includes(f);
                    it.style.display = show ? "" : "none";
                });
            });
        });
    });
}

/* ---- Segmented tabs (panels) ---- */
function initSegmented() {
    document.querySelectorAll("[data-seg]").forEach(seg => {
        const panels = document.querySelectorAll(seg.dataset.seg + " [data-panel]");
        seg.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", "false"));
                btn.setAttribute("aria-selected", "true");
                panels.forEach(p => p.hidden = p.dataset.panel !== btn.dataset.tab);
            });
        });
    });
}

/* ---- Smooth anchor scroll with header offset ---- */
function initSmoothAnchors() {
    const headerH = 70;
    document.addEventListener("click", e => {
        const a = e.target.closest('a[href*="#"]');
        if (!a) return;
        const url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const target = document.getElementById(url.hash.slice(1));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        history.pushState(null, "", url.hash);
    });
    // open + scroll to hash on load (after splash)
    if (location.hash) {
        setTimeout(() => {
            const t = document.getElementById(location.hash.slice(1));
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - headerH, behavior: "auto" });
        }, 500);
    }
}

/* ---- Custom accessible dropdowns ---- */
function initSelects() {
    document.querySelectorAll("[data-select]").forEach((root, ri) => {
        const trigger = root.querySelector(".select__trigger");
        const valueEl = root.querySelector(".select__value");
        const list = root.querySelector(".select__list");
        const hidden = root.querySelector('input[type="hidden"]');
        const options = Array.from(root.querySelectorAll(".select__option"));
        if (!trigger || !list || !options.length) return;
        options.forEach((o, i) => { if (!o.id) o.id = `opt-${ri}-${i}`; });

        let activeIndex = Math.max(0, options.findIndex(o => o.getAttribute("aria-selected") === "true"));
        const isOpen = () => root.classList.contains("open");

        const setActive = (i) => {
            activeIndex = (i + options.length) % options.length;
            options.forEach(o => o.classList.remove("active"));
            const el = options[activeIndex];
            el.classList.add("active");
            el.scrollIntoView({ block: "nearest" });
            trigger.setAttribute("aria-activedescendant", el.id);
        };
        const open = () => {
            root.classList.add("open");
            trigger.setAttribute("aria-expanded", "true");
            setActive(activeIndex);
        };
        const close = () => {
            root.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
            trigger.removeAttribute("aria-activedescendant");
        };

        const choose = (opt, refocus = true) => {
            options.forEach(o => o.setAttribute("aria-selected", "false"));
            opt.setAttribute("aria-selected", "true");
            if (hidden) hidden.value = opt.dataset.value || "";
            valueEl.textContent = opt.textContent.trim();
            if (opt.dataset.fr) valueEl.setAttribute("data-fr", opt.dataset.fr);
            if (opt.dataset.en) valueEl.setAttribute("data-en", opt.dataset.en);
            root.dispatchEvent(new CustomEvent("select:change", { bubbles: true, detail: { value: opt.dataset.value } }));
            close();
            if (refocus) trigger.focus();
        };

        trigger.addEventListener("click", () => (isOpen() ? close() : open()));
        options.forEach((o, i) => {
            o.addEventListener("click", () => choose(o));
            o.addEventListener("mousemove", () => setActive(i));
        });
        trigger.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    isOpen() ? setActive(activeIndex + 1) : open();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    isOpen() ? setActive(activeIndex - 1) : open();
                    break;
                case "Home":
                    if (isOpen()) {
                        e.preventDefault();
                        setActive(0);
                    }
                    break;
                case "End":
                    if (isOpen()) {
                        e.preventDefault();
                        setActive(options.length - 1);
                    }
                    break;
                case "Enter":
                case " ":
                    e.preventDefault();
                    isOpen() ? choose(options[activeIndex]) : open();
                    break;
                case "Escape":
                    if (isOpen()) {
                        e.preventDefault();
                        close();
                    }
                    break;
                case "Tab":
                    close();
                    break;
            }
        });
        document.addEventListener("click", (e) => { if (!root.contains(e.target)) close(); });

        // Preselect from URL (?subject=...) when configured
        const param = root.dataset.urlParam;
        if (param) {
            const want = new URLSearchParams(location.search).get(param);
            if (want) {
                const match = options.find(o => (o.dataset.value || "").toLowerCase() === want.toLowerCase());
                if (match) choose(match, false);
            }
        }
    });
}

/* ---- Forms: email sending (EmailJS primary, FormSubmit fallback) ---- */
const INCIDENT_ATTACHMENT_CONFIG = {
    maxFiles: 5,
    maxTotalSize: 5 * 1024 * 1024,
    maxSingleSize: 4 * 1024 * 1024,
    allowedExtensions: new Set([
        "xlsx", "xls", "ods", "docx", "docm", "doc", "csv", "pdf", "txt",
        "gif", "jpg", "jpeg", "png", "tif", "tiff", "rtf", "bmp", "cgm",
        "css", "shtml", "html", "htm", "zip", "xml", "ppt", "pptx", "tar",
        "ez", "ics", "mobi", "msg", "pub", "eps", "odt", "mp3", "m4a",
        "m4v", "wma", "ogg", "flac", "wav", "aif", "aifc", "aiff", "mp4",
        "mov", "avi", "mkv", "mpeg", "mpg", "wmv", "pkpass", "xlsm"
    ])
};

function initForms() {
    const cfg = window.EMAILJS_CONFIG || {};
    const emailjsReady = (form) =>
        window.emailjs &&
        cfg.PUBLIC_KEY && cfg.PUBLIC_KEY !== "PUBLIC_KEY" &&
        cfg.SERVICE_ID && cfg.SERVICE_ID !== "SERVICE_ID" &&
        cfg.TEMPLATE_ID && cfg.TEMPLATE_ID !== "TEMPLATE_ID";
    let emailjsInited = false;

    document.querySelectorAll("form[data-mailform]").forEach(form => {
        const note = form.querySelector("[data-formnote]");
        const errNote = form.querySelector("[data-formerror]");
        const subjInput = form.querySelector('[data-subject-line]');
        const catInput = form.querySelector('input[name="subject"], input[name="category"]');
        const origin = form.dataset.origin || "Contact";
        let sending = false; // duplicate-submission lock

        // Keep the email subject line in sync with the chosen category
        const syncSubject = () => {
            if (!subjInput) return;
            const cat = catInput ? (catInput.value || "") : "";
            subjInput.value = `SyberMad — ${origin}${cat ? " — " + cat : ""}`;
        };
        form.addEventListener("select:change", syncSubject);
        syncSubject();

        const setState = (ok, fail, message) => {
            if (message) {
                const target = fail ? errNote : note;
                if (target) target.textContent = message;
            }
            if (note) note.style.display = ok ? "block" : "none";
            if (errNote) errNote.style.display = fail ? "block" : "none";
        };

        const syncIncidentDerivedFields = () => {
            if (form.dataset.mailTemplate !== "incident") return;

            const setHidden = (name, value) => {
                const input = form.querySelector(`input[name="${name}"]`);
                if (input) input.value = value;
            };

            const typeValue = form.querySelector('input[name="incident_type"]');
            const criticalityValue = form.querySelector('input[name="criticality"]');
            const typeOption = typeValue ? form.querySelector(`.select__option[data-value="${CSS.escape(typeValue.value)}"]`) : null;
            const criticalityOption = criticalityValue ? form.querySelector(`.select__option[data-value="${CSS.escape(criticalityValue.value)}"]`) : null;
            const callback = form.querySelector('input[name="immediate_callback"]');
            const consent = form.querySelector('input[name="consent"]');
            const attachmentInput = form.querySelector('input[type="file"][name="attachment"]');
            const attachmentNames = attachmentInput && attachmentInput.files.length ?
                Array.from(attachmentInput.files).map(file => file.name).join(", ") :
                "Aucune";

            setHidden("incident_type_label", typeOption ? typeOption.textContent.trim() : "");
            setHidden("criticality_label", criticalityOption ? criticalityOption.textContent.trim() : "");
            setHidden("immediate_callback_status", callback && callback.checked ? "Oui" : "Non");
            setHidden("consent_status", consent && consent.checked ? "Accepté" : "Non");
            setHidden("attachment_names", attachmentNames);
        };

        const fileInput = form.querySelector('input[type="file"][name="attachment"]');
        const fileList = form.querySelector("[data-file-list]");

        const validateIncidentFiles = () => {
            if (form.dataset.mailTemplate !== "incident" || !fileInput) return "";
            const files = Array.from(fileInput.files || []);
            const lang = (window.I18N && I18N.lang) || "fr";
            const tooMany = lang === "en" ?
                `You can attach a maximum of ${INCIDENT_ATTACHMENT_CONFIG.maxFiles} files.` :
                `Vous pouvez joindre au maximum ${INCIDENT_ATTACHMENT_CONFIG.maxFiles} fichiers.`;
            const tooLarge = lang === "en" ?
                "The selected files are too large. Please reduce the number or size of the attachments." :
                "Les fichiers sélectionnés sont trop volumineux. Réduisez le nombre ou la taille des pièces jointes.";
            const invalidType = lang === "en" ?
                "One or more selected files use an unsupported file type." :
                "Un ou plusieurs fichiers sélectionnés utilisent un type non pris en charge.";

            if (files.length > INCIDENT_ATTACHMENT_CONFIG.maxFiles) return tooMany;

            const totalSize = files.reduce((sum, file) => sum + file.size, 0);
            if (totalSize > INCIDENT_ATTACHMENT_CONFIG.maxTotalSize) return tooLarge;
            if (files.some(file => file.size > INCIDENT_ATTACHMENT_CONFIG.maxSingleSize)) return tooLarge;

            const invalid = files.some((file) => {
                const dot = file.name.lastIndexOf(".");
                const extension = dot === -1 ? "" : file.name.slice(dot + 1).toLowerCase();
                return !INCIDENT_ATTACHMENT_CONFIG.allowedExtensions.has(extension);
            });
            return invalid ? invalidType : "";
        };

        const updateIncidentFileList = () => {
            if (form.dataset.mailTemplate !== "incident" || !fileInput || !fileList) return;
            const files = Array.from(fileInput.files || []);
            if (!files.length) {
                fileList.style.display = "none";
                fileList.textContent = "";
                return;
            }

            const lang = (window.I18N && I18N.lang) || "fr";
            fileList.style.whiteSpace = "pre-line";
            fileList.style.display = "block";
            fileList.textContent = `${lang === "en" ? "Selected files:" : "Fichiers sélectionnés :"}\n${files.map(file => `- ${file.name}`).join("\n")}`;

            const error = validateIncidentFiles();
            setState(false, Boolean(error), error);
            syncIncidentDerivedFields();
        };

        if (fileInput) {
            fileInput.addEventListener("change", updateIncidentFileList);
            form.addEventListener("form:reset", updateIncidentFileList);
        }

        // Build EmailJS template params from the form fields
        const buildParams = (data) => {
            const get = (n) => (data.get(n) || "").toString().trim();
            const known = ["fn", "ln", "name", "org", "organization", "company", "email", "phone",
                "subject", "msg", "description", "_subject", "_template", "_captcha", "_honey",
                "origin", "consent"
            ];
            const details = [];
            data.forEach((v, k) => {
                if (known.indexOf(k) === -1 && String(v).trim()) details.push(k + ": " + v);
            });
            return {
                to_email: cfg.TO_EMAIL || "contact@sybermad.com",
                origin: origin,
                subject: get("subject") || origin,
                full_name: get("name") || (get("fn") + " " + get("ln")).trim(),
                company: get("company") || get("org") || get("organization"),
                email: get("email"),
                phone: get("phone"),
                message: get("msg") || get("description"),
                details: details.join("\n")
            };
        };

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (sending) return; // prevent duplicate submissions
            if (form.querySelector('[name="_honey"]') && form.querySelector('[name="_honey"]').value) return; // spam
            if (!form.checkValidity()) { form.reportValidity(); return; }
            syncSubject();
            syncIncidentDerivedFields();
            const fileError = validateIncidentFiles();
            if (fileError) {
                setState(false, true, fileError);
                return;
            }
            setState(false, false);

            const btn = form.querySelector('button[type="submit"]');
            const btnLabel = btn ? btn.innerHTML : "";
            const lang = (window.I18N && I18N.lang) || "fr";
            sending = true;
            if (btn) {
                btn.disabled = true;
                btn.textContent = form.dataset.mailTemplate === "incident"
                    ? (lang === "en" ? "Submitting incident..." : "Transmission de l'incident...")
                    : (lang === "en" ? "Sending…" : "Envoi en cours…");
            }

            const done = (ok) => {
                sending = false;
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = btnLabel;
                }
                const successMessage = lang === "en" ?
                    "Your security incident has been submitted successfully." :
                    "Votre incident de sécurité a bien été transmis.";
                const failureMessage = lang === "en" ?
                    "We could not submit your incident. Please try again or contact us directly." :
                    "Nous n'avons pas pu transmettre votre incident. Réessayez ou contactez-nous directement.";
                const incidentMessage = form.dataset.mailTemplate === "incident" ? (ok ? successMessage : failureMessage) : "";
                setState(ok, !ok, incidentMessage);
                if (ok) {
                    form.reset();
                    syncSubject();
                    syncIncidentDerivedFields();
                    form.dispatchEvent(new CustomEvent("form:reset"));
                }
            };

            const data = new FormData(form);

            if (form.dataset.mailTemplate === "incident") {
                fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
                    .then(r => { if (!r.ok) throw new Error("bad status"); return r.json(); })
                    .then(() => done(true))
                    .catch(() => done(false));
            } else if (emailjsReady(form)) {
                // --- Primary: EmailJS (client-side) ---
                if (!emailjsInited) {
                    emailjs.init({ publicKey: cfg.PUBLIC_KEY });
                    emailjsInited = true;
                }
                emailjs.send(cfg.SERVICE_ID, cfg.TEMPLATE_ID, buildParams(data))
                    .then(() => done(true))
                    .catch(() => done(false));
            } else {
                // --- Fallback: FormSubmit AJAX (works with zero configuration) ---
                const ajaxUrl = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
                fetch(ajaxUrl, { method: "POST", body: data, headers: { Accept: "application/json" } })
                    .then(r => { if (!r.ok) throw new Error("bad status"); return r.json(); })
                    .then(() => done(true))
                    .catch(() => done(false));
            }
        });
    });
}

/* ---- Page transition curtain on internal navigation ---- */
function initCurtain() {
    if (reduceMotion) return;
    const curtain = document.getElementById("curtain");
    if (!curtain) return;
    document.addEventListener("click", e => {
        const a = e.target.closest("a");
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || a.target === "_blank" || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
        if (href.includes("#") && new URL(a.href, location.href).pathname === location.pathname) return;
        e.preventDefault();
        curtain.classList.add("in");
        setTimeout(() => { location.href = a.href; }, 420);
    });
}
