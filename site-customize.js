// Applies window.BRIGHTSIDE_SITE (written by editor.html) to the page.
// Also powers the live preview: when the page is loaded inside the editor
// (index.html?edit=1 in an iframe) it accepts config messages from the parent,
// lets you click elements to select them and can outline what a setting affects.
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
    booking: "#booking", opinions: "#opinions", reviews: "#reviews", contact: "#contact"
  };
  const SECTION_ORDER = Object.keys(SECTIONS);

  // Single elements that can be switched off in the editor.
  const ITEMS = {
    langPicker: { section: "header", label: "Przełącznik języka", selector: ".language-picker" },
    navCta: { section: "header", label: "Przycisk w menu", selector: ".topbar .nav-cta" },
    eyebrow: { section: "hero", label: "Mały napis nad nagłówkiem", selector: ".hero .eyebrow" },
    heroBio: { section: "hero", label: "Krótkie bio korepetytora", selector: ".hero .tutor-quick-info" },
    linkedin: { section: "hero", label: "Przycisk LinkedIn", selector: ".hero .linkedin-link" },
    heroSecondary: { section: "hero", label: "Przycisk „Zobacz lekcje”", selector: ".hero-actions .is-outline" },
    heroProof: { section: "hero", label: "Linijka pod przyciskami", selector: ".hero .proof" },
    heroCaption: { section: "hero", label: "Podpis na zdjęciu", selector: ".portrait-caption" },
    stat1: { section: "stats", label: "Liczba 1", selector: ".stats .stat:nth-child(1)" },
    stat2: { section: "stats", label: "Liczba 2", selector: ".stats .stat:nth-child(2)" },
    stat3: { section: "stats", label: "Liczba 3", selector: ".stats .stat:nth-child(3)" },
    card1: { section: "lessons", label: "Karta oferty 1", selector: ".cards .offer:nth-child(1)" },
    card2: { section: "lessons", label: "Karta oferty 2", selector: ".cards .offer:nth-child(2)" },
    card3: { section: "lessons", label: "Karta oferty 3", selector: ".cards .offer:nth-child(3)" },
    priceOnline: { section: "pricing", label: "Karta ceny: online", selector: ".price-card:nth-child(1)" },
    priceOffline: { section: "pricing", label: "Karta ceny: stacjonarnie", selector: ".price-card:nth-child(2)" },
    pricingNote: { section: "pricing", label: "Uwaga pod cennikiem", selector: ".pricing-note" },
    pricingCta: { section: "pricing", label: "Przycisk pod cennikiem", selector: ".pricing-cta" },
    bookingMeta: { section: "booking", label: "Plakietka „60 minut”", selector: ".booking-meta" },
    bookingSteps: { section: "booking", label: "Lista kroków rezerwacji", selector: ".booking-steps" },
    rating: { section: "reviews", label: "Blok „1:1” po prawej", selector: ".rating" },
    footerTag: { section: "footer", label: "Hasło w stopce", selector: ".footer > span:nth-child(2)" },
    footerLinks: { section: "footer", label: "Linki w stopce", selector: ".footer-links" }
  };

  // Real brand marks from Simple Icons (CC0). Rendered as a glyph on a brand-coloured disc.
  const TOOLS = {
    discord: { label: "Discord", bg: "#5865f2", fg: "#ffffff", path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" },
    miro: { label: "Miro", bg: "#ffd02f", fg: "#050038", path: "M17.392 0H13.9L17 4.808 10.444 0H6.949l3.102 6.3L3.494 0H0l3.05 8.131L0 24h3.494L10.05 6.985 6.949 24h3.494L17 5.494 13.899 24h3.493L24 3.672 17.392 0z" },
    googlemeet: { label: "Google Meet", bg: "#e3f1e8", fg: "#00832d", path: "M5.53 2.13 0 7.75h5.53zm.398 0v5.62h7.608v3.65l5.47-4.45c-.014-1.22.031-2.25-.025-3.46-.148-1.09-1.287-1.47-2.236-1.36zM23.1 4.32c-.802.295-1.358.995-2.047 1.49-2.506 2.05-4.982 4.12-7.468 6.19 3.025 2.59 6.04 5.18 9.065 7.76 1.218.671 1.428-.814 1.328-1.64v-13a.828.828 0 0 0-.877-.825zM.038 8.15v7.7h5.53v-7.7zm13.577 8.1H6.008v5.62c3.864-.006 7.737.011 11.58-.009 1.02-.07 1.618-1.12 1.468-2.07v-2.51l-5.47-4.68v3.65zm-13.577 0c.02 1.44-.041 2.88.033 4.31.162.948 1.158 1.43 2.047 1.31h3.464v-5.62z" },
    zoom: { label: "Zoom", bg: "#0b5cff", fg: "#ffffff", path: "M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" },
    teams: { label: "Microsoft Teams", bg: "#6264a7", fg: "#ffffff", path: "M20.625 8.127q-.55 0-1.025-.205-.475-.205-.832-.563-.358-.357-.563-.832Q18 6.053 18 5.502q0-.54.205-1.02t.563-.837q.357-.358.832-.563.474-.205 1.025-.205.54 0 1.02.205t.837.563q.358.357.563.837.205.48.205 1.02 0 .55-.205 1.025-.205.475-.563.832-.357.358-.837.563-.48.205-1.02.205zm0-3.75q-.469 0-.797.328-.328.328-.328.797 0 .469.328.797.328.328.797.328.469 0 .797-.328.328-.328.328-.797 0-.469-.328-.797-.328-.328-.797-.328zM24 10.002v5.578q0 .774-.293 1.46-.293.685-.803 1.194-.51.51-1.195.803-.686.293-1.459.293-.445 0-.908-.105-.463-.106-.85-.329-.293.95-.855 1.729-.563.78-1.319 1.336-.756.557-1.67.861-.914.305-1.898.305-1.148 0-2.162-.398-1.014-.399-1.805-1.102-.79-.703-1.312-1.664t-.674-2.086h-5.8q-.411 0-.704-.293T0 16.881V6.873q0-.41.293-.703t.703-.293h8.59q-.34-.715-.34-1.5 0-.727.275-1.365.276-.639.75-1.114.475-.474 1.114-.75.638-.275 1.365-.275t1.365.275q.639.276 1.114.75.474.475.75 1.114.275.638.275 1.365t-.275 1.365q-.276.639-.75 1.113-.475.475-1.114.75-.638.276-1.365.276-.188 0-.375-.024-.188-.023-.375-.058v1.078h10.875q.469 0 .797.328.328.328.328.797zM12.75 2.373q-.41 0-.78.158-.368.158-.638.434-.27.275-.428.639-.158.363-.158.773 0 .41.158.78.159.368.428.638.27.27.639.428.369.158.779.158.41 0 .773-.158.364-.159.64-.428.274-.27.433-.639.158-.369.158-.779 0-.41-.158-.773-.159-.364-.434-.64-.275-.275-.639-.433-.363-.158-.773-.158zM6.937 9.814h2.25V7.94H2.814v1.875h2.25v6h1.875zm10.313 7.313v-6.75H12v6.504q0 .41-.293.703t-.703.293H8.309q.152.809.556 1.5.405.691.985 1.19.58.497 1.318.779.738.281 1.582.281.926 0 1.746-.352.82-.351 1.436-.966.615-.616.966-1.43.352-.815.352-1.752zm5.25-1.547v-5.203h-3.75v6.855q.305.305.691.452.387.146.809.146.469 0 .879-.176.41-.175.715-.48.304-.305.48-.715t.176-.879Z" },
    skype: { label: "Skype", bg: "#00aff0", fg: "#ffffff", path: "M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.354-1.429l-3.576-.895c-2.88-.724-3.403-2.286-3.403-3.751 0-3.047 2.861-4.191 5.549-4.191 2.471 0 5.393 1.373 5.393 3.199 0 .784-.688 1.24-1.453 1.24-1.469 0-1.198-2.037-4.164-2.037-1.469 0-2.292.664-2.292 1.617s1.153 1.258 2.157 1.487l2.637.587c2.891.649 3.624 2.346 3.624 3.944 0 2.476-1.902 4.324-5.722 4.324m11.084-4.882l-.029.135-.044-.24c.015.045.044.074.059.12.12-.675.181-1.363.181-2.052 0-1.529-.301-3.012-.898-4.42-.569-1.348-1.395-2.562-2.427-3.596-1.049-1.033-2.247-1.856-3.595-2.426-1.318-.631-2.801-.93-4.328-.93-.72 0-1.444.07-2.143.204l.119.06-.239-.033.119-.025C8.91.274 7.829 0 6.731 0c-1.789 0-3.47.698-4.736 1.967C.729 3.235.032 4.923.032 6.716c0 1.143.292 2.265.844 3.258l.02-.124.041.239-.06-.115c-.114.645-.172 1.299-.172 1.955 0 1.53.3 3.017.884 4.416.568 1.362 1.378 2.576 2.427 3.609 1.034 1.05 2.247 1.857 3.595 2.442 1.394.6 2.877.898 4.404.898.659 0 1.334-.06 1.977-.179l-.119-.062.24.046-.135.03c1.002.569 2.126.871 3.294.871 1.783 0 3.459-.69 4.733-1.963 1.259-1.259 1.962-2.951 1.962-4.749 0-1.138-.299-2.262-.853-3.266" },
    whatsapp: { label: "WhatsApp", bg: "#25d366", fg: "#ffffff", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" }
  };

  const DEFAULTS = {
    brand: "",
    photo: "",
    colors: { ink: "#202821", muted: "#69716a", paper: "#f8f7f2", green: "#d9f36a", deep: "#243b30", line: "#e7e7df" },
    fonts: { display: "Manrope", sans: "DM Sans" },
    shape: { cardRadius: 20, buttonShape: "pill", buttonShadow: true },
    spacing: { section: 1 },
    layout: { contentWidth: 1440 },
    hero: { photoSide: "right", photoShape: "arch", decorations: true, focusX: 57, focusY: 50 },
    features: { stickyCta: true, animations: true, bento: true },
    cta: { target: "auto" },
    contact: { phone: "", email: "", linkedin: "", calendarUrl: "", revealPhone: false },
    tools: ["discord", "miro", "googlemeet"],
    testimonials: [],
    sections: { order: SECTION_ORDER.slice(), hidden: [] },
    hiddenItems: [],
    sectionStyle: Object.fromEntries(SECTION_ORDER.map(k => [k, { bg: "", gap: 0 }])),
    textStyle: {},
    text: { en: {}, pl: {} }
  };

  const isObject = value => value && typeof value === "object" && !Array.isArray(value);
  const pick = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
  const num = (value, min, max, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const bool = (value, fallback) => typeof value === "boolean" ? value : fallback;
  const hex = (value, fallback) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : fallback;
  const str = (value, max) => String(value ?? "").trim().slice(0, max);

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

  function cleanUrl(value, { host, prefix } = {}) {
    const v = str(value, 600);
    if (!v) return "";
    try {
      const url = new URL(v);
      if (url.protocol !== "https:") return "";
      if (host && url.hostname !== host) return "";
      if (prefix && !url.pathname.startsWith(prefix)) return "";
      return url.href;
    } catch { return ""; }
  }

  // Returns a complete, validated config. Unknown keys and bad values fall back to defaults.
  function sanitize(raw) {
    const r = isObject(raw) ? raw : {};
    const D = DEFAULTS;

    const colors = {};
    for (const key of Object.keys(D.colors)) colors[key] = hex(r.colors?.[key], D.colors[key]);

    // Keep the saved order, slotting newly added sections after their default predecessor.
    const order = [...new Set(Array.isArray(r.sections?.order) ? r.sections.order.filter(k => k in SECTIONS) : [])];
    SECTION_ORDER.forEach((key, i) => {
      if (order.includes(key)) return;
      let at = 0;
      for (let j = i - 1; j >= 0; j--) {
        const p = order.indexOf(SECTION_ORDER[j]);
        if (p >= 0) { at = p + 1; break; }
      }
      order.splice(at, 0, key);
    });

    const text = { en: {}, pl: {} };
    for (const lang of ["en", "pl"]) {
      const source = r.text?.[lang];
      if (!isObject(source)) continue;
      for (const [key, value] of Object.entries(source)) {
        if (/^[A-Za-z0-9_]{1,60}$/.test(key) && typeof value === "string") text[lang][key] = value.slice(0, 2000);
      }
    }

    const textStyle = {};
    if (isObject(r.textStyle)) {
      for (const [key, value] of Object.entries(r.textStyle).slice(0, 120)) {
        if (!/^[A-Za-z0-9_]{1,60}$/.test(key) || !isObject(value)) continue;
        const style = {
          scale: Math.round(num(value.scale, 0.6, 2, 1) * 100) / 100,
          weight: [400, 500, 600, 700, 800].includes(Number(value.weight)) ? Number(value.weight) : 0,
          color: hex(value.color, "")
        };
        if (style.scale !== 1 || style.weight || style.color) textStyle[key] = style;
      }
    }

    const sectionStyle = {};
    for (const key of SECTION_ORDER) {
      sectionStyle[key] = { bg: hex(r.sectionStyle?.[key]?.bg, ""), gap: Math.round(num(r.sectionStyle?.[key]?.gap, 0, 160, 0)) };
    }

    const testimonials = [];
    if (Array.isArray(r.testimonials)) {
      for (const item of r.testimonials.slice(0, 6)) {
        if (!isObject(item) || !str(item.text, 400)) continue;
        testimonials.push({ text: str(item.text, 400), author: str(item.author, 60), role: str(item.role, 80) });
      }
    }

    const tools = [...new Set(Array.isArray(r.tools) ? r.tools.filter(id => id in TOOLS) : D.tools)].slice(0, 8);
    const phone = str(r.contact?.phone, 24);
    const email = str(r.contact?.email, 80);

    return {
      brand: str(r.brand, 40),
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
      layout: { contentWidth: Math.round(num(r.layout?.contentWidth, 960, 1680, D.layout.contentWidth)) },
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
      cta: { target: pick(r.cta?.target, ["auto", "booking", "contact"], "auto") },
      contact: {
        phone: /^\+?[0-9 ()\-.]{6,24}$/.test(phone) ? phone : "",
        email: /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email) ? email : "",
        linkedin: cleanUrl(r.contact?.linkedin),
        calendarUrl: cleanUrl(r.contact?.calendarUrl, { host: "calendar.google.com", prefix: "/calendar/appointments/schedules/" }),
        revealPhone: bool(r.contact?.revealPhone, false)
      },
      tools,
      testimonials,
      sections: {
        order,
        hidden: Array.isArray(r.sections?.hidden) ? r.sections.hidden.filter(k => k in SECTIONS) : []
      },
      hiddenItems: Array.isArray(r.hiddenItems) ? [...new Set(r.hiddenItems.filter(id => id in ITEMS))] : [],
      sectionStyle,
      textStyle,
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
      css.push(`.offer,.price-card,.contact-card,.booking-panel,.has-calendar .booking-message,.calendar-frame,.opinion{border-radius:${c.shape.cardRadius}px!important}`);
    }
    if (c.shape.buttonShape !== "pill") {
      css.push(`.nav-cta,.button{border-radius:${c.shape.buttonShape === "rounded" ? 14 : 4}px!important}`);
    }
    if (!c.shape.buttonShadow) css.push(".nav-cta,.button,.calendar-frame{box-shadow:none!important}");

    const k = c.spacing.section;
    if (k !== 1) {
      const pad = px => `padding-top:${Math.round(px * k)}px!important;padding-bottom:${Math.round(px * k)}px!important`;
      css.push(`.section{${pad(91)}}@media(max-width:800px){.section{${pad(72)}}}@media(min-width:1000px){.section{${pad(124)}}}`);
    }
    if (c.layout.contentWidth !== D.layout.contentWidth) {
      css.push(`@media(min-width:1000px){.wrap{width:min(${c.layout.contentWidth}px,calc(100% - 96px))}}`);
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

    for (const key of SECTION_ORDER) {
      const { bg, gap } = c.sectionStyle[key];
      const sel = SECTIONS[key];
      if (bg) css.push(`${sel}{background:${bg}!important;box-shadow:0 0 0 100vmax ${bg}!important;clip-path:inset(0 -100vmax)!important}`);
      if (gap) css.push(`${sel}{margin-top:${gap}px!important;margin-bottom:${gap}px!important}`);
    }
    for (const [key, style] of Object.entries(c.textStyle)) {
      const rules = [];
      if (style.scale !== 1) rules.push(`zoom:${style.scale}`);
      if (style.weight) rules.push(`font-weight:${style.weight}!important`);
      if (style.color) rules.push(`color:${style.color}!important`);
      css.push(`[data-i18n="${key}"]{${rules.join(";")}}`);
    }
    return css.join("\n");
  }

  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const editMode = new URLSearchParams(location.search).get("edit") === "1" && window.parent !== window;
  let current = sanitize(window.BRIGHTSIDE_SITE);
  let site = null; // { translations, defaultTranslations, setLanguage } from app.js
  let forcedPhone = false;
  const originals = {};
  const SVG_NS = "http://www.w3.org/2000/svg";

  function styleElement(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    return el;
  }

  // Brand logos live in a runtime sprite so index.html stays small.
  function injectToolSprite() {
    if (document.getElementById("tool-sprite")) return;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.id = "tool-sprite";
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    svg.innerHTML = Object.entries(TOOLS).map(([id, t]) => `<symbol id="b-${id}" viewBox="0 0 24 24"><path d="${t.path}"/></symbol>`).join("");
    document.body.prepend(svg);
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

  function applyFavicon(c) {
    const link = $('link[rel="icon"]');
    if (!link) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${c.colors.green}"/><path d="M16 7v18M8.2 11.5l15.6 9M8.2 20.5l15.6-9" stroke="${c.colors.deep}" stroke-width="3" stroke-linecap="round"/></svg>`;
    link.setAttribute("href", "data:image/svg+xml," + encodeURIComponent(svg));
  }

  function applyStructure(c) {
    const main = $("main");
    const hidden = new Set(c.sections.hidden);
    const hasOpinions = c.testimonials.length > 0;
    const isHidden = key => hidden.has(key) || (key === "opinions" && !hasOpinions);
    for (const key of c.sections.order) {
      const el = $(SECTIONS[key]);
      if (!el) continue;
      main.appendChild(el);
      el.classList.toggle("site-hidden", isHidden(key));
    }
    const hashToKey = Object.fromEntries(Object.entries(SECTIONS).filter(([, s]) => s.startsWith("#")).map(([k, s]) => [s, k]));
    $$(".nav>a:not(.nav-cta), .footer-links a").forEach(link => {
      link.dataset.key ??= hashToKey[link.getAttribute("href")] || "";
      const key = link.dataset.key;
      if (!key) return;
      if (key === "reviews") {
        // "Opinions" in the menu points at the testimonials once there are any.
        const target = !isHidden("opinions") ? "#opinions" : "#reviews";
        link.setAttribute("href", target);
        link.classList.toggle("site-hidden", isHidden("reviews") && isHidden("opinions"));
      } else {
        link.classList.toggle("site-hidden", isHidden(key));
      }
    });
    const hiddenItems = new Set(c.hiddenItems);
    for (const [id, item] of Object.entries(ITEMS)) {
      $$(item.selector).forEach(el => el.classList.toggle("site-hidden", hiddenItems.has(id)));
    }
  }

  function applyBrandAndPhoto(c) {
    $$(".brand").forEach((brand, index) => {
      const node = brand.lastChild;
      if (node?.nodeType !== Node.TEXT_NODE) return;
      originals[`brand${index}`] ??= node.nodeValue;
      node.nodeValue = c.brand ? ` ${c.brand}` : originals[`brand${index}`];
    });
    const img = $(".tutor-photo");
    if (img) {
      originals.photo ??= img.getAttribute("src");
      const wanted = c.photo || originals.photo;
      if (img.getAttribute("src") !== wanted) img.setAttribute("src", wanted);
    }
  }

  function applyTools(c) {
    const host = $("#tool-chips");
    if (!host) return;
    const key = c.tools.join(",");
    if (host.dataset.key === key) return;
    host.dataset.key = key;
    host.replaceChildren();
    for (const id of c.tools) {
      const tool = TOOLS[id];
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.style.setProperty("--tool-bg", tool.bg);
      chip.style.setProperty("--tool-fg", tool.fg);
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("class", "brand-ico");
      svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = `<use href="#b-${id}"/>`;
      chip.append(svg, tool.label);
      host.append(chip);
    }
  }

  function applyOpinions(c) {
    const grid = $("#opinion-grid");
    if (!grid) return;
    grid.replaceChildren();
    for (const item of c.testimonials) {
      const figure = document.createElement("figure");
      figure.className = "opinion";
      const quote = document.createElement("blockquote");
      quote.textContent = item.text;
      const caption = document.createElement("figcaption");
      const avatar = document.createElement("span");
      avatar.className = "opinion-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = (item.author || "★").trim().charAt(0).toUpperCase();
      const who = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = item.author;
      const role = document.createElement("small");
      role.textContent = item.role;
      who.append(name, role);
      caption.append(avatar, who);
      figure.append(quote, caption);
      grid.append(figure);
    }
  }

  function applyContact(c) {
    originals.phone ??= window.BRIGHTSIDE_PHONE_NUMBER || "";
    originals.calendar ??= window.BRIGHTSIDE_CALENDAR_URL || "";
    window.BRIGHTSIDE_PHONE_NUMBER = c.contact.phone || originals.phone;
    window.BRIGHTSIDE_CALENDAR_URL = c.contact.calendarUrl || originals.calendar;

    const mail = $("#contact-email");
    if (mail) {
      mail.hidden = !c.contact.email;
      if (c.contact.email) mail.href = `mailto:${c.contact.email}`;
    }
    const linkedin = $(".linkedin-link");
    if (linkedin) {
      originals.linkedin ??= linkedin.getAttribute("href");
      linkedin.setAttribute("href", c.contact.linkedin || originals.linkedin);
    }

    const rawPhone = String(window.BRIGHTSIDE_PHONE_NUMBER || "").trim();
    const tel = rawPhone.replace(/[^\d+]/g, "");
    const valid = /^\+?\d{6,15}$/.test(tel);
    const link = $("#phone-number");
    const button = $("#show-phone");
    if (!link || !button) return;
    if (c.contact.revealPhone && valid) {
      link.href = `tel:${tel}`;
      link.querySelector("span").textContent = rawPhone;
      link.hidden = false;
      button.hidden = true;
      $("#phone-missing").hidden = true;
      forcedPhone = true;
    } else {
      button.hidden = false;
      if (forcedPhone) { link.hidden = true; forcedPhone = false; }
    }
  }

  function applyCta(lang) {
    const target = current.cta.target;
    const forced = target === "booking" ? "#booking" : target === "contact" ? "#contact" : null;
    $$("[data-cta]").forEach(link => {
      link.setAttribute("href", forced ?? (link.dataset.cta === "main" && lang === "pl" ? "#contact" : "#booking"));
    });
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
    injectToolSprite();
    styleElement("site-custom").textContent = buildCss(current);
    applyFonts(current);
    applyFavicon(current);
    applyStructure(current);
    applyBrandAndPhoto(current);
    applyTools(current);
    applyOpinions(current);
    applyContact(current);
    applyCta(root.lang);
    $(".cards")?.classList.toggle("is-flat", !current.features.bento);
    root.classList.toggle("no-anim", !current.features.animations);
    const theme = $('meta[name="theme-color"]');
    if (theme) theme.content = current.colors.paper;
    if (text) applyText(current, true);
  }

  // ---- Editor integration ------------------------------------------------------
  function post(message) {
    window.parent.postMessage(message, "*");
  }

  function highlight(kind, key) {
    $$(".edit-selected").forEach(el => el.classList.remove("edit-selected"));
    let target = null;
    if (kind === "text") target = $(`[data-i18n="${CSS.escape(key)}"]`);
    if (kind === "section" && SECTIONS[key]) target = $(SECTIONS[key]);
    if (kind === "item" && ITEMS[key]) target = $(ITEMS[key].selector);
    if (target) {
      target.classList.add("edit-selected");
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  // Outline of the elements a setting affects, drawn above the page.
  let flash = null;
  let flashFrame = 0;
  let overlay = null;
  function flashTargets() {
    const seen = new Set();
    for (const selector of flash.selectors) {
      let found = [];
      try { found = $$(selector); } catch { /* ignore bad selector */ }
      for (const el of found) if (seen.size < 60) seen.add(el);
    }
    return [...seen].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  }
  function drawFlash() {
    flashFrame = 0;
    if (!flash) return;
    const targets = flashTargets();
    const boxes = [...overlay.children];
    while (boxes.length > targets.length + 1) boxes.pop().remove();
    while (overlay.children.length < targets.length + 1) {
      const box = document.createElement("div");
      box.className = "edit-box";
      overlay.append(box);
    }
    const badge = overlay.children[targets.length];
    badge.className = "edit-badge";
    badge.textContent = targets.length ? flash.label : `${flash.label} (${flash.note || "teraz niewidoczne w podglądzie"})`;
    targets.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const box = overlay.children[i];
      box.className = "edit-box";
      if (box.textContent) box.textContent = "";
      box.style.cssText = `left:${r.left + scrollX}px;top:${r.top + scrollY}px;width:${r.width}px;height:${r.height}px`;
    });
    if (targets.length) {
      const r = targets[0].getBoundingClientRect();
      badge.style.cssText = `left:${Math.max(4, r.left + scrollX)}px;top:${Math.max(4, r.top + scrollY - 26)}px`;
    } else {
      badge.style.cssText = `left:${scrollX + 12}px;top:${scrollY + 12}px`;
    }
    flashFrame = requestAnimationFrame(drawFlash);
  }
  function startFlash(message) {
    const selectors = Array.isArray(message.selectors) ? message.selectors.filter(s => typeof s === "string" && s.length < 300).slice(0, 12) : [];
    if (!selectors.length) return;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "edit-overlay";
      document.body.append(overlay);
    }
    flash = { selectors, label: str(message.label, 80), note: str(message.note, 80) };
    if (message.scroll !== false) {
      const first = flashTargets()[0];
      if (first) {
        const r = first.getBoundingClientRect();
        if (r.bottom < 60 || r.top > innerHeight - 80) first.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    if (!flashFrame) flashFrame = requestAnimationFrame(drawFlash);
  }
  function stopFlash() {
    flash = null;
    cancelAnimationFrame(flashFrame);
    flashFrame = 0;
    overlay?.replaceChildren();
  }

  function setupEditMode() {
    root.classList.add("edit-mode");
    styleElement("site-edit-style").textContent = `
      html.edit-mode [data-i18n]{cursor:pointer}
      html.edit-mode [data-i18n]:hover{outline:2px dashed #8b5cf6;outline-offset:2px}
      html.edit-mode .edit-selected{outline:2px solid #8b5cf6!important;outline-offset:3px}
      html.edit-mode section.edit-selected{outline-offset:-3px}
      html.edit-mode .reveal{opacity:1!important;transform:none!important}
      #edit-overlay{position:absolute;left:0;top:0;width:0;height:0;z-index:2147483000;pointer-events:none}
      #edit-overlay .edit-box{position:absolute;box-sizing:border-box;border:2px solid #0d99ff;border-radius:6px;background:rgba(13,153,255,.14);box-shadow:0 0 0 4px rgba(13,153,255,.18);animation:edit-pulse 1.1s ease-in-out infinite}
      #edit-overlay .edit-badge{position:absolute;background:#0d99ff;color:#fff;font:600 12px/1 system-ui,sans-serif;padding:5px 8px;border-radius:6px;white-space:nowrap;max-width:80vw;overflow:hidden;text-overflow:ellipsis}
      @keyframes edit-pulse{50%{background:rgba(13,153,255,.26)}}`;
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
      else if (type === "flash") startFlash(event.data);
      else if (type === "unflash") stopFlash();
      else if (type === "hello") window.BrightsideCustomize.notifyReady();
    });
  }

  window.BrightsideCustomize = {
    attach(siteApi) {
      site = siteApi;
      applyText(current, false);
    },
    applyCta,
    notifyReady() {
      if (!editMode || !site) return;
      post({
        type: "ready",
        defaultPhoto: originals.photo,
        config: current,
        defaults: DEFAULTS,
        fonts: Object.keys(FONTS),
        sections: SECTION_ORDER,
        sectionSelectors: SECTIONS,
        items: ITEMS,
        tools: Object.fromEntries(Object.entries(TOOLS).map(([id, t]) => [id, { label: t.label, bg: t.bg, fg: t.fg, path: t.path }])),
        usedKeys: [...new Set($$("[data-i18n]").map(el => el.dataset.i18n))].concat(["pageTitle", "description"]),
        translations: site.translations,
        defaultTranslations: site.defaultTranslations,
        lang: root.lang
      });
    }
  };

  if (editMode) setupEditMode();
  apply(window.BRIGHTSIDE_SITE, { text: false });
})();
