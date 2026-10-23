# BH Chabad site theme (lightbhchabad.org → bhchabad.org)

Custom design for the ChabadOne Sites 6 site of Chabad Jewish Center of Bloomfield Hills
(Site ID 10077). **Do not touch PrincetonChabad.org** (same ChabadOne login).

## Where the code lives
- **Live copy:** ChabadOne › Sites › Settings › General Settings › Advanced Settings
  - Custom Header Code = `dist/header.html` (fonts, ChabadOne modern-form CSS/JS, fail-safe script, all theme CSS)
  - Custom Footer Code = `dist/footer.html` (theme JS)
- **Source of truth:** `src/theme.css`, `src/theme.js`, `build.py` (also saved in the Claude project under `theme/`).
- GitHub (`rabbi-dubov/bhchabad-site`) is created but **not used yet**: Cowork sessions can't attach repos.
  Switch later by pushing these files and replacing the boxes with small loader tags.

## Deploying a change (what Claude does)
1. Edit `src/*`, run `python3 build.py` (checks: no `&` or `<` in CSS, no `]]>` in JS).
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
