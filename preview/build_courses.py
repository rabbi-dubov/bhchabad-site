#!/usr/bin/env python3
"""Preview of the Courses page (light course library, real class photos, recordings), using the real theme CSS.
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
REC_LABEL = {"youtube": "Watch the classes", "spotify": "Listen on the podcast", "wix-audio": "Audio"}
import base64
from PIL import Image, ImageStat


def cover_of(c):
    """Cover thumbnail (data/covers-thumb/<stem>.webp) as a data URI, plus the colour of its edges,
    used to fill the frame around covers that aren't 16:9."""
    f = ROOT / "data/covers-thumb" / (pathlib.Path(c.get("coverFile") or "").stem + ".webp")
    if not c.get("coverFile") or not f.exists():
        return None
    im = Image.open(f).convert("RGB")
    w, h = im.size
    k = max(2, w // 40)
    strips = [im.crop((0, 0, w, k)), im.crop((0, h - k, w, h)), im.crop((0, 0, k, h)), im.crop((w - k, 0, w, h))]
    rgb = [round(sum(ImageStat.Stat(x).mean[i] for x in strips) / 4) for i in range(3)]
    return {"src": "data:image/webp;base64," + base64.b64encode(f.read_bytes()).decode(),
            "bg": "#%02x%02x%02x" % tuple(rgb), "square": w / h < 1.3}


PHOTOS = {pth.stem: "data:image/jpeg;base64," + base64.b64encode(pth.read_bytes()).decode() for pth in (ROOT / "preview/photos").glob("*.jpg")}


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
        "cover": cover_of(c),
    })
PAST = [c for c in COURSES if not c["current"]]


def card(i, c):
    label, cls = T[c["topic"]]
    recs = [r for r in c["recs"] if r["type"] != "wix-audio"]
    link = f'<a href="{e(recs[0]["url"])}" target="_blank" rel="noopener">{REC_LABEL[recs[0]["type"]]}</a>' if recs else ""
    if not recs and c["recs"]:
        link = '<span>Audio available</span>'
    who = "Women's series with Mushky Dubov" if c["women"] else ""
    when = c["season"]
    cv = c["cover"]
    cover = (f'<div class="cc-course__cover" style="background-color:{cv["bg"]}"><img src="{cv["src"]}" alt="" loading="lazy" decoding="async" /></div>'
             if cv else "")
    return (f'<article class="cc-course cc-topic-{cls[1]}{" cc-course--cover" if cv else ""}" data-topic="{c["topic"]}" data-rec="{1 if c["recs"] else 0}" data-women="{1 if c["women"] else 0}">'
            f'{cover}<p class="cc-course__when">{e(when)}</p>'
            f'<h3 class="cc-course__title cc-head"><button type="button" class="cc-course__open" data-i="{i}">{e(c["title"])}</button></h3>'
            f'<p class="cc-course__desc">{e(c["desc"])}</p>'
            f'<div class="cc-course__foot"><span><i class="cc-dot"></i>{e(who or label)}</span>{link}</div></article>')


