# BH Chabad site theme (lightbhchabad.org → bhchabad.org)

Custom design for the ChabadOne Sites 6 site of Chabad Jewish Center of Bloomfield Hills
(Site ID 10077). **Do not touch PrincetonChabad.org** (same ChabadOne login).

## Where the code lives
- **GitHub (source of truth):** github.com/rabbi-dubov/bhchabad-site
  - `src/theme.css`, `src/theme.js` = source; `build.py` builds them.
  - `live/` = what every visitor gets; `test/` = what you see after adding `?cc=test` to any page URL.
  - `loader/header.html` + `loader/footer.html` = small tags pasted **once** into ChabadOne ›
    Settings › General Settings › Custom Header / Footer Code. They load `live/` (or `test/`) from jsDelivr:
    `https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/live/theme.min.css` (and `.js`).
  - `?cc=off` turns the theme off for that visitor only; `?cc=live` returns to normal.
- **Fallback (old method):** `python3 build.py snippets` writes `dist/header.html` / `dist/footer.html`
  with everything inline, to paste into the same boxes if jsDelivr ever fails.

## Deploying a change (GitHub method)
1. Edit `src/*`, run `python3 build.py test` (checks: no `&` or `<` in CSS, no `]]>` in JS). Commit + push.
2. Purge jsDelivr: open `https://purge.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/test/theme.min.css`
   and `.../test/theme.min.js`.
3. Check the site with `?cc=test` (one check per change; JLI registration page too, never submit).
4. When good: `python3 build.py promote` (copies test/ to live/), commit + push, purge the two `live/` URLs.
5. Visitors get the new version within minutes (browser cache). No ChabadOne save/publish needed.

## Deploying via the paste-everything method (fallback)

1. Edit `src/*`, run `python3 build.py snippets` (checks: no `&` or `<` in CSS, no `]]>` in JS).
2. In Site Control (lightbhchabad.org selected!) open `/platform/sitecontrol/admin/wizards/sitetitles.asp` top-level.
3. Put the new header/footer text into `#customheader` / `#customfooter`.
4. Save = set `#saveHeaderCodeWizard` to `1` and call `doSubmit('tag')` (this is exactly what the
   disclaimer's Ok button does; the disclaimer checkbox is client-side only). Page shows "pending".
5. Publish = set `#previewstate` to `1` and call `doSubmit('publish')`.
6. Verify on the live site, especially the JLI registration page:
   `/tools/events/register.asp?eventid=23504&new=true` (select category → Continue → all fields visible).

### Gotchas learned
- ChabadOne **HTML-decodes entities** in these boxes on save (`&amp;` → `&`, `&quot;` → `"`). Don't use entities.
- The disclaimer modal's Ok handler is only attached on a real mouseup, so scripted clicks don't save.
- The Preview popup does not show pending header code; testing is done by client-side injection instead.
- `default-theme.css` declares `--theme-*` variables but hard-codes colors, so overriding variables does nothing.
- The platform forces Muli on every element. Our base rule sets `font-family: inherit` on every element
  (very specific selector), so any rule that sets the serif must use `var(--cc-font-head) !important`.
- Fonts: headings DM Serif Display (only weight 400 exists, never bold it), body Instrument Sans 400–700.
  Corners 6–8px (`--cc-radius*`), buttons 6px (`--cc-pill`).
- Registration page: name inputs have no `type` attribute; input rules use `input:not([type=radio])...` instead of `[type=text]`.

## Rollback
Empty both boxes, save, publish (steps 3–5). Or set `CC_ENABLED = false` in `src/theme.js` and redeploy the footer.

## Homepage
`theme.js` builds the homepage from the **live ChabadOne widgets** (edit content in Site Control › Home Page):
promo slider → hero; "I would like to…" icons → quick-links bar; candle-lighting feed → This-week band;
Event Reservations page + Upcoming Events feed → events carousel; Message → intro; Programs → photo cards;
Latest Photos; Subscribe. Missing widgets are simply skipped.

## Content classes for pages (use in page HTML, XHTML-safe)
`cc-info` + `cc-info__label/__value`, `cc-lessons` (ol), `cc-faq` (details/summary), `cc-cta`,
`cc-grid` / `cc-grid--2` / `cc-grid--4`, `cc-card`, `cc-btn` (+ `--sand`, `--ghost`), `cc-link`, `cc-chip`.
