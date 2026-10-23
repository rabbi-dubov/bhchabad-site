#!/usr/bin/env python3
"""Preview of the Past Courses page (course shelf + recordings), using the real theme CSS.
Course data comes from the Wix inventory (project doc claude/03-wix-site-inventory.md)."""
import html, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_preview as bp

ROOT = bp.ROOT
e = html.escape
YT = "https://www.youtube.com/playlist?list="

TOPICS = [  # key, label, cover class
    ("soul", "Mysticism and the soul", "t1"),
    ("big", "Big questions", "t2"),
    ("law", "Law, ethics and history", "t3"),
    ("life", "Life and relationships", "t4"),
    ("torah", "Torah, prayer and holidays", "t5"),
]
T = {k: (label, cls) for k, label, cls in TOPICS}

DATA = json.loads((ROOT / "data/courses.json").read_text())
SEASON_ORDER = {"Winter": 1, "Spring": 2, "Summer": 3, "Fall": 4}
TOPIC_OF = {  # by title keyword -> topic key
    "Kabbalah": "soul", "Jewpernatural": "soul", "Meditation from Sinai": "soul", "Journey of the Soul": "soul",
    "Paradigm Shift": "soul", "What Is?": "soul", "Lift Your Life": "soul",
    "For All Humankind": "big", "My G-d": "big", "This Can Happen": "big", "Course of Why": "big",
    "Wrestling with Faith": "big", "To Believe": "big",
    "Sinai and Civics": "law", "Responsa": "law", "Decoding the Talmud": "law", "Judaism Decoded": "law",
    "Crime and Consequence": "law", "Great Debates": "law", "Gifts to the World": "law", "Beyond Right": "law",
    "Survival of a Nation": "law", "Outsmarting Antisemitism": "law", "Decisions of Fate": "law",
    "Colorful Profiles": "law", "Book Smart": "law",
    "Happiness": "life", "Advice for Life": "life", "Nurturing Relationships": "life", "Communication": "life",
    "Worrier to Warrior": "life", "Judaism at Home": "life", "Pirkei Avot": "life", "Well-Connected": "life",
    "One Wow Moment": "life",
    "Secrets of the Bible": "torah", "High Holidays": "torah", "With All My Heart": "torah", "Heaven on Earth": "torah",
    "Read it in Hebrew": "torah", "A Work of Heart": "torah", "NEXT GENesis": "torah",
}
REC_LABEL = {"youtube": "&#9654; Watch", "spotify": "&#127911; Listen", "wix-audio": "&#9835; Audio"}


def topic_of(title):
    for k, v in TOPIC_OF.items():
        if k.lower() in title.lower():
            return v
    return "big"


def short_title(t):
    return t.split(":")[0] if t.startswith("Sinai and Civics") else t


COURSES = []
for c in DATA["courses"]:
    season = c["season"].split()[0] if c["season"][0].isalpha() else "Fall"   # women's series run Nov-May
    women = c["series"] == "RCS"
    COURSES.append({
        "title": short_title(c["title"]), "season": (season if not women else "Women's series") + " " + (str(c["year"]) if not women else c["season"]),
        "key": f'{c["year"]}-{SEASON_ORDER.get(season, 4)}{"b" if women else "a"}', "year": str(c["year"]),
        "topic": topic_of(c["title"]), "women": women, "series": c["series"], "desc": c.get("description") or "",
        "lessons": c.get("lessons") or [], "recs": c.get("recordings") or [], "current": c.get("status") == "current",
    })
PAST = [c for c in COURSES if not c["current"]]


def book(i, c):
    label, cls = T[c["topic"]]
    foot = []
    for r in c["recs"]:
        if r["type"] == "wix-audio":
            foot.append('<span title="Audio recordings are being moved from the old site">&#9835; Audio</span>')
        else:
            foot.append(f'<a href="{e(r["url"])}" target="_blank" rel="noopener">{REC_LABEL[r["type"]]}</a>')
    kind = "with Mushky Dubov" if c["women"] else ("JLI course" if c["series"] == "JLI" else "Course")
    return (f'<article class="cc-book cc-book--{cls}" data-topic="{c["topic"]}" data-rec="{1 if c["recs"] else 0}" data-women="{1 if c["women"] else 0}">'
            f'<span class="cc-book__season">{e(c["season"])}</span><h3 class="cc-book__title">'
            f'<button type="button" class="cc-book__open" data-i="{i}">{e(c["title"])}</button></h3>'
            f'<p class="cc-book__tag">{e(kind)}</p><div class="cc-book__foot">{"".join(foot)}</div></article>')