def page():
    order = sorted(range(len(PAST)), key=lambda i: PAST[i]["key"], reverse=True)
    n = len(PAST)
    n_rec = sum(1 for c in PAST if c["recs"])
    n_women = sum(1 for c in PAST if c["women"])
    first = min(c["year"] for c in PAST)
    chips = '<button type="button" aria-pressed="true" data-f="all">All courses</button>'
    chips += "".join(f'<button type="button" aria-pressed="false" data-f="{k}" class="cc-topic-{cls[1]}"><i class="cc-dot"></i>{e(label)}</button>' for k, label, cls in TOPICS)
    chips += """<button type="button" aria-pressed="false" data-f="women">Women's series</button>"""
    chips += '<button type="button" aria-pressed="false" data-f="rec">With recordings</button>'
    cards = '<div class="cc-courses">' + "".join(card(i, PAST[i]) for i in order) + '</div>'
    data_js = json.dumps([{"t": c["title"], "s": c["season"], "d": c["desc"], "l": c["lessons"],
                           "r": [{"t": r["type"], "u": r["url"]} for r in c["recs"]]} for c in PAST]).replace("</", "<\\/")
    P = PHOTOS
    mosaic = (f'<div class="cc-mosaic" aria-hidden="true"><div style="background-image:url({P["class-0009-l1001983-"]})"></div>'
              f'<div style="background-image:url({P["class-0016-l1001990-"]})"></div><div style="background-image:url({P["class-0022-l1001996-"]})"></div></div>')
    strip = (f'<div class="cc-photo-strip" aria-hidden="true"><div style="background-image:url({P["class-0019-l1001993-"]})"></div>'
             f'<div style="background-image:url({P["class-img_5316"]})"></div><div style="background-image:url({P["class-img_1371"]})"></div></div>')
    now = """<div class="cc-features">
<article class="cc-feature"><div class="cc-feature__date" aria-hidden="true"><span class="cc-feature__m">Oct</span><span class="cc-feature__d">28</span><span class="cc-feature__w">Wed</span></div>
<div class="cc-feature__body"><p class="cc-feature__kicker">JLI course</p><h3 class="cc-feature__title cc-head">Kabbalah and the hidden architecture of you</h3>
<p class="cc-feature__desc">Reincarnation, soulmates, dreams, names: what these and other mysteries reveal about the hidden design of your life.</p>
<p class="cc-feature__meta"><strong>Next class:</strong> Wed, Oct 28 · 11:00 am or 7:00 pm</p>
<div class="cc-feature__cta"><a class="cc-btn" href="#">Register</a></div></div></article>
<article class="cc-feature"><div class="cc-feature__date" aria-hidden="true"><span class="cc-feature__m">Nov</span><span class="cc-feature__d">17</span><span class="cc-feature__w">Tue</span></div>
<div class="cc-feature__body"><p class="cc-feature__kicker">Rosh Chodesh Society</p><h3 class="cc-feature__title cc-head">NEXT GENesis</h3>
<p class="cc-feature__desc">Seven monthly evenings reading the first stories of Genesis as a mirror of the soul, with Mushky Dubov. Dinner served.</p>
<p class="cc-feature__meta"><strong>First evening:</strong> Tue, Nov 17</p>
<div class="cc-feature__cta"><a class="cc-btn" href="#">Register</a></div></div></article></div>"""
    body = f"""<div id="content">
<section class="cc-section" style="padding-top:72px;padding-bottom:72px"><div class="cc-wrap cc-split" style="align-items:center">
<div><p class="cc-eyebrow">Adult education</p>
<h1 class="cc-h2 cc-head" style="font-size:clamp(40px,5.4vw,66px)">Jewish learning, at its very best</h1>
<p class="cc-lede">Brilliant courses, engaging teachers and great company. Each season brings a new course from the Rohr Jewish Learning Institute, taught by Rabbi Levi Dubov, alongside weekly classes and a monthly series for women. Whatever your background, there's a seat for you.</p>
<ul class="cc-stats"><li><strong>{n}</strong><span>courses taught</span></li><li><strong>{n_women}</strong><span>women's series</span></li><li><strong>{n_rec}</strong><span>with recordings</span></li></ul>
<div class="cc-hero__ctas" style="margin-top:32px"><a class="cc-btn" href="#now">This season's courses</a><a class="cc-btn cc-btn--ghost" href="#library">Browse the library</a></div></div>
{mosaic}
</div></section>
<section class="cc-section cc-section--cream" id="now"><div class="cc-wrap">
<div class="cc-head-row"><div><p class="cc-eyebrow">Now enrolling</p><h2 class="cc-h2 cc-head">This season</h2>
<p class="cc-lede">The first class of every course is yours to try, commitment-free.</p></div></div>
{now}
</div></section>
<section class="cc-section" id="library"><div class="cc-wrap">
<div class="cc-head-row"><div><p class="cc-eyebrow">The course library</p><h2 class="cc-h2 cc-head">Every course we've taught</h2>
<p class="cc-lede">From Kabbalah to Talmudic law, Jewish history to the art of prayer. Tap any course for its lessons and recordings.</p></div></div>
<div class="cc-chips" role="group" aria-label="Filter courses">{chips}</div>
{cards}
</div></section>
<section class="cc-section cc-section--cream"><div class="cc-wrap">
{strip}
<div class="cc-split" style="margin-top:48px">
<div><p class="cc-eyebrow">Listen anywhere</p><h2 class="cc-h2 cc-head">Classes on the go</h2>
<p class="cc-lede">Rabbi Dubov's weekly classes, and the full lessons of recent courses, are free on your favorite podcast app.</p></div>
<div class="cc-partner__ctas"><a class="cc-btn" href="https://podcasters.spotify.com/pod/show/torah-deep-dive" target="_blank" rel="noopener">Torah Deep Dive podcast</a>
<a class="cc-btn cc-btn--ghost" href="https://podcasts.apple.com/podcast/id1600754756" target="_blank" rel="noopener">Tanya podcast</a></div></div>
</div></section>
</div>
<dialog class="cc-dialog" id="cc-course"><form method="dialog"><button class="cc-dialog__x" aria-label="Close">&#215;</button></form><div id="cc-course-body"></div></dialog>
<script>window.CC_COURSES = {data_js};</script>"""
    js = r"""<script>(function(){var d=document,bs=d.querySelectorAll('.cc-chips button');
bs.forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.f;bs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
d.querySelectorAll('.cc-course').forEach(function(k){k.hidden=!(f==='all'||(f==='rec'?k.dataset.rec==='1':f==='women'?k.dataset.women==='1':k.dataset.topic===f));});});});
var dlg=d.getElementById('cc-course'),body=d.getElementById('cc-course-body'),L={youtube:'Watch the classes',spotify:'Listen on the podcast','wix-audio':'Audio (moving from the old site)'};
function el(t,c,x){var n=d.createElement(t);if(c){n.className=c;}if(x){n.textContent=x;}return n;}
d.querySelectorAll('.cc-course__open').forEach(function(b){b.addEventListener('click',function(){var c=window.CC_COURSES[+b.dataset.i];body.textContent='';
var ci=b.closest('.cc-course').querySelector('.cc-course__cover');if(ci){var fig=ci.cloneNode(true);fig.className='cc-dialog__cover';body.appendChild(fig);}
body.appendChild(el('p','cc-eyebrow',c.s));body.appendChild(el('h2','cc-h2 cc-head',c.t));if(c.d){body.appendChild(el('p','cc-lede',c.d));}
if(c.l.length){body.appendChild(el('h3','cc-dialog__h','Lessons'));var ol=el('ol','cc-dialog__lessons');c.l.forEach(function(x){ol.appendChild(el('li','',x));});body.appendChild(ol);}
if(c.r.length){var r=el('div','cc-hero__ctas');c.r.forEach(function(x){if(x.t==='wix-audio'){r.appendChild(el('span','cc-chip',L[x.t]));}else{var a=el('a','cc-btn',L[x.t]);a.href=x.u;a.target='_blank';a.rel='noopener';r.appendChild(a);}});body.appendChild(r);}
dlg.showModal();});});
dlg.addEventListener('click',function(ev){if(ev.target===dlg){dlg.close();}});
d.getElementById('pv-menu-open').addEventListener('click',function(){d.getElementById('pv-nav').classList.add('is-open');});
d.getElementById('pv-menu-close').addEventListener('click',function(){d.getElementById('pv-nav').classList.remove('is-open');});
d.querySelectorAll('a[href="#"]').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();});});})();</script>"""
    return f"""<!doctype html>
<html lang="en" class="cc-on"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="{bp.FONTS}">
<style>{(ROOT / "src/theme.css").read_text()}
{bp.SHIM}</style></head>
<body class="cco_body cc-footer-built">
{bp.header()}
{body}
{bp.footer()}
{js}
</body></html>"""


if __name__ == "__main__":
    site = page()
    shell = (ROOT / "preview/shell.html").read_text()
    shell = shell.replace("<title>BH Chabad Homepage Preview</title>", "<title>BH Chabad Courses Preview</title>")
    shell = shell.replace("<h1>Homepage preview</h1>", "<h1>Courses page preview</h1>")
    shell = shell.replace('title="BH Chabad homepage preview"', 'title="BH Chabad courses preview"')
    shell = shell.replace("Photos are samples until yours arrive; testimonials are placeholders. Buttons don't go anywhere yet.",
                          "Real class photos from your folders. Course list from the old site, including its hidden pages. Watch and podcast links are live.")
    (ROOT / "preview/courses-preview.html").write_text(shell.replace("%%SITE%%", site.replace("</script", "<\\/script")))
    (ROOT / "preview/courses-standalone.html").write_text(site)
    print("ok", len(site))
