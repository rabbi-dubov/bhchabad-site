# ChabadOne playbook (living lessons log)

The newest learnings about building the BH Chabad site on ChabadOne. Read at the start of every session; append as you learn. Entries marked "merged" are already in the `chabadone-site-builder` skill.

Format: `- YYYY-MM-DD · topic · what we learned → how to handle it`

## Entries
- 2026-10-23 · homepage · ChabadOne adds `body.home` with its own script AFTER our footer JS runs, so `homeShell()` sometimes skipped and the native homepage showed ("not sticking") → detect the homepage by `.hp-table` and set `html.cc-home-page`; never rely on late-added classes. Verify with 5 hidden-iframe reloads. (merged)
- 2026-10-23 · registration · Phone user agents and "Couple" (package) rows get a different row markup (`.float_right` + `.clearfix.small_top_padding`) → style it separately with `:has(> .clearfix.small_top_padding)`. `.small_horizontal_padding` is NOT unique (desktop price cell has it). (merged)
- 2026-10-23 · registration · Name inputs have no `type`; `#formContainer` has 36px side margins on phones; our `!important` CSS beats inline `display:none` → use `setProperty(..., "important")`. (merged)
- 2026-10-23 · registration · Couple = "$215 for up to 2 reservations"; quantity must be 2 for one couple ($215 total, 2 name rows). Auto-selected from the "up to N" text. (merged)
- 2026-10-23 · Levi's decision · Per-person "Notes / Comments" is redundant with the general Comments box → hidden site-wide when both exist. (merged)
- 2026-10-23 · Levi's principle · Build global styles and generic behaviors, never per-page/per-form customizations. (merged)
- 2026-10-23 · design · Option 4 chosen: DM Serif Display (400 only) + Instrument Sans, 6–8px corners, midnight + sand. (merged)
- 2026-10-23 · deploy · The auto-mode classifier can block the publish call; ask Levi for an explicit OK in chat, then publish. (merged)