def page():
    order = sorted(range(len(PAST)), key=lambda i: PAST[i]["key"], reverse=True)
    years = {}
    for i in order:
        years.setdefault(PAST[i]["year"], []).append(i)
    n = len(PAST)
    n_rec = sum(1 for c in PAST if c["recs"])
    n_women = sum(1 for c in PAST if c["women"])
    first = min(c["year"] for c in PAST)
    chips = '<button type="button" aria-pressed="true" data-f="all">All courses</button>'
    chips += "".join(f'<button type="button" aria-pressed="false" data-f="{k}"><i style="background: var(--cc-book-{cls[1]})"></i>{e(label)}</button>' for k, label, cls in TOPICS)
    chips += """<button type="button" aria-pressed="false" data-f="women">Women's series</button>"""
    chips += '<button type="button" aria-pressed="false" data-f="rec">With recordings</button>'
    shelves = '<div class="cc-shelf">' + "".join(f'<div class="cc-shelf__year" role="heading" aria-level="2"><strong>{y}</strong><span>{len(ix)} course{"s" if len(ix) > 1 else ""}</span></div>' + "".join(book(i, PAST[i]) for i in ix) for y, ix in years.items()) + '</div>'
    data_js = json.dumps([{"t": c["title"], "s": c["season"], "d": c["desc"], "l": c["lessons"],
                           "r": [{"t": r["type"], "u": r["url"]} for r in c["recs"]]} for c in PAST]).replace("</", "<\\/")
    listen = """<section class="cc-section cc-section--ink"><div class="cc-wrap cc-split">
<div><p class="cc-eyebrow">Listen anywhere</p><h2 class="cc-h2 cc-head">Classes on the go</h2>
<p class="cc-lede">Rabbi Dubov's weekly classes, and the full lessons of recent courses, are free on your favorite podcast app and YouTube.</p></div>
<div class="cc-partner__ctas"><a class="cc-btn cc-btn--light" href="https://podcasters.spotify.com/pod/show/torah-deep-dive" target="_blank" rel="noopener">Torah Deep Dive podcast</a>
<a class="cc-btn cc-btn--ghost" style="color: var(--cc-white) !important" href="https://podcasts.apple.com/podcast/id1600754756" target="_blank" rel="noopener">Tanya podcast</a></div></div></section>"""
    now = f'''<div class="cc-features" style="margin-top:8px">
<article class="cc-feature"><div class="cc-feature__date" aria-hidden="true"><span class="cc-feature__m">Oct</span><span class="cc-feature__d">28</span><span class="cc-feature__w">Wed</span></div>
<div class="cc-feature__body"><p class="cc-feature__kicker">Now enrolling · JLI course</p><h3 class="cc-feature__title cc-head">Kabbalah and the hidden architecture of you</h3>
<p class="cc-feature__desc">Reincarnation, soulmates, dreams, names: what these and other mysteries reveal about the hidden design of your life.</p>
<div class="cc-feature__cta"><a class="cc-btn" href="#">Register</a></div></div></article>
<article class="cc-feature"><div class="cc-feature__date" aria-hidden="true"><span class="cc-feature__m">Nov</span><span class="cc-feature__d">17</span><span class="cc-feature__w">Tue</span></div>
<div class="cc-feature__body"><p class="cc-feature__kicker">Now enrolling · Rosh Chodesh Society</p><h3 class="cc-feature__title cc-head">NEXT GENesis</h3>
<p class="cc-feature__desc">Seven monthly evenings reading the first stories of Genesis as a mirror of the soul, with Mushky Dubov. Dinner served.</p>
<div class="cc-feature__cta"><a class="cc-btn" href="#">Register</a></div></div></article></div>'''
    body = f'''<div id="content">
<section class="cc-section cc-section--cream" style="padding-top:72px;padding-bottom:64px;border-bottom:1px solid var(--cc-line)"><div class="cc-wrap">
<p class="cc-eyebrow">Adult education</p>
<h1 class="cc-h2 cc-head" style="font-size:clamp(40px,5.4vw,64px)">Years of learning together</h1>
<p class="cc-lede">Since {first}, we've offered a new course nearly every season, from Kabbalah and the soul to Talmudic law, Jewish history and the art of prayer. Browse them all, and watch or listen to the recordings.</p>
<ul class="cc-stats"><li><strong>{n}</strong><span>courses taught</span></li><li><strong>{first}</strong><span>teaching since</span></li><li><strong>{n_women}</strong><span>women's series</span></li><li><strong>{n_rec}</strong><span>with recordings</span></li></ul>
</div></section>
<section class="cc-section" style="padding-top:56px;padding-bottom:40px"><div class="cc-wrap">
<p class="cc-eyebrow">Join a course now</p>
{now}
</div></section>
<section class="cc-section" style="padding-top:24px"><div class="cc-wrap">
<p class="cc-eyebrow">The course library</p>
<div class="cc-chips" role="group" aria-label="Filter courses">{chips}</div>
{shelves}
</div></section>
{listen}
</div>
<dialog class="cc-dialog" id="cc-course"><form method="dialog"><button class="cc-dialog__x" aria-label="Close">&#215;</button></form><div id="cc-course-body"></div></dialog>
<script>window.CC_COURSES = {data_js};</script>'''
    js = '''<script>(function(){var d=document,bs=d.querySelectorAll('.cc-chips button');
bs.forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.f;bs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
d.querySelectorAll('.cc-book').forEach(function(k){k.hidden=!(f==='all'||(f==='rec'?k.dataset.rec==='1':f==='women'?k.dataset.women==='1':k.dataset.topic===f));});
d.querySelectorAll('.cc-shelf__year').forEach(function(y){var n=y.nextElementSibling,any=false;while(n&&n.classList.contains('cc-book')){if(!n.hidden){any=true;}n=n.nextElementSibling;}y.hidden=!any;});});});
var dlg=d.getElementById('cc-course'),body=d.getElementById('cc-course-body'),L={youtube:'Watch the recordings',spotify:'Listen on the podcast','wix-audio':'Audio (moving from the old site)'};
function el(t,c,x){var n=d.createElement(t);if(c){n.className=c;}if(x){n.textContent=x;}return n;}
d.querySelectorAll('.cc-book__open').forEach(function(b){b.addEventListener('click',function(){var c=window.CC_COURSES[+b.dataset.i];body.textContent='';
body.appendChild(el('p','cc-eyebrow',c.s));body.appendChild(el('h2','cc-h2 cc-head',c.t));if(c.d){body.appendChild(el('p','cc-lede',c.d));}
if(c.l.length){body.appendChild(el('h3','cc-dialog__h','Lessons'));var ol=el('ol','cc-dialog__lessons');c.l.forEach(function(x){ol.appendChild(el('li','',x));});body.appendChild(ol);}
if(c.r.length){var r=el('div','cc-hero__ctas');c.r.forEach(function(x){if(x.t==='wix-audio'){r.appendChild(el('span','cc-chip',L[x.t]));}else{var a=el('a','cc-btn',L[x.t]);a.href=x.u;a.target='_blank';a.rel='noopener';r.appendChild(a);}});body.appendChild(r);}
dlg.showModal();});});
dlg.addEventListener('click',function(ev){if(ev.target===dlg){dlg.close();}});
d.getElementById('pv-menu-open').addEventListener('click',function(){d.getElementById('pv-nav').classList.add('is-open');});
d.getElementById('pv-menu-close').addEventListener('click',function(){d.getElementById('pv-nav').classList.remove('is-open');});
d.querySelectorAll('a[href="#"]').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();});});})();</script>'''
    return f'''<!doctype html>
<html lang="en" class="cc-on"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="{bp.FONTS}">
<style>{(ROOT / "src/theme.css").read_text()}
{bp.SHIM}</style></head>
<body class="cco_body cc-footer-built">
{bp.header()}
{body}
{bp.footer()}
{js}
</body></html>'''


if __name__ == "__main__":
    site = page()
    shell = (ROOT / "preview/shell.html").read_text()
    shell = shell.replace("<title>BH Chabad Homepage Preview</title>", "<title>BH Chabad Courses Preview</title>")
    shell = shell.replace("<h1>Homepage preview</h1>", "<h1>Past courses page preview</h1>")
    shell = shell.replace('title="BH Chabad homepage preview"', 'title="BH Chabad past courses preview"')
    shell = shell.replace("Photos are samples until yours arrive; testimonials are placeholders. Buttons don't go anywhere yet.",
                          "Course list from the old site. Watch links open the real YouTube playlists; audio is still on the old site.")
    (ROOT / "preview/courses-preview.html").write_text(shell.replace("%%SITE%%", site.replace("</script", "<\\/script")))
    (ROOT / "preview/courses-standalone.html").write_text(site)
    print("ok")
