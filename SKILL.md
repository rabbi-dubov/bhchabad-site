---
name: chabadone-site-builder
description: Build, restyle and maintain the BH Chabad ChabadOne site (lightbhchabad.org, later bhchabad.org) with site-wide custom header/footer code. Use for any work on that website's design, pages, forms, homepage, deploys or migration from Wix.
---

# ChabadOne site builder (BH Chabad)

Everything learned while building the Chabad Jewish Center of Bloomfield Hills site on ChabadOne Sites 6.
Follow it before touching the site. It improves itself: see "Self-updating" at the end.

## 0. Start of every session (do this first)
1. Read the living playbook in the Claude project: `claude/04-chabadone-playbook.md`.
   It holds lessons newer than this skill. If it contradicts this file, the playbook wins (it is newer).
2. Read the project source of truth: `theme/theme.css`, `theme/theme.js`, `theme/build.py`, `theme/mkpatch.py`, `theme/README.md`.
   The local git repo in the container may be gone; rebuild it from these docs (`src/theme.css`, `src/theme.js`, `build.py`, `tools/mkpatch.py`), `git init`, and commit once as the "live" baseline.
3. Confirm with a read-only check which version is live: the header box starts with `<!-- BH CHABAD THEME vYYYYMMDD.HHMM`.

## 1. Hard boundaries
- Only touch **lightbhchabad.org (Site ID 10077, "Chabad Jewish Center of Bloomfield Hills")**. The same ChabadOne login also has PrincetonChabad.org: never select or edit it. Before every save, assert the General Settings page shows `title2` containing "Bloomfield".
- The JLI registration page is live and used: `/tools/events/register.asp?eventid=23504&new=true`. After every deploy re-test it **without submitting** (see §7).
- Never enter passwords or payment data; Levi logs in himself.
- Do not publish, send or change settings without Levi's OK for that change. A request from Levi to fix or change the site counts as OK to publish that fix.
- Leave the pending "Blue/Yellow" color scheme (Site Template & Theme) unpublished.
- Domain switch only when Levi says the site is 100% ready. Tell ChabadOne support first and keep the Google Workspace MX/SPF/DKIM records.

## 2. Architecture: global first, never per-page
The goal is that every page, form and block looks right automatically.
- **All design lives in two site-wide boxes**: Custom Header Code (fonts, CSS, fail-safe) and Custom Footer Code (JS). Never style a single page with inline styles or per-page `<style>` if a site-wide rule can do it.
- Style **platform components**, not instances: target ChabadOne's own classes and IDs (`.article-header`, `.co_global_button`, `#RegisterSinglePage`, `.embedded_form .form-line`, `.toggle_options`), so every event, form and article inherits the look.
- JS enhancements must be **generic and data-driven**. Examples:
  - Package categories pre-select their size by reading "for up to N reservations", with a fallback for "couple" = 2.
  - Per-person notes are hidden only when a general Comments box exists.
  - The homepage is built by reading the live widgets.
  - Never hard-code an event ID, form field ID or page ID.
- Page content uses **reusable content classes** (§5), not custom CSS.
- One set of design tokens (§4). Change a token, the whole site follows.
- If something needs a one-off, first ask whether it should become a component.

## 3. ChabadOne platform facts
**Where code goes**
- Custom Header Code is placed at the end of `<head>`; Custom Footer Code at the end of `<body>`. Both are in Sites > Settings > General Settings > Advanced Settings: textareas `#customheader` and `#customfooter` on `/platform/sitecontrol/admin/wizards/sitetitles.asp`.
- **Page body HTML** must be XHTML 1.0 Transitional or HTML 4.01 vocabulary and XML-valid.
  - Avoid `<section>` and other HTML5 structure tags.
  - Attributes need values (`async="async"`).
  - Any script containing `&`, `<` or `>` must be wrapped in `//<![CDATA[ ... //]]>`.
  - `<form>` tags are stripped.
- You cannot edit the HTML of the homepage, forms, galleries, blogs or campaigns. Restyle them via header/footer code.
- **Sites 6 limits**
  - Nav: 5 items + Donate, auto-built from "My Site".
  - Homepage is widget-based, with two layouts: Layout 1 "Balanced" (4316254) and Layout 2 "Minimal" (4446287, current).
  - Feeds come in sets of 3. Changing the layout resets it; Revert keeps 50 versions.
- **Image sizes**
  - Main promos: 1500px, 4:3.
  - Programs: 300×225.
  - Icons: 90×90.
  - Hero: 1900×750.
  - Logo: 150×150 transparent PNG.
- Virtual paths: `/kabbalah` and others are reserved; use `/kabbalahcourse`.
- Modern ChabadOne form CSS/JS (form-style.css, form-script.js from w2.Chabad.org) is loaded in the header. Theme it with `--primary-form-color` and the other `--*-form-*` variables.

