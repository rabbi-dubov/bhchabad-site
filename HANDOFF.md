# BH Chabad website: handoff

Updated Oct 24, 2026. Read `CLAUDE.md` first (roles, start and end of session), then this file, then `PLAYBOOK.md`.

## Where things stand

- **Phase**: planning with Levi is done for the site structure. Next is implementation, which Rivka carries out with Claude, while Levi reviews wording, design and photos.
- **Master plan**: the "BH Chabad website plan" doc (link below). Levi went through it with comments on Oct 24 and answered all its open questions. It holds the top menu, site map, homepage changes, Adult education landing page, Tanya section, Shul, testimonials (with privacy rules), where the old Wix pages go, and the build order.
- **Menu (decided)**: About · Learn · Tanya · Events & Holidays · Shul · Contact, plus a Donate button. Clicking Learn opens an "Adult education" landing page. No Chabad.org content, except the Tanya Project chapters on our own domain.
- **Live theme**: the ChabadOne Custom Header/Footer boxes hold only the GitHub loader (`loader/`). Visitors get `live/` from jsDelivr: v20261023.2047 (released Oct 24 after Levi tested `?cc=test`). Deploys need no ChabadOne step: push to GitHub, then purge jsDelivr. Backup of the old inline code: `Shlichus\Website\chabadone-code-backup-2026-10-24.txt` (paste back, Save, Publish to undo).
- **Homepage content**: ChabadOne's Layout 1 is still pending with demo content; the live homepage still shows the old "under construction" slide. Cloudflare blocks Claude's browser on chabadone.org and lightbhchabad.org from Levi's PC, so a person enters content in their own browser with text from Claude.
- **Photos**: Claude reviewed about 1,100 photos in `Shlichus\` and published a 40-photo shortlist page with Use / Skip buttons (link below). Levi's picks save there; read them with ArtifactData `list` on collection `picks` (doc id = `p` + photo id, e.g. `p2-4`, field `choice`), plus `notes/general`. Photo ids map to files through the contact-sheet indexes, which live only in that session's scratchpad: if needed, find files by the captions on the shortlist page. Missing: Shabbat Day, people at Shabbat dinners, High Holidays, Simchas Torah, Passover, Shavuos, the Tanya class, Lunch and Learn, a larger photo of Mushky, and the originals behind the 2024–25 campaign graphics.
- **Testimonials**: chosen from Levi's two Google Docs ("Chabad Programming Feedback and Testimonials", 627 entries, and "Chabad Homepage Testimonials"). The picks, with the privacy rules, are in the plan doc. The site's `testimonialsUrl` stays `null` until the "In their words" page exists.
- **Tanya**: podcast "Tanya: The Kabbalah of You" (weekly since 2021, up to chapter 40, 5.0 on Apple). Numbers read Oct 24, 2026 in Spotify for Creators and YouTube Studio: 21,535 all-time audio plays and downloads across every podcast app (244 Spotify followers; 2,816 hours listened on Spotify alone, other apps do not report time; all time 95 countries, led by US 72%, Canada 7%, Israel 4%, Australia 4%, UK 3%; 15 countries in the past month); YouTube channel lifetime 33,211 views, 6,800 watch hours, 415 subscribers, Tanya playlist 19.7K views. Page line: "More than 40,000 plays, in 95 countries." Tanya Project reader quotes (from the chabad.org mailbox and the "Tanya project feedback" doc in the chabad.org Drive) are in the plan doc. Apple: podcasts.apple.com/us/podcast/id1600754756 · Spotify: open.spotify.com/show/6YoFpK5kK4l4735AvqZWmO · YouTube channel UCM-rStPmmK15hS3weLTbPgg. The Chabad.org Tanya Project (with Rabbi Tzvi Freeman) has no book title or date yet ("in several years").
- **JLI registration** (`/tools/events/register.asp?eventid=23504&new=true`): works; re-test after every deploy, never submit.
- **Repo**: github.com/rabbi-dubov/bhchabad-site, local copy `Shlichus\Website\bhchabad-site` on Levi's PC (`gh` logged in as rabbi-dubov). Python is not installed there, so `build.py` can't run yet; promoting `test/` to `live/` is a plain copy of three files.

## Open tasks, in order

1. **Levi**: pick photos on the shortlist page; send Tanya listener numbers (sign in to Spotify for Creators and YouTube Studio in the Claude app's browser, or send screenshots); answer the About page draft's questions.
2. **Levi**: share the plan doc, the photo shortlist, the homepage draft and the About draft with Rivka (Share menu on each page), and give her access to the GitHub repo and the Shlichus folder.
3. **Rivka + Claude**: clean up the ChabadOne top menu to the six items (first get a screenshot of today's menu).
4. **Rivka + Claude**: homepage content in ChabadOne (slides, quick links, welcome, program cards), using the homepage draft plus the plan's changes and the chosen photos. Publish only with Levi's OK.
5. **Chanukah at Shain Park** page and hero slide (Chanukah begins Friday, December 4, 2026): needs date, time and sponsors from Levi.
6. **Learn**: Adult education landing page, past courses page (preview v4 ready; covers are public at `https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/data/covers-thumb/<file>.webp`), weekly classes, Lunch and Learn, women's learning and events, CE/CME credits.
7. **Tanya section**: overview with numbers and quotes, weekly class (Zoom link only after sign-up), podcast and YouTube by chapter, the Tanya book page.
8. **About** (with In their words, How we can help, Photo albums), **Shul** (Shabbat Day on the 2nd Shabbat of each month, "contact us for the next date", an interest button), the other holiday pages, Contact.
9. **Event fixes** (Rivka): NEXT GENesis dates to Nov 17 2026 – May 18 2027, and remove the all-caps "A MONTHLY LEARNING SERIES FOR WOMEN: NEXT GENises" line (Levi approved).
10. **Wix audio**: 10 courses' recordings live only on Wix; download them before Wix ends. Also: Book Smart and Jewpernatural share one YouTube playlist.
11. **Later**: SEO, then the domain switch (only when 100% ready; tell ChabadOne support first; keep the Google Workspace MX/SPF/DKIM records). Ask ChabadOne whether old Wix addresses can forward to the new pages.

## Links (private claude.ai pages; Levi shares them with Rivka)

- **Website plan (master plan)**: https://claude.ai/artifact/Sv4YuH9GCoRwJHsPABTEvT
- **Photo shortlist** (Use / Skip): https://claude.ai/artifact/85fJaS5LdYV8ENYCNj974z
- Homepage content draft doc: https://claude.ai/artifact/U11tdhcy8JVz9HEceuhvCq
- About Us draft doc: https://claude.ai/artifact/DTttWxjpMj7r3NW2GunmV7
- Homepage preview: https://claude.ai/artifact/EjwrS9wc8Codpdi7hKA5cy
- Courses preview (v4, with covers): https://claude.ai/artifact/V3ZntNNdSu2JGDjCdNpndu
- Old Wix sitemap: https://www.bhchabad.org/pages-sitemap.xml
- myjli Resource Library: Levi logs in himself. Ajax tree at `/desktop/reslibrary/ajax/testResLib.php?showAcord=1&test=1&view=&dir=N`; year folders 5787=821, 5786=811, 5785=802, 5784=788, 5783=722, 5782=716, 5781=712, 5780=707.

## Hard rules

See `CLAUDE.md`. In short: only site 10077, never Princeton; nobody types passwords for anyone; no publishing without Levi's OK; one check per change on ChabadOne; global styles only, and the CSS may not contain `&` or `<`; this repo is public, so no private data in it; leave the pending "Blue/Yellow" color scheme unpublished.

## Environment notes

- Cloudflare challenges both Claude's in-app browser and plain downloads on lightbhchabad.org and chabadone.org from Levi's PC. Checks there are done by a person in Edge (Ctrl+F5), with screenshots pasted into the chat.
- The Shlichus folder syncs to the cloud, and the sync drops `desktop.ini` icon files into `.git`, which breaks `git pull`. Delete them (see `CLAUDE.md`).
- ImageMagick is not installed; Windows' own imaging (PowerShell `System.Drawing`) works for contact sheets and resizing.

## Session log

- 2026-10-24 · Levi · First local session: repo pushed to GitHub, loader switched in ChabadOne, v20261023.2047 released, website plan written and reviewed (menu, site map, testimonials, Tanya, Shul), photo shortlist published, shared `CLAUDE.md` added for Levi and Rivka.
- 2026-10-24 · Levi · Tanya numbers read in the app browser (Levi signed in to Spotify for Creators, YouTube Studio and his chabad.org Gmail/Drive himself); Tanya Project quotes added to the plan doc.
- 2026-10-24 · Levi · Photo shortlist reviewed: 25 use, 15 skip (summary table under "Homepage" in the plan doc). Open: Events & Holidays card photo, Shul and Purim photos, family photo for About (Levi will send). Levi feels there are many more good photos than the 40 shown: next round widens beyond the "Chosen" folders and whatever he points to.
