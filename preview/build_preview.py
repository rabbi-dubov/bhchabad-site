#!/usr/bin/env python3
"""Builds a standalone, shareable preview of the new homepage (no ChabadOne needed).

The site document uses the real src/theme.css plus a small shim that stands in for the
ChabadOne platform stylesheets. Markup mirrors what src/theme.js builds on the live site.
Output: preview/homepage-preview.html (an Artifact page: no doctype/html/head/body tags).
"""
import html, json, pathlib, urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = {p.stem: p.read_text().strip() for p in (ROOT / "preview/img").glob("*.txt")}
THEME = (ROOT / "src/theme.css").read_text()
FONTS = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Instrument+Sans:wght@400;500;600;700&display=swap"


def svg_icon(body):
    s = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#871A39" '
         'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>')
    return "data:image/svg+xml," + urllib.parse.quote(s)


ICONS = {
    "events": svg_icon('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    "classes": svg_icon('<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>'),
    "donate": svg_icon('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    "contact": svg_icon('<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="m4 7 8 6 8-6"/>'),
}

SLIDES = [
    {"title": "Your Jewish home in Bloomfield Hills",
     "sub": "Learning, holidays and community for every Jew, whatever your background. Come as you are.",
     "cta": ["See what's coming up", "#events"], "img": "hero1"},
    {"title": "Kabbalah and the Hidden Architecture of You",
     "sub": "Reincarnation, soulmates, dreams, names: a six-week JLI course with Rabbi Levi Dubov. Starts Tuesday, October 27 or Wednesday, October 28.",
     "cta": ["Register", "#events"], "img": "hero2"},
    {"title": "NEXT GENesis",
     "sub": "Seven monthly evenings reading the first stories of Genesis as a mirror of the soul, with Mushky Dubov. Dinner served. Begins Tuesday, November 17.",
     "cta": ["Join the series", "#events"], "img": "hero1"},
]

SHIM = """
/* ---- preview only: the earlier (straight brand) palette, for side-by-side comparison ---- */
html.pv-original {
  --cc-ink: #5D0B30; --cc-ink-deep: #5D0B30; --cc-primary: #871A39; --cc-primary-2: #6E1530;
  --cc-accent-text: #A8461A; --cc-accent-on-dark: #F27730; --cc-cream: #FAF6F3; --cc-text: #2E2E2D;
  --cc-muted: #555555; --cc-on-dark: #F7EEF1; --cc-on-dark-muted: #E4C7D1; --cc-line: #E8E1DC; --cc-line-dark: #7A2A4B;
}
/* ---- preview shim: stands in for ChabadOne's own stylesheets ---- */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; }
img { max-width: 100%; }
a { color: var(--cc-primary); }
p { margin: 0 0 1em; }
#header .header-wrapper { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
#header_branding { display: flex; align-items: center; }
#header_branding a.site_title { display: block; }
.main_menu_container { border-collapse: collapse; }
.main_menu_container td { padding: 0; vertical-align: middle; }
#tabContentMain .co_menu_item span.parent { display: block; padding: 0 12px; }
#tabContentMain .co_menu_item span.parent a { text-decoration: none; display: inline-block; padding: 8px 0; }
.cs-mobile-menu-open, .cs-mobile-menu-close { display: none; background: none; border: 0; cursor: pointer; font-size: 26px; line-height: 1; padding: 8px; color: var(--cc-ink); }
@media (max-width: 1024px) {
  .cs-mobile-menu-open { display: block; }
  #header .site-nav-wrapper { display: none; position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 86vw); z-index: 2000; padding: 64px 24px 24px; overflow-y: auto; box-shadow: var(--cc-shadow-lg); }
  #header .site-nav-wrapper.is-open { display: block; }
  #header .site-nav-wrapper .cs-mobile-menu-close { display: block; position: absolute; top: 12px; right: 12px; color: var(--cc-white); }
  .main_menu_container, .main_menu_container tbody, .main_menu_container tr, .main_menu_container td { display: block; width: 100%; }
  #tabContentMain .co_menu_item span.parent { padding: 0; border-bottom: 1px solid var(--cc-line-dark); }
  #tabContentMain .co_menu_item span.parent a { padding: 14px 0; font-size: 17px; }
}
#footer .footer_container { max-width: var(--cc-max); margin: 0 auto; }
#footer .footer3 { display: none; }
.pv-note { background: var(--cc-accent-soft); color: var(--cc-ink); font-size: 13px; line-height: 1.5; text-align: center; padding: 10px 16px; font-family: var(--cc-font-body); }
.pv-note strong { font-weight: 700; }
.cc-program__tag { position: absolute; top: 12px; left: 12px; z-index: 2; background: rgba(255,255,255,.92); color: var(--cc-ink); font: 700 11px/1 var(--cc-font-body); letter-spacing: .08em; text-transform: uppercase; padding: 6px 8px; border-radius: 4px; }
.cc-subscribe__form form { display: flex; flex-wrap: wrap; gap: 12px; }
.cc-subscribe__form input { flex: 1 1 180px; height: 52px; border-radius: var(--cc-radius-sm); padding: 0 16px; font: 16px var(--cc-font-body); color: var(--cc-text); background: var(--cc-white); border: 1px solid var(--cc-field-border); }
.cc-subscribe__form button { height: 52px; }
"""

e = html.escape


def hero():
    return f'''<section class="cc-hero" aria-label="Welcome"><div class="cc-wrap">
<div class="cc-hero__text"><p class="cc-eyebrow">Shalom and welcome</p>
<h1 class="cc-hero__title cc-head">Your Jewish home in Bloomfield Hills</h1>
<p class="cc-hero__sub">Whether you're new to Jewish life or looking to go deeper, there's a place for you here: classes, holidays and good company, whatever your background.</p>
<div class="cc-hero__ctas"><a class="cc-btn cc-btn--light" href="#events">See what's coming up</a><a class="cc-btn cc-btn--ghost" href="#" style="color: var(--cc-white) !important">About us</a></div></div>
<div class="cc-hero__media"><div class="cc-hero__img" role="img" aria-label="Challah on a Shabbat table" style="background-image:url('{IMG["hero1"]}')"></div></div>
</div></section>'''


def quick():
    items = [("Upcoming events", "events"), ("Weekly classes", "classes"), ("Donate", "donate"), ("Contact us", "contact")]
    lis = "".join(f'<li><a href="#"><img src="{ICONS[k]}" alt="">{e(t)}</a></li>' for t, k in items)
    return f'<nav class="cc-quick" aria-label="I would like to..."><ul>{lis}</ul></nav>'


def intro():
    return '''<section class="cc-section cc-intro" id="about" aria-label="Welcome"><div class="cc-wrap">
<p class="cc-eyebrow">Welcome</p><h2 class="cc-h2 cc-head">There's a place for you here.</h2>
<p class="cc-lede">Chabad Jewish Center of Bloomfield Hills is here for every Jew in our community: to learn, to celebrate, and to bring a little more light into the world. Whether you're new to Jewish life or looking to go deeper, you'll find a warm welcome, good company and something meaningful to take home.</p>
<p style="margin-top:24px"><a class="cc-link" href="#">Get to know us</a></p></div></section>'''


def events():
    feats = [
        ("Oct", "28", "Wed", "JLI course · 6 weeks", "Kabbalah and the hidden architecture of you",
         "Reincarnation, soulmates, dreams, names: what these and other mysteries reveal about the hidden design of your life. Six weeks of kabbalah that answer some of life's biggest questions.",
         "<strong>Next class:</strong> Wed, Oct 28 · 11:00 am or 7:00 pm"),
        ("Nov", "17", "Tue", "Rosh Chodesh Society", "NEXT GENesis",
         "Seven monthly evenings reading the first stories of Genesis as a mirror of the soul, with Mushky Dubov. Dinner served.",
         "<strong>First evening:</strong> Tue, Nov 17"),
    ]
    cards = "".join(f'''<article class="cc-feature"><div class="cc-feature__date" aria-hidden="true"><span class="cc-feature__m">{m}</span><span class="cc-feature__d">{dd}</span><span class="cc-feature__w">{w}</span></div>
<div class="cc-feature__body"><p class="cc-feature__kicker">{e(k)}</p><h3 class="cc-feature__title cc-head">{e(t)}</h3><p class="cc-feature__desc">{e(x)}</p>
<p class="cc-feature__meta">{meta}</p><div class="cc-feature__cta"><a class="cc-btn" href="#">Register</a></div></div></article>''' for m, dd, w, k, t, x, meta in feats)
    return f'''<section class="cc-section cc-section--cream cc-events" id="events" aria-labelledby="cc-events-h"><div class="cc-wrap">
<div class="cc-head-row"><div><p class="cc-eyebrow">Coming up</p><h2 class="cc-h2 cc-head" id="cc-events-h">Discover the joy and meaning in Judaism</h2>
<p class="cc-lede">The first class of every course is yours to try, commitment-free.</p></div>
<div class="cc-events__nav"><a class="cc-btn cc-btn--ghost" href="#">Full calendar</a></div></div>
<div class="cc-features">{cards}</div></div></section>'''


def programs():
    ps = [("Adult education", "p1"), ("Women's learning", "p2"), ("Weekly classes", "p3"), ("Holidays and celebrations", "p4")]
    cards = "".join(f'''<a class="cc-program" href="#"><span class="cc-program__tag">Sample photo</span><div class="cc-program__img" style="background-image:url('{IMG[k]}')"></div>
<div class="cc-program__label"><h3 class="cc-program__title cc-head">{e(t)}</h3><span class="cc-program__more">Learn more &#8594;</span></div></a>''' for t, k in ps)
    return f'''<section class="cc-section cc-programs" aria-labelledby="cc-programs-h"><div class="cc-wrap">
<div class="cc-head-row"><div><p class="cc-eyebrow">Our programs</p><h2 class="cc-h2 cc-head" id="cc-programs-h">Programs for the whole community</h2></div></div>
<div class="cc-grid cc-grid--4">{cards}</div></div></section>'''


def testimonials():
    return '''<section class="cc-section cc-section--cream cc-testimonials" aria-labelledby="cc-tm-h"><div class="cc-wrap">
<p class="cc-eyebrow">Testimonials</p><h2 class="cc-h2 cc-head" id="cc-tm-h">In their words</h2>
<figure class="cc-testimonial" aria-live="polite"><p class="cc-testimonial__quote" id="pv-t-q">&#8220;Placeholder: your community's real words will appear here, one quote at a time, in this large type.&#8221;</p>
<p class="cc-testimonial__by" id="pv-t-by"><strong>Name of the person</strong><span>Context line, for example JLI student since 2019</span></p></figure>
<div class="cc-testimonials__nav"><button type="button" class="cc-round" aria-label="Previous testimonial" data-dir="-1">&#8592;</button>
<div class="cc-hero__dots cc-testimonials__dots" role="group" aria-label="Choose a testimonial"><button type="button" aria-label="Testimonial 1" aria-current="true" data-i="0"></button><button type="button" aria-label="Testimonial 2" aria-current="false" data-i="1"></button></div>
<button type="button" class="cc-round" aria-label="Next testimonial" data-dir="1">&#8594;</button></div></div></section>'''


def partner():
    return '''<section class="cc-section cc-section--ink cc-partner" aria-labelledby="cc-partner-h"><div class="cc-wrap cc-split">
<div><h2 class="cc-h2 cc-head" id="cc-partner-h">Partner with us</h2><p class="cc-lede">Chabad of Bloomfield Hills is funded entirely by friends and supporters like you. Every gift keeps our classes, holidays and programs open to everyone.</p></div>
<div class="cc-partner__ctas"><a class="cc-btn cc-btn--accent" href="#">Donate</a><a class="cc-btn cc-btn--ghost" href="#" style="color: var(--cc-white) !important">Dedicate a class or event</a></div></div></section>'''


def subscribe():
    return '''<section class="cc-section cc-subscribe" aria-labelledby="cc-sub-h"><div class="cc-wrap cc-split">
<div><h2 class="cc-h2 cc-head" id="cc-sub-h">Stay in the loop</h2><p class="cc-lede">Classes, events and holiday celebrations in Bloomfield Hills, straight to your inbox.</p></div>
<div class="cc-subscribe__form"><form id="pv-sub" novalidate><label class="cc-sr" for="pv-sub-name">First name</label><input id="pv-sub-name" placeholder="First name">
<label class="cc-sr" for="pv-sub-email">Email</label><input id="pv-sub-email" type="email" placeholder="Email address"><button class="cc-btn" type="submit">Subscribe</button></form></div></div></section>'''


def header():
    menu = ["Online Resources", "Jewish.tv", "Magazine", "Parshah&nbsp;(Weekly Torah)", "Jewish Holidays"]
    tds = "".join(f'<td class="co_menu_item"><span class="parent"><div><a href="#">{m}</a></div></span></td>' for m in menu)
    tds += '<td class="co_menu_item donate_link"><span class="parent"><div><a href="#">Donate</a></div></span></td>'
    return f'''<div class="cc-shabbat-bar" role="note"><div class="cc-wrap"><a href="#"><strong>Shabbat in Bloomfield Hills</strong><span class="cc-shabbat-bar__full"> · Candle lighting 6:20 pm (Friday) · Shabbat ends 7:19 pm · Torah portion: Lech-Lecha</span><span class="cc-shabbat-bar__short"> · candles 6:20 pm</span></a></div></div>
<div id="header" class="on-scroll"><div class="wrapper header-wrapper">
<div class="clearfix branding-search"><div id="header_branding" class="no_outline logo">
<div class="float_left site-logo-wrapper"><a href="#"><img src="{IMG["logo"]}" alt="Chabad"></a></div>
<a href="#" class="site_title">Chabad Jewish Center<span class="cc-title-sub">Bloomfield Hills</span></a></div></div>
<button type="button" class="cs-mobile-menu-open" aria-label="Open menu" id="pv-menu-open">&#9776;</button>
<div class="site-nav-wrapper" id="pv-nav"><button type="button" class="cs-mobile-menu-close" aria-label="Close menu" id="pv-menu-close">&#215;</button>
<div id="co_menu_container" class="co_menu_container"><table class="main_menu_container"><tbody><tr id="tabContentMain">{tds}</tr></tbody></table></div></div>
</div></div>'''


def footer():
    return '''<div id="footer"><div id="cc-footer" class="cc-footer"><div class="cc-footer__grid">
<div><p class="cc-footer__brand">Chabad Jewish Center of Bloomfield Hills</p><p class="cc-footer__tag">A warm, welcoming home for every Jew in Bloomfield Hills: learning, holidays and community, whatever your background.</p></div>
<div><h4>Explore</h4><ul><li><a href="#">Online Resources</a></li><li><a href="#">Jewish.tv</a></li><li><a href="#">Magazine</a></li><li><a href="#">Parshah (Weekly Torah)</a></li><li><a href="#">Jewish Holidays</a></li></ul></div>
<div><h4>Get involved</h4><ul><li><a href="#">Upcoming events</a></li><li><a href="#">Weekly email</a></li><li><a href="#">Contact us</a></li><li><a href="#">Donate</a></li></ul></div>
<div><h4>Visit</h4><address>3805 Quarton Road<br>Bloomfield Hills, MI 48302<br>248-949-6210<br>info@bhchabad.org</address></div>
</div><div class="cc-footer__bottom"></div></div>
<div class="footer_container footer_text">Powered by Chabad.org &#169; 1993-2026 &#183; Privacy Policy</div></div>'''


SITE_JS = """
(function(){
  var T = [
    {q:"\\u201cPlaceholder: your community's real words will appear here, one quote at a time, in this large type.\\u201d", n:"Name of the person", c:"Context line, for example JLI student since 2019"},
    {q:"\\u201cPlaceholder: a second quote. Real testimonials come from the Testimonials page you will fill in.\\u201d", n:"Another name", c:"Context line, for example Shabbat dinner guest"}];
  var d = document, ti = 0;
  function $(id){ return d.getElementById(id); }
  var tdots = d.querySelectorAll('.cc-testimonials__dots button');
  function showT(i){ ti = (i + T.length) % T.length; var t = T[ti];
    $('pv-t-q').textContent = t.q; $('pv-t-by').innerHTML = '';
    var st = d.createElement('strong'); st.textContent = t.n; var sp = d.createElement('span'); sp.textContent = t.c;
    $('pv-t-by').appendChild(st); $('pv-t-by').appendChild(sp);
    tdots.forEach(function(b, k){ b.setAttribute('aria-current', k === ti ? 'true' : 'false'); }); }
  tdots.forEach(function(b, k){ b.addEventListener('click', function(){ showT(k); }); });
  d.querySelectorAll('.cc-testimonials__nav .cc-round').forEach(function(b){ b.addEventListener('click', function(){ showT(ti + (+b.dataset.dir)); }); });
  $('pv-menu-open').addEventListener('click', function(){ $('pv-nav').classList.add('is-open'); });
  $('pv-menu-close').addEventListener('click', function(){ $('pv-nav').classList.remove('is-open'); });
  d.querySelectorAll('a[href="#"]').forEach(function(a){ a.addEventListener('click', function(ev){ ev.preventDefault(); }); });
  $('pv-sub').addEventListener('submit', function(ev){ ev.preventDefault(); });
  window.addEventListener('scroll', function(){ d.body.classList.toggle('cc-scrolled', window.scrollY > 10); }, {passive: true});
})();
"""

def main():
    site = f'''<!doctype html>
    <html lang="en" class="cc-on cc-home-page cc-shell-ready"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="{FONTS}">
    <style>{THEME}
    {SHIM}</style></head>
    <body class="cco_body home cc-footer-built">
    {header()}
    <div id="content"><div id="cc-home">
    {hero()}
    {events()}
    {programs()}
    {testimonials()}
    {partner()}
    {subscribe()}
    </div></div>
    {footer()}
    <script>{SITE_JS}</script>
    </body></html>'''

    # Escape for embedding inside a <script type="text/plain"> block
    embedded = site.replace("</script", "<\\/script")

    SHELL = (ROOT / "preview/shell.html").read_text()
    out = SHELL.replace("%%SITE%%", embedded)
    (ROOT / "preview/homepage-preview.html").write_text(out)
    (ROOT / "preview/site-standalone.html").write_text(site)
    print("ok", len(out))


if __name__ == '__main__':
    main()