**Gotchas (each one cost time)**
- ChabadOne **HTML-decodes entities** in the boxes on save (`&amp;` becomes `&`, `&quot;` becomes `"`). Never rely on entities. The CSS may not contain `&` or `<`; build.py asserts this.
- The platform forces the **Muli font on every element** with a very specific selector. The base rule sets `html body.cco_body *:not(i):not(.fa):not([class*="fa-"]) { font-family: inherit }` and the body font on `html body.cco_body`. Any serif/heading declaration therefore needs `var(--cc-font-head) !important`.
- Prefix every custom rule with `html body.cco_body` to beat `html body.cco_body p`. Use doubled classes for variants (`.cc-btn.cc-btn--sand`).
- `default-theme.css` declares `--theme-*` variables but hard-codes colors. Override the selectors; overriding the variables does nothing.
- **ChabadOne adds classes late with its own JS.** Example: `body.home` is added after our footer script runs. Never detect page type from late classes; detect by server-rendered markup (`.hp-table` = homepage) and set our own class (`html.cc-home-page`). This bug made the homepage randomly fall back to the native design.
- **Different markup for phones and for package categories.** On phones (by user agent) and for "Couple" rows, a reservation row is: index, `.float_right` (type, price, remove), `.clearfix.small_top_padding` (names and questions). Desktop "Standard" rows use `g120`/`g140`/`g100`/`g40` cells.
  - Detect with `:has(> .clearfix.small_top_padding)`.
  - Do NOT use `.small_horizontal_padding`: the desktop price cell has it too. That mistake broke desktop for minutes.
  - Always test both layouts.
- Name inputs on the registration page have **no `type` attribute**. Use `input:not([type=radio]):not([type=checkbox])...`, not `[type=text]`.
- `.clearfix::after` becomes a flex item inside flex containers; hide it (`display:none`) when using `space-between`.
- The embedded per-person form (`#formContainer`) has a 36px side margin on phones; reset it.
- The registration page remembers progress in localStorage (`Event_<id>_StoredProgress`). A returning visitor sees their reservations and only an "Add another registration" box, not the category picker. Clear it when testing a fresh visitor.
- Whitespace-only elements are not `:empty`; use `:has(*)` to style containers only when they contain something.
- Our own CSS `display: block !important` beats inline `style.display = none`. To hide from JS use `style.setProperty("display", "none", "important")`.
- The Preview popup does not show pending header code. Test by injecting into the live page.
- The disclaimer modal's Ok handler attaches only on a real mouseup, so scripted clicks don't save. Use the form flags in §6.
- The container's network proxy blocks chabad.org, wixstatic and Google Fonts. All site work goes through the built-in browser pane (tab `seed` = lightbhchabad.org, tab `tab-1` = chabadone.org admin). Screenshots fail when the pane is hidden or covered; use JS measurements, or ask Levi to bring Claude to the front (Ctrl/Cmd+Shift+B).
- Cowork cannot attach GitHub repos yet. Code is hosted in the ChabadOne boxes; the repo `rabbi-dubov/bhchabad-site` is reserved for later.

## 4. Design system (option 4, "warm modern serif", chosen by Levi)
- **Fonts:** headings DM Serif Display, weight 400 only. It has no bold, so never set 600–800 on it. Body Instrument Sans, 400–700.
- Labels and eyebrows: uppercase 12–13px, weight 700, letter-spacing .14em.
- **Palette (midnight + sand):**
  - ink `#14243B`
  - navy `#1C3557`
  - navy-2 `#2A4A75`
  - sand `#C9A36A`
  - sand-2 `#B48C50`
  - sand-text `#86642F`
  - sand-soft `#F3EBDD`
  - cream `#FAF8F4`
  - text `#1F2733`
  - muted `#5B6472`
  - line `#E6E1D8`
- **Shape:** `--cc-radius` 8px, `--cc-radius-sm` 6px, buttons 6px (`--cc-pill`). Crisp, not pill-shaped.
- **Layout:** max width 1200px, gutter 32px (20px on mobile), section rhythm 96px (64px on mobile).
- **Tone:** clean and modern like chabadoftribeca.com, warm community messaging like chabadconejo.com.
- **Header:** sticky white, logo plus a two-line title, Donate as a sand button. On 1025–1240px the menu labels may wrap to two lines, but the title never wraps.
- **Footer:** ink background with columns Explore (auto from the nav), Get involved, Visit. Footer link text comes from the nav; `<br>` inside a label is treated as a space.

## 5. Components and content classes
- **Buttons:** `cc-btn`, with `cc-btn--sand`, `cc-btn--ghost` and `cc-btn--light`. Native `.co_global_button .button` is styled the same.
- **Layout:** `cc-wrap`, `cc-section`, `cc-section--cream`, `cc-section--ink`, `cc-grid`, `cc-grid--2`, `cc-grid--4`, `cc-split`, `cc-card`, `cc-media`.
- **Text:** `cc-eyebrow`, `cc-h2`, `cc-lede`, `cc-link`, `cc-chip`.
- **Page content:** `cc-info` with `__label`/`__value`, `cc-lessons` (ol), `cc-faq` (details/summary), `cc-cta`.
- **Homepage shell (JS reads the live widgets; edit content in Site Control › Home Page):**

  | Widget | Shell section |
  |---|---|
  | promo slider | hero |
  | icons | quick links |
  | candle-lighting | This week |
  | events page/feed | events carousel |
  | message | intro |
  | programs | cards |
  | photos | photos |
  | subscribe | subscribe |

  Missing widgets are skipped. Fail-safe: if the shell isn't ready within 4s on `/`, `cc-shell-failed` shows the native homepage.
