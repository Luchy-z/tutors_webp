// Applies window.BRIGHTSIDE_SITE (written by editor.html) to the page.
// Also powers the live preview: when the page is loaded inside the editor
// (index.html?edit=1 in an iframe) it accepts config messages from the parent
// and lets you click elements to select them.
(() => {
  "use strict";

  const FONTS = {
    "Manrope": { w: "400;500;600;700;800" },
    "DM Sans": { w: "400;500;600;700" },
    "Inter": { w: "400;500;600;700;800" },
    "Poppins": { w: "400;500;600;700;800" },
    "Space Grotesk": { w: "400;500;600;700" },
    "Sora": { w: "400;500;600;700;800" },
    "Plus Jakarta Sans": { w: "400;500;600;700;800" },
    "Nunito": { w: "400;500;600;700;800" },
    "Outfit": { w: "400;500;600;700;800" },
    "Work Sans": { w: "400;500;600;700;800" },
    "Playfair Display": { w: "400;500;600;700;800", serif: true },
    "Fraunces": { w: "400;500;600;700;800", serif: true },
    "Lora": { w: "400;500;600;700", serif: true }
  };
  const SECTIONS = {
    hero: "#approach", stats: ".stats", lessons: "#lessons", pricing: "#pricing",
    booking: "#booking", reviews: "#reviews", contact: "#contact"
  };
  const DEFAULTS = {
    brand: "",
    photo: "",
    colors: { ink: "#202821", muted: "#69716a", paper: "#f8f7f2", green: "#d9f36a", deep: "#243b30", line: "#e7e7df" },
    fonts: { display: "Manrope", sans: "DM Sans" },
    shape: { cardRadius: 20, buttonShape: "pill", buttonShadow: true },
    spacing: { section: 1 },
    hero: { photoSide: "right", photoShape: "arch", decorations: true, focusX: 57, focusY: 50 },
    features: { stickyCta: true, animations: true, bento: true },
    sections: { order: Object.keys(SECTIONS), hidden: [] },
    text: { en: {}, pl: {} }
  };

  const isObject = value => value && typeof value === "object" && !Array.isArray(value);
  const pick = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  const num = (value, min, max, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const bool = (value, fallback) => typeof value === "boolean" ? value : fallback;

  // Text may only contain <br>, <em> and <strong>; everything else is escaped.
  function cleanText(value) {
    return String(value).slice(0, 2000)
      .replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/&lt;(\/?)(br|em|strong)\s*\/?&gt;/gi, (_, slash, tag) => `<${slash}${tag.toLowerCase()}>`);
  }

  function cleanPhoto(value) {
    const v = String(value || "").trim();
    if (/^[\w\-. %/]{1,200}\.(jpe?g|png|webp|avif|gif)$/i.test(v) && !v.includes("..")) return v;
    if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v) && v.length < 600000) return v;
    return "";
  }

  // Returns a complete, validated config. Unknown keys and bad values fall back to defaults.
  function sanitize(raw) {
    const r = isObject(raw) ? raw : {};
    const D = DEFAULTS;
    const colors = {};
    for (const key of Object.keys(D.colors)) {
      const v = r.colors?.[key];
      colors[key] = typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : D.colors[key];
    }
    const order = Array.isArray(r.sections?.order) ? r.sections.order.filter(k => k in SECTIONS) : [];
    for (const key of D.sections.order) if (!order.includes(key)) order.push(key);
    const text = { en: {}, pl: {} };
    for (const lang of ["en", "pl"]) {
      const source = r.text?.[lang];
      if (!isObject(source)) continue;
      for (const [key, value] of Object.entries(source)) {
        if (/^[A-Za-z0-9_]{1,60}$/.test(key) && typeof value === "string") text[lang][key] = value.slice(0, 2000);
      }
    }
    return {
      brand: String(r.brand || "").slice(0, 40),
      photo: cleanPhoto(r.photo),
      colors,
      fonts: {
        display: pick(r.fonts?.display, Object.keys(FONTS), D.fonts.display),
        sans: pick(r.fonts?.sans, Object.keys(FONTS), D.fonts.sans)
      },
      shape: {
        cardRadius: num(r.shape?.cardRadius, 0, 40, D.shape.cardRadius),
        buttonShape: pick(r.shape?.buttonShape, ["pill", "rounded", "square"], D.shape.buttonShape),
        buttonShadow: bool(r.shape?.buttonShadow, D.shape.buttonShadow)
      },
      spacing: { section: num(r.spacing?.section, 0.4, 1.8, 1) },
      hero: {
        photoSide: pick(r.hero?.photoSide, ["right", "left"], D.hero.photoSide),
        photoShape: pick(r.hero?.photoShape, ["arch", "rounded", "oval"], D.hero.photoShape),
        decorations: bool(r.hero?.decorations, D.hero.decorations),
        focusX: num(r.hero?.focusX, 0, 100, D.hero.focusX),
        focusY: num(r.hero?.focusY, 0, 100, D.hero.focusY)
      },
      features: {
        stickyCta: bool(r.features?.stickyCta, true),
        animations: bool(r.features?.animations, true),
        bento: bool(r.features?.bento, true)
      },
      sections: {
        order,
        hidden: Array.isArray(r.sections?.hidden) ? r.sections.hidden.filter(k => k in SECTIONS) : []
      },
      text
    };
  }

  function fontStack(name) {
    return `'${name}',${FONTS[name].serif ? "serif" : "sans-serif"}`;
  }

  function buildCss(c) {
    const D = DEFAULTS;
    const css = [];
    const root = [];
    for (const key of Object.keys(D.colors)) if (c.colors[key] !== D.colors[key]) root.push(`--${key}:${c.colors[key]}`);
    if (c.fonts.display !== D.fonts.display) root.push(`--display:${fontStack(c.fonts.display)}`);
    if (c.fonts.sans !== D.fonts.sans) root.push(`--sans:${fontStack(c.fonts.sans)}`);
    if (root.length) css.push(`:root{${root.join(";")}}`);

    if (c.shape.cardRadius !== D.shape.cardRadius) {
      css.push(`.offer,.price-card,.contact-card,.booking-panel,.calendar-frame{border-radius:${c.shape.cardRadius}px!important}`);
    }
    if (c.shape.buttonShape !== "pill") {
      css.push(`.nav-cta,.button{border-radius:${c.shape.buttonShape === "rounded" ? 14 : 4}px!important}`);
    }
    if (!c.shape.buttonShadow) css.push(".nav-cta,.button{box-shadow:none!important}");

    const k = c.spacing.section;
    if (k !== 1) {
      const pad = px => `padding-top:${Math.round(px * k)}px!important;padding-bottom:${Math.round(px * k)}px!important`;
      css.push(`.section{${pad(91)}}@media(max-width:800px){.section{${pad(72)}}}@media(min-width:1000px){.section{${pad(124)}}}`);
    }

    if (c.hero.photoSide === "left") {
      css.push("@media(min-width:801px){.hero .portrait-scene{order:-1}.hero{grid-template-columns:.98fr 1.02fr}}");
    }
    if (c.hero.photoShape === "rounded") css.push(".portrait-frame{border-radius:28px!important}");
    if (c.hero.photoShape === "oval") css.push(".portrait-frame{border-radius:50%!important}");
    if (!c.hero.decorations) css.push(".portrait-orbit,.portrait-sparkle,.portrait-note{display:none!important}");
    if (c.hero.focusX !== D.hero.focusX || c.hero.focusY !== D.hero.focusY) {
      css.push(`.tutor-photo{object-position:${c.hero.focusX}% ${c.hero.focusY}%!important}`);
    }
    if (!c.features.stickyCta) css.push(".sticky-cta{display:none!important}");
    return css.join("\n");
  }

  const root = document.documentElement;
  const editMode = new URLSearchParams(location.search).get("edit") === "1" && window.parent !== window;
  let current = sanitize(window.BRIGHTSIDE_SITE);
  let site = null; // { translations, defaultTranslations, setLanguage } from app.js
  const originals = {};

  function styleElement(id, tag = "style") {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement(tag);
      el.id = id;
      document.head.appendChild(el);
    }
    return el;
  }

  function applyFonts(c) {
    const families = [];
    for (const role of ["display", "sans"]) {
      const name = c.fonts[role];
      if (name !== DEFAULTS.fonts[role] && !families.includes(name)) families.push(name);
    }
    const link = document.getElementById("site-fonts");
    if (!families.length) { link?.remove(); return; }
    const href = "https://fonts.googleapis.com/css2?" + families
      .map(name => `family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@${FONTS[name].w}`).join("&") + "&display=swap";
    const el = link || Object.assign(document.createElement("link"), { id: "site-fonts", rel: "stylesheet" });
    if (el.getAttribute("href") !== href) el.setAttribute("href", href);
    if (!link) document.head.appendChild(el);
  }

  function applyStructure(c) {
    const main = document.querySelector("main");
    const hidden = new Set(c.sections.hidden);
    for (const key of c.sections.order) {
      const el = document.querySelector(SECTIONS[key]);
      if (!el) continue;
      main.appendChild(el);
      el.classList.toggle("site-hidden", hidden.has(key));
    }
    document.querySelectorAll(".nav>a:not(.nav-cta), .footer-links a").forEach(link => {
      const key = Object.keys(SECTIONS).find(k => SECTIONS[k] === link.getAttribute("href"));
      link.classList.toggle("site-hidden", Boolean(key) && hidden.has(key));
    });
  }

  function applyBrandAndPhoto(c) {
    document.querySelectorAll(".brand").forEach((brand, index) => {
      const node = brand.lastChild;
      if (node?.nodeType !== Node.TEXT_NODE) return;
      originals[`brand${index}`] ??= node.nodeValue;
      node.nodeValue = c.brand ? ` ${c.brand}` : originals[`brand${index}`];
    });
    const img = document.querySelector(".tutor-photo");
    if (img) {
      originals.photo ??= img.getAttribute("src");
      const wanted = c.photo || originals.photo;
      if (img.getAttribute("src") !== wanted) img.setAttribute("src", wanted);
    }
  }

  function applyText(c, rerender) {
    if (!site) return;
    for (const lang of ["en", "pl"]) {
      const defaults = site.defaultTranslations[lang];
      const target = site.translations[lang];
      for (const key of Object.keys(defaults)) {
        const override = c.text[lang][key];
        target[key] = typeof override === "string" ? cleanText(override) : defaults[key];
      }
    }
    if (rerender) site.setLanguage(root.lang);
  }

  function apply(config, { text = true } = {}) {
    current = sanitize(config);
    styleElement("site-custom").textContent = buildCss(current);
    applyFonts(current);
    applyStructure(current);
    applyBrandAndPhoto(current);
    document.querySelector(".cards")?.classList.toggle("is-flat", !current.features.bento);
    root.classList.toggle("no-anim", !current.features.animations);
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = current.colors.paper;
    if (text) applyText(current, true);
  }

  // ---- Editor integration ------------------------------------------------------
  function post(message) {
    window.parent.postMessage(message, "*");
  }

  function highlight(kind, key) {
    document.querySelectorAll(".edit-selected").forEach(el => el.classList.remove("edit-selected"));
    let target = null;
    if (kind === "text") target = document.querySelector(`[data-i18n="${CSS.escape(key)}"]`);
    if (kind === "section" && SECTIONS[key]) target = document.querySelector(SECTIONS[key]);
    if (target) {
      target.classList.add("edit-selected");
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function setupEditMode() {
    root.classList.add("edit-mode");
    styleElement("site-edit-style").textContent = `
      html.edit-mode [data-i18n]{cursor:pointer}
      html.edit-mode [data-i18n]:hover{outline:2px dashed #8b5cf6;outline-offset:2px}
      html.edit-mode .edit-selected{outline:2px solid #8b5cf6!important;outline-offset:3px}
      html.edit-mode section.edit-selected{outline-offset:-3px}
      html.edit-mode .reveal{opacity:1!important;transform:none!important}`;
    document.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const textEl = event.target.closest("[data-i18n]");
      if (textEl) { post({ type: "select", kind: "text", key: textEl.dataset.i18n }); highlight("text", textEl.dataset.i18n); return; }
      const sectionKey = Object.keys(SECTIONS).find(k => event.target.closest(SECTIONS[k]));
      if (sectionKey) { post({ type: "select", kind: "section", key: sectionKey }); highlight("section", sectionKey); }
    }, true);
    window.addEventListener("message", event => {
      if (event.source !== window.parent || !isObject(event.data)) return;
      const { type } = event.data;
      if (type === "config") apply(event.data.config);
      else if (type === "lang") site?.setLanguage(event.data.lang === "pl" ? "pl" : "en");
      else if (type === "select") highlight(event.data.kind, String(event.data.key || ""));
      else if (type === "hello") window.BrightsideCustomize.notifyReady();
    });
  }

  window.BrightsideCustomize = {
    attach(siteApi) {
      site = siteApi;
      applyText(current, false);
    },
    notifyReady() {
      if (!editMode || !site) return;
      post({
        defaultPhoto: originals.photo,
        type: "ready",
        config: current,
        defaults: DEFAULTS,
        fonts: Object.keys(FONTS),
        sections: Object.keys(SECTIONS),
        usedKeys: [...new Set([...document.querySelectorAll("[data-i18n]")].map(el => el.dataset.i18n))].concat(["pageTitle", "description"]),
        translations: site.translations,
        defaultTranslations: site.defaultTranslations,
        lang: root.lang
      });
    }
  };

  if (editMode) setupEditMode();
  apply(window.BRIGHTSIDE_SITE, { text: false });
})();
