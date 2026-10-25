# BH Chabad website: handoff (Oct 23, 2026, evening)

Read this first in any new session, then `claude/04-chabadone-playbook.md`.

## Where things stand

- **Live theme**: since Oct 24, 2026 the ChabadOne Custom Header/Footer boxes hold only the GitHub loader (`loader/header.html`, `loader/footer.html`). Visitors get `live/` from jsDelivr = v20261023.1230 (refined palette, new hero, "Coming up" cards). Levi checked the homepage and JLI registration in Edge after the switch: unchanged. Deploys no longer need ChabadOne: push to GitHub, purge jsDelivr. Backup of the old inline code: `ShlichusWebsiteabadone-code-backup-2026-10-24.txt` (paste back + Save + Publish to undo).
- **Not deployed yet**: the `cachedPage()` localStorage caching and `testimonialsUrl: null` in theme.js.
- **Homepage layout**: Layout 1 is still PENDING with demo content. The live homepage still shows the old "under construction" slide. Filling it was blocked by the Cloudflare "Verify you are human" check in the browser pane.
- **JLI registration** (`/tools/events/register.asp?eventid=23504&new=true`) was tested after the last deploy and works. Re-test after every deploy, never submit, and clear the stored progress.
- **GitHub**: github.com/rabbi-dubov/bhchabad-site `main` has the full history (pushed Oct 24 from a local Claude Code session on Levi's PC, merged with the cloud session's earlier one-commit publish). Local working copy: `ShlichusWebsitebhchabad-site`. `gh` there is logged in as rabbi-dubov. Python is NOT installed on the PC yet, so `build.py` can't run there until it is.
  - `live/` = exactly the deployed v20261023.1230 (same CSS/JS as dist/, hashes 7e80923a8d53 / fd9ecd201292 for the inline snippets).
  - `test/` = current src: caching update, testimonialsUrl null, course-cover card styles.
  - `build.py test | promote | snippets` (see README).

## Open tasks, in order

1. ~~Push the repo to GitHub; Levi pastes the loader into ChabadOne~~ DONE Oct 24. After every push, purge jsDelivr.
2. **ChabadOne content** (needs a browser that can pass Cloudflare; try Claude in Chrome in Levi's Edge):
   - Fill Layout 1: slide 1 welcome copy and 4 programs, and remove the Demo Ad.
   - Publish only with Levi's OK.
   - NEXT GENesis event: set dates to Nov 17 2026–May 18 2027 and remove the all-caps "A MONTHLY LEARNING SERIES FOR WOMEN: NEXT GENises" line. Levi approved this.
   - Deploy the caching update.
3. **Courses page**: DONE in preview v4 (covers on every card, 16:9 frame filled with the cover's edge colour; phones show a 120px thumbnail beside the text; the dialog shows the cover on top). Still to ask Levi:
   - The 2020 Pirkei Avot cover IS the Cultivating Character artwork (square social version). Did the 2020 series have that name too, or is it the wrong image?
   - The 2018 "Heaven on Earth" cover reads "Extreme Makeover: Divine Edition" (Temple artwork). Which title should the card use?
   - Production: covers need a public home. Plan: serve `data/covers-thumb/*.webp` from the GitHub repo via jsDelivr (or upload to ChabadOne media) once the repo is pushed.
4. **Photos**: curate real event photos from `Shlichus\` (Shain Park menorah 2019–23, Purim in the Jungle, First Fridays, JLI\Pictures, Limmud) for the homepage and inner pages. Levi will download his Google Photos albums into the Shlichus folder; there is no Google Photos connector.
5. **About page**: waiting on Levi's doc comments and his answers to the open questions (children count, dedication wording, photos).
6. **Testimonials**: Levi is collecting these himself, via ChatGPT. Do not search his email for them, and never invent any. When the page exists, set `testimonialsUrl: "/testimonials"`.
7. **Ask Levi** about two things:
   - Book Smart and Jewpernatural share a single YouTube playlist.
   - 10 courses only have audio hosted on Wix, which needs exporting.
8. **Later**: the remaining pages, SEO, then the domain switch.
   - Preserve Google Workspace MX/SPF/DKIM records.
   - Tell ChabadOne support before switching.

## Links

- Homepage preview: https://claude.ai/artifact/EjwrS9wc8Codpdi7hKA5cy
- Courses preview (v4, with covers): https://claude.ai/artifact/V3ZntNNdSu2JGDjCdNpndu
- About Us draft doc: https://claude.ai/artifact/DTttWxjpMj7r3NW2GunmV7
- Homepage content draft doc: https://claude.ai/artifact/U11tdhcy8JVz9HEceuhvCq
- Old Wix sitemap (all course pages, including hidden ones): https://www.bhchabad.org/pages-sitemap.xml
- myjli Resource Library: Levi logs in himself. The library is an ajax tree at `/desktop/reslibrary/ajax/testResLib.php?showAcord=1&test=1&view=&dir=N`.
  - Year folders: 5787=821, 5786=811, 5785=802, 5784=788, 5783=722, 5782=716, 5781=712, 5780=707.

## Hard rules (Levi's instructions)

- **Scope**: only touch BH Chabad (Site ID 10077, "Bloomfield" in `title2`). Never touch PrincetonChabad, which shares the same login.
- **No credentials or bot checks**: never enter passwords; Levi logs in. Never complete CAPTCHAs or Cloudflare checks.
- **Ask first**: no publishing, sending or saving settings without Levi's OK. Leave the pending "Blue/Yellow" color scheme unpublished.
- **Rate limits**: avoid them on ChabadOne. Make one check per change, don't poll, don't reload in loops, and don't re-fetch `/tools/` pages repeatedly.
- **Styling**: global styles only, never per-page tweaks. The CSS may not contain `&` or `<`.
- **Domain switch**: only when the site is 100 percent ready.

## Environment notes

- **Container network**: reaches static.wixstatic.com, www.bhchabad.org and resources.myjli.com. It cannot reach chabad.org, lightbhchabad.org or YouTube.
- **Levi's PC folders**: `C:\Users\rabbi\OneDrive\Documents\Shlichus` and its `Website` subfolder are connected. ImageMagick is available there.
- **OneDrive**: a new file shows as "hardlinked" while it syncs. Wait about 45 seconds before staging it.
