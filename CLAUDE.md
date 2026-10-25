# BH Chabad website: shared instructions for every Claude session

This repo builds the new website of Chabad Jewish Center of Bloomfield Hills (ChabadOne site 10077, lightbhchabad.org, later bhchabad.org).
Two people work with Claude on it, in separate sessions. The files below are the shared memory between those sessions, so keep them current.

## Who does what

- **Rabbi Levi Dubov** decides strategy, design and wording. He reviews plans and drafts, usually by commenting in the shared docs.
- **Rivka** (Levi's assistant) carries out what Levi approved: entering content in ChabadOne, event fixes, uploads, and checks in her browser.
  - Rivka works from her own computer and her own Claude account, with no GitHub or repo access. She uses the Claude browser extension (or her hands) on ChabadOne, following a shared checklist doc, and ticks its boxes. **That doc is the handoff:** Levi's sessions read it to see what she did, then update HANDOFF.md here. Current checklist: https://claude.ai/artifact/5ZB6voHQCTisMdQGTrKSFb
- Nothing goes live, gets published or is sent without Levi's OK for that change. If Rivka asks for something Levi hasn't approved, say so and suggest she check with him.
- Both are beginners with code. Give short click-by-click steps, and put any text they must paste in a code block in the chat. Don't hand them files, terminal commands or Notepad steps.

## Start of every session

1. Run `git pull` in this folder. If git reports `bad object ... desktop.ini`, delete every `desktop.ini` under `.git` (the cloud-sync icon files) and pull again.
2. Read `HANDOFF.md` (where things stand, open tasks, links), then `PLAYBOOK.md` (lessons and decisions), then `SKILL.md` (how the site is built and deployed).
3. Open the current master plan, the **BH Chabad website plan** doc (link in HANDOFF.md), and read any new comments or answers in it.
4. Tell the person in two or three lines where things stand and what you suggest doing next.

## End of every session (do not skip)

1. Update `HANDOFF.md`: fix "Where things stand", tick off or add open tasks, and add a dated line to the "Session log" at the bottom saying who worked (Levi or Rivka) and what changed.
2. Add any new platform fact, decision or preference to `PLAYBOOK.md` (date, what, why).
3. Commit and push to GitHub, so the next session, on any computer, starts from it.

## Hard rules

- Only touch BH Chabad (site 10077, "Bloomfield" in the site title). Never PrincetonChabad, which shares the same login.
- Never type passwords, card numbers or other credentials; the person logs in themselves. Never complete a Cloudflare or CAPTCHA check.
- The JLI registration page is live and used: re-test it after every deploy without submitting.
- Global styles only, never per-page tweaks. Every page is about this Chabad and its programs: no Chabad.org content on the menu, except the Tanya Project pages by choice.
- This repo is **public**. Never commit names or details of community members, testimonial writers' names, emails, phone numbers of private people, donation data or anything from Levi's inbox. Personal photos and private notes stay in the Shlichus folder or the private claude.ai docs.
- Testimonials: shown as first name and last initial only ("David R."), with no program or year. Where a name is missing or too recognizable, use a plain pseudonym (Levi's decision, Oct 24). No "names have been changed" note under the quotes (Levi, Oct 25). Light edits only; each must still sound like the person.
- Avoid rate limits on ChabadOne: one check per change, no reload loops.

## Where things live

- **Code and notes**: this repo, github.com/rabbi-dubov/bhchabad-site. The live site loads `live/` from it through jsDelivr.
- **Plans and drafts** (private claude.ai docs, shared with Rivka): links in HANDOFF.md.
- **Photos and source files**: the `Shlichus` folder on Levi's OneDrive. Skip the duplicate `Shlichus\Shlichus` copy and never use the donation-check scans.
