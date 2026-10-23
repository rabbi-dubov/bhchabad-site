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

# season, sort key, title, tagline, topic, video playlist id, audio (on the old site, being moved)
COURSES = [
    ("Summer 2026", "2026-3", "Sinai and Civics", "How Jewish values helped shape American ideals", "law", None, False),
    ("Spring 2026", "2026-2", "For All Humankind", "Your Judaism holds a message the world wants to hear", "big", None, False),
    ("Winter 2026", "2026-1", "Captivating Cases in Rabbinic Responsa", "The surprising questions your ancestors asked their rabbis", "law", None, False),
    ("Fall 2025", "2025-4", "The Kabbalah of Meaning", "Finding the purpose that connects all parts of life", "soul", None, False),
    ("Summer 2021", "2021-3", "Judaism Decoded", "The logic behind Torah law and Talmudic debate", "law", None, False),
    ("Spring 2021", "2021-2", "This Can Happen", "A credible case for feeling good about the future", "big", "PLbHO_Q5DmD_Mrplg7dJW0resJH-m432Xq", False),
    ("Winter 2021", "2021-1", "Journey of the Soul", "A fresh look at life, death and the rest, in peace", "soul", "PLbHO_Q5DmD_OYo3Hi1VkTcC7NrH0q2ijY", False),
    ("Fall 2020", "2020-5", "Secrets of the Bible", "Iconic stories, mystical meanings and lessons for life", "torah", "PLbHO_Q5DmD_NTBpY5gkghY7worBkSyZKJ", False),
    ("Fall 2020", "2020-4", "High Holidays: Making It Meaningful", "Making these special days meaningful at home", "torah", "PLbHO_Q5DmD_PjdtLUb8LcJigU5pAKPFXE", False),
    ("Summer 2020", "2020-3", "Pirkei Avot Studies", "Life wisdom from the Ethics of Our Fathers", "life", None, True),
    ("Spring 2020", "2020-2b", "Judaism at Home", "For when the only place Judaism can thrive is at home", "life", None, True),
    ("Spring 2020", "2020-2a", "The Jewish Course of Why", "50 of the biggest questions about Jews and Judaism", "big", None, True),
    ("Winter 2020", "2020-1", "Judaism's Gifts to the World", "How major Jewish ideas became universal values", "law", None, True),
    ("Fall 2019", "2019-4", "Worrier to Warrior", "Jewish secrets to feeling good however you feel", "life", None, True),
    ("Summer 2019", "2019-3", "Paradigm Shift", "Transformational life teachings of the Lubavitcher Rebbe", "soul", None, True),
    ("Spring 2019", "2019-2", "With All My Heart", "The Jewish art of prayer and spiritual experience", "torah", None, True),
    ("Winter 2019", "2019-1", "Crime and Consequence", "A Jewish look at conviction, sentencing and rehabilitation", "law", None, True),
    ("Fall 2018", "2018-4", "Wrestling with Faith", "Tackling the biggest questions and challenges to faith", "big", None, False),
    ("Summer 2018", "2018-3", "Heaven on Earth", "A virtual tour of our Holy Temple", "torah", None, False),
    ("Spring 2018", "2018-2", "What Is?", "Rethinking everything we know about our universe", "soul", None, False),
    ("Winter 2018", "2018-1", "Communication: Its Art and Soul", "Reclaim the lost art of human connection", "life", None, False),
    ("Fall 2017", "2017-4", "Great Debates in Jewish History", "Six epic debates that rocked the Jewish world", "law", None, False),
]


def book(c):
    season, _, title, tag, topic, yt, audio = c
    label, cls = T[topic]
    foot = []
    if yt:
        foot.append(f'<a href="{YT}{yt}" target="_blank" rel="noopener">&#9654; Watch</a>')
    if audio:
        foot.append('<span title="Audio recordings are being moved from the old site">&#9835; Audio</span>')
    rec = "1" if (yt or audio) else "0"
    return (f'<article class="cc-book cc-book--{cls}" data-topic="{topic}" data-rec="{rec}" aria-label="{e(title)}, {e(season)}">'
            f'<span class="cc-book__season">{e(season)}</span><h3 class="cc-book__title">{e(title)}</h3>'
            f'<p class="cc-book__tag">{e(tag)}</p><div class="cc-book__foot">{"".join(foot)}</div></article>')


def page():
    years = {}
    for c in sorted(COURSES, key=lambda c: c[1], reverse=True):
        years.setdefault(c[1][:4], []).append(c)
    n = len(COURSES)
    n_rec = sum(1 for c in COURSES if c[5] or c[6])
    first = min(c[1][:4] for c in COURSES)
    chips = '<button type="button" aria-pressed="true" data-f="all">All courses</button>'
    chips += "".join(f'<button type="button" aria-pressed="false" data-f="{k}"><i style="background: var(--cc-book-{cls[1]})"></i>{e(label)}</button>' for k, label, cls in TOPICS)
    chips += '<button type="button" aria-pressed="false" data-f="rec">With recordings</button>'
    shelves = '<div class="cc-shelf">' + "".join(f'<div class="cc-shelf__year" role="heading" aria-level="2"><strong>{y}</strong><span>{len(cs)} course{"s" if len(cs) > 1 else ""}</span></div>' + "".join(book(c) for c in cs) for y, cs in years.items()) + '</div>'
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
<p class="cc-lede">Since {first}, our courses have explored everything from Kabbalah and the soul to Talmudic law and the art of prayer. Browse every course we've offered, and watch or listen to the recordings.</p>
<ul class="cc-stats"><li><strong>{n}</strong><span>courses taught</span></li><li><strong>{first}</strong><span>teaching since</span></li><li><strong>{n_rec}</strong><span>with recordings</span></li></ul>
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
</div>'''
    js = '''<script>(function(){var d=document,bs=d.querySelectorAll('.cc-chips button');
bs.forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.f;bs.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
d.querySelectorAll('.cc-book').forEach(function(k){k.hidden=!(f==='all'||(f==='rec'?k.dataset.rec==='1':k.dataset.topic===f));});
d.querySelectorAll('.cc-shelf__year').forEach(function(y){var n=y.nextElementSibling,any=false;while(n&&n.classList.contains('cc-book')){if(!n.hidden){any=true;}n=n.nextElementSibling;}y.hidden=!any;});});});
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