- **Registration page (all events):**
  - Every step is a card. Fields are 48px tall.
  - Radio answers are tiles.
  - Each attendee row has a type chip.
  - The "Add another registration (Standard or Couple)" box lists the categories.
  - A package category auto-selects its size.
  - Duplicate per-person notes are hidden.
  - The submit button is a normal, full-width button (not sticky).

## 6. Deploy procedure
1. Edit `src/*`, then run `python3 build.py`. It minifies, checks for no `&`/`<` in the CSS and no `]]>` in the JS, stamps the version, and writes `dist/header.html` and `dist/footer.html`.
2. **Test before deploying:** inject into the live page in the `seed` tab. Replace the text of the live `<style>` that starts with `:root{--cc-ink` (CSS changes), or run a standalone copy of the changed JS function. Test on desktop and phone (§7).
3. **Transfer to the admin tab** (the browser can't fetch from the container):
   - Small change: `python3 tools/mkpatch.py`. It diffs git HEAD's dist (= live) against the new dist and prints anchor/replace pairs plus old and new hashes. Apply them in the `tab-1` page JS to the textarea values, check the old hash first and the new hash after. Abort on any mismatch.
   - Big change: gzip+base64 the `{h, f}` JSON, decode in the page with `DecompressionStream('gzip')`, and verify SHA-256.
4. Assert the site title contains "Bloomfield". Set `#customheader` and `#customfooter`, set `#saveHeaderCodeWizard` = `1`, then call `doSubmit('tag')`. Wait, then re-read both boxes and confirm they equal what was sent and the page says "pending".
5. Publish: set `#previewstate` = `1`, then call `doSubmit('publish')`. The auto-mode classifier may block this; if so, ask Levi in chat, then publish.
6. Verify live:
   - The version stamp changed.
   - Homepage: load it 5× in hidden iframes and expect `cc-home-page cc-shell-ready` every time.
   - The registration flow (§7).
7. `git commit` (this makes HEAD = live for the next mkpatch). Then write the changed source files back to the project docs (`theme/*`).
8. **Rollback:** paste the previous dist (`git show HEAD~1:dist/header.html`) and save and publish. Or empty both boxes. Or set `CC_ENABLED = false` in theme.js.

## 7. Test checklist (every deploy)
- **Desktop:** the pane at its own width, plus a 1100–1280px emulation.
- **Phone:** `resize_window` 360×800. This also switches to an Android user agent, so ChabadOne serves phone markup. Reload after resizing.
- Check numbers, not only screenshots:
  - `document.documentElement.scrollWidth === innerWidth` (no sideways scroll).
  - Every visible field width ≥ 85% of the card.
  - Fonts are computed as DM Serif Display / Instrument Sans.
- **Registration (event 23504), never submit:**
  1. Clear `Event_23504_StoredProgress`.
  2. Pick Couple; quantity should be 2. Continue, then confirm 2 rows and a total of $215.
  3. Add a Standard registration.
  4. Confirm all sections are visible, per-person notes are hidden, Comments is visible, and the Make Reservation button is visible.
  5. Clean up: remove the rows and clear the storage key.
- **Homepage:** shell ready 5/5 loads on desktop and on phone.

## 8. Project files and status
- Project docs:
  - `claude/01-chabadone-research-and-plan.md` (research and plan)
  - `claude/02-chabadone-official-rules-notes.md` (official Help Center rules with article IDs)
  - `claude/03-wix-site-inventory.md` (pages to migrate)
  - `claude/04-chabadone-playbook.md` (living lessons log)
  - `theme/*` (source of truth)
- **Design canvas:** "BH Chabad Homepage Mockups", https://claude.ai/artifact/N9kumKsreUDYNh7Tg4Hzy2.
- **Roadmap:**
  1. Finish the global design: homepage Layout 1 (needs Levi's OK), Conejo-style messaging.
  2. Promote the registration form styling into site-wide form styles (contact, feedback, Form Builder).
  3. Build pages from the Wix inventory using the content classes.
  4. SEO: site description, alt text, per-program pages.
  5. Domain switch with ChabadOne support.
  6. Optionally move the code to GitHub.

## 9. Self-updating (required)
The skill file can only change when Levi saves a proposal, so learning works in two layers:
1. **During work:** whenever you discover a new platform fact, gotcha, decision, design rule or working procedure, append it right away to `claude/04-chabadone-playbook.md` in the project (date, what, why, how to handle). Also record Levi's decisions and preferences there.
2. **At the end of any session that added playbook entries:** merge them into this SKILL.md (put each in the right section, rewrite outdated lines, keep it tight). Then call `propose_skills` with kind `improvement`, target `chabadone-site-builder`, and the complete updated file. Tell Levi in one line that an updated skill is ready to save. After he saves it, mark the merged entries in the playbook as "merged into skill".
3. Never let the skill and the code disagree: if you change a token, procedure or class name, update §4–§6 in the same session.
