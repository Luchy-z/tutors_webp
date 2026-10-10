# tutors_webp

Static one-page site for a maths and physics tutor (EN/PL). No build step: open `index.html`.

## Site editor (branch `ui-redesign`)

`editor.html` is a small visual editor for the page. Open it in Chrome or Edge, next to `index.html`.

- **Live preview** with Desktop / Tablet / Phone sizes and an EN / PL switch.
- **Design tab:** colors, fonts, card radius, button shape and shadow, section spacing, hero layout (photo side, shape, crop), photo upload, bento offers, sticky CTA, animations.
- **Page structure (left):** drag or use the arrows to reorder sections, the eye hides a section and its menu link.
- **Text tab:** click any text in the preview to edit it (EN and PL), or search the list of all texts.
- Undo / redo (Ctrl+Z / Ctrl+Shift+Z), "Hold: original" to compare with the built-in design, auto-saved draft.
- **Save** (Ctrl+S) writes `site-config.js` (pick the file next to `index.html` once). Browsers without file access fall back to a download; replace the file by hand.

The site reads `site-config.js` through `site-customize.js`; with an empty config it looks exactly like the built-in design.
Settings are validated on load (hex colors, a font whitelist, numeric ranges, and text limited to `<br>`, `<em>`, `<strong>`).

Not covered by the editor: a few tint colors that are still hard-coded in `styles.css`, and the phone number / calendar URL (those stay in `calendar-config.js`).
