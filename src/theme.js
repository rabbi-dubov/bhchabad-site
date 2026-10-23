/* ==========================================================================
   BH CHABAD — SITE SCRIPT (Chabad Jewish Center of Bloomfield Hills)
   Runs at the end of <body> on every page of the ChabadOne site.
   - Never edits content on the server; only rearranges/decorates the page.
   - Homepage: builds a custom layout ("shell") from the LIVE ChabadOne widgets,
     so everything stays editable in Site Control > Home Page.
   Kill switch: set CC_ENABLED to false.
   ========================================================================== */
(function () {
  "use strict";
  var CC_ENABLED = true;
  var d = document, html = d.documentElement;
  if (!CC_ENABLED) { html.className = html.className.replace(/\bcc-on\b/g, ""); return; }
  if (window.__ccThemeLoaded) { return; }
  window.__ccThemeLoaded = true;

  /* ---------- Site facts (edit here) ---------- */
  var CC = {
    org: "Chabad Jewish Center of Bloomfield Hills",
    titleMain: "Chabad Jewish Center",
    titleSub: "Bloomfield Hills",
    // Show only part of the square logo file in the header (fractions of the image: x, y, width, height).
    // Current logo = emblem on top, name underneath; we show the emblem and set the name as live text.
    // Set to null to show the whole logo image.
    logoCrop: { x: 0.215, y: 0.18, w: 0.57, h: 0.39 },
    tagline: "A warm, welcoming home for every Jew in Bloomfield Hills: learning, holidays and community, whatever your background.",
    street: "3805 Quarton Road",
    city: "Bloomfield Hills, MI 48302",
    mapUrl: "https://maps.google.com/?q=3805+Quarton+Road+Bloomfield+Hills+MI+48302",
    phone: "248-949-6210",
    email: "info@bhchabad.org",
    eventsUrl: "/418840",
    eventsSource: "/tools/events/default.htm",
    aboutUrl: "/about",
    donateUrl: "/4970020",
    contactUrl: "/tools/feedback.asp",
    subscribeUrl: "/tools/subscribe/default.htm",
    // Testimonials live on an ordinary ChabadOne page. Each one = a Quote (blockquote) whose last line
    // starts with a dash: "— Name, context". The homepage reads them; no quotes = no section.
    testimonialsUrl: null,   // set to "/testimonials" once that page exists
    shabbatPlace: "Bloomfield Hills",
    home: {
      // Homepage sections, in order. Also available: "quick" (icon links strip), "intro" (message widget).
      sections: ["hero", "events", "programs", "testimonials", "partner", "subscribe"],
      heroEyebrow: "Shalom and welcome",
      heroCta: "See what's coming up",
      secondaryCta: { text: "About us", href: "/about" },
      introEyebrow: "Welcome",
      eventsEyebrow: "Coming up",
      eventsTitle: "Discover the joy and meaning in Judaism",
      eventsLine: "The first class of every course is yours to try, commitment-free.",
      eventsAll: "Full calendar",
      // Event-name prefixes turned into a readable label on the course card
      prefixes: { "JLI": "JLI course", "RCS": "Rosh Chodesh Society" },
      programsEyebrow: "Our programs",
      programsTitle: "Programs for the whole community",
      testimonialsEyebrow: "Testimonials",
      testimonialsTitle: "In their words",
      partner: {
        title: "Partner with us",
        text: "Chabad of Bloomfield Hills is funded entirely by friends and supporters like you. Every gift keeps our classes, holidays and programs open to everyone.",
        donate: "Donate",
        dedicate: "Dedicate a class or event",
        dedicateHref: "mailto:rabbi@bhchabad.org?subject=Dedicating%20a%20class%20or%20event"
      },
      subscribeTitle: "Stay in the loop",
      subscribeText: "Classes, events and holiday celebrations in Bloomfield Hills, straight to your inbox."
    }
  };

  /* ---------- Helpers ---------- */
  function q(s, c) { return (c || d).querySelector(s); }
  function qa(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function txt(n) {
    if (!n) { return ""; }
    // the platform sometimes wraps long menu labels with <br>; treat those as spaces
    var c = n.cloneNode(true), br = c.querySelectorAll("br");
    for (var i = 0; i < br.length; i++) { br[i].parentNode.replaceChild(document.createTextNode(" "), br[i]); }
    return (c.textContent || "").replace(/\s+/g, " ").trim();
  }
  function h(tag, attrs, kids) {
    var n = d.createElement(tag), k;
    if (attrs) {
      for (k in attrs) {
        if (!attrs.hasOwnProperty(k) || attrs[k] == null) { continue; }
        if (k === "text") { n.textContent = attrs[k]; }
        else if (k === "class") { n.className = attrs[k]; }
        else if (k === "style") { n.setAttribute("style", attrs[k]); }
        else { n.setAttribute(k, attrs[k]); }
      }
    }
    (kids || []).forEach(function (c) { if (c) { n.appendChild(typeof c === "string" ? d.createTextNode(c) : c); } });
    return n;
  }
  function bgUrl(node) {
    if (!node) { return ""; }
    var s = node.getAttribute("style") || "";
    var m = s.match(/url\((['"]?)(.*?)\1\)/) || (getComputedStyle(node).backgroundImage || "").match(/url\((['"]?)(.*?)\1\)/);
    if (m && m[2]) { return m[2].replace(/"/g, ""); }
    if (node.tagName === "IMG" && !/spacer\.gif/.test(node.src)) { return node.src; }
    return "";
  }
  function addClass(n, c) { if (n && (" " + n.className + " ").indexOf(" " + c + " ") < 0) { n.className += " " + c; } }
  // Fetch a same-site page at most once per `ttl` per visitor: the parsed result (or the lack of one)
  // is kept in localStorage, so ordinary browsing does not send extra requests to ChabadOne.
  function cachedPage(key, ttl, url, parse, done) {
    var now = Date.now();
    try { var c = JSON.parse(localStorage.getItem(key) || "null"); if (c && now - c.at < ttl) { done(c.d); return; } } catch (e) {}
    if (!url || !window.fetch || !window.DOMParser) { done(null); return; }
    function save(v) { try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), d: v })); } catch (e) {} done(v); }
    fetch(url, { credentials: "same-origin" }).then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (t) { save(t ? parse(new DOMParser().parseFromString(t, "text/html")) : null); })
      .catch(function () { save(null); });
  }
  function onReady(fn) { if (d.readyState === "loading") { d.addEventListener("DOMContentLoaded", fn); } else { fn(); } }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Header: scrolled state + two-line site title ---------- */
  function header() {
    var body = d.body, ticking = false;
    function upd() { ticking = false; if (window.scrollY > 4) { addClass(body, "cc-scrolled"); } else { body.className = body.className.replace(/\s?cc-scrolled\b/g, ""); } }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; window.requestAnimationFrame(upd); } }, { passive: true });
    upd();
    var lw = q("#header_branding .site-logo-wrapper");
    if (lw && CC.logoCrop) {
      addClass(lw, "cc-logo-crop");
      ["x", "y", "w", "h"].forEach(function (k) { lw.style.setProperty("--cc-crop-" + k, String(CC.logoCrop[k])); });
    }
    var t = q("#header_branding a.site_title");
    if (t && !q(".cc-title-sub", t)) {
      var sub = q(".site_subtitle", t);
      t.textContent = "";
      t.appendChild(d.createTextNode(CC.titleMain));
      t.appendChild(h("span", { "class": "cc-title-sub", text: CC.titleSub }));
      if (sub) { sub.style.display = "none"; t.appendChild(sub); }
      t.setAttribute("aria-label", CC.org + " home");
    }
  }

  /* ---------- 2. Footer: rich multi-column footer ---------- */
  function footer() {
    var f = q("#footer");
    if (!f || q("#cc-footer")) { return; }
    var navLinks = qa("#tabContentMain > .co_menu_item:not(.home):not(.donate_link) > span.parent a").map(function (a) {
      return h("li", null, [h("a", { href: a.getAttribute("href"), text: txt(a) })]);
    });
    var social = qa(".cs-f-social-icons a", f).map(function (a) { return a.cloneNode(true); });
    var grid = h("div", { "class": "cc-footer__grid" }, [
      h("div", null, [
        h("p", { "class": "cc-footer__brand", text: CC.org }),
        h("p", { "class": "cc-footer__tag", text: CC.tagline }),
        social.length ? h("div", { "class": "cs-f-social-icons" }, social) : null
      ]),
      h("div", null, [h("h4", { text: "Explore" }), h("ul", null, navLinks)]),
      h("div", null, [h("h4", { text: "Get involved" }), h("ul", null, [
        h("li", null, [h("a", { href: CC.eventsUrl, text: "Upcoming events" })]),
        h("li", null, [h("a", { href: CC.subscribeUrl, text: "Weekly email" })]),
        h("li", null, [h("a", { href: CC.contactUrl, text: "Contact us" })]),
        h("li", null, [h("a", { href: CC.donateUrl, text: "Donate" })])
      ])]),
      h("div", null, [h("h4", { text: "Visit" }), h("address", null, [
        h("a", { href: CC.mapUrl, target: "_blank", rel: "noopener", text: CC.street }), h("br"),
        CC.city, h("br"),
        h("a", { href: "tel:" + CC.phone.replace(/\D/g, ""), text: CC.phone }), h("br"),
        h("a", { href: "mailto:" + CC.email, text: CC.email })
      ])])
    ]);
    var wrap = h("div", { id: "cc-footer", "class": "cc-footer" }, [grid, h("div", { "class": "cc-footer__bottom" })]);
    f.insertBefore(wrap, f.firstChild);
    addClass(d.body, "cc-footer-built");
  }

  /* ---------- 3. Homepage shell ---------- */
  function readSlides(root) {
    var caps = qa(".captionList li", root), slides = qa(".slide_wrapper", root);
    return caps.map(function (li, i) {
      var big = q("big", li), span = q("span", li), a = q("a.readMore", li);
      var title = txt(big);
      var sub = span ? txt(span).replace(title, "").trim() : "";
      var img = slides[i] ? bgUrl(q("img", slides[i]) || slides[i]) : "";
      return { title: title, sub: sub, href: a ? a.getAttribute("href") : "", cta: txt(a), target: a ? a.getAttribute("target") : "", img: img };
    }).filter(function (s) { return s.title || s.img; });
  }

  // One calm welcome hero from the FIRST slide of the ChabadOne slider (title, text, link, image).
  // Other slides are not shown: dated courses appear in "Coming up" instead (no rotating carousel).
  function heroSection(slides) {
    var s = slides[0];
    if (!s) { return null; }
    var ctaHref = s.href || "#cc-events-h", ctaText = s.href ? (s.cta || "Learn more") : CC.home.heroCta;
    return h("section", { "class": "cc-hero", "aria-label": "Welcome" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-hero__text" }, [
          CC.home.heroEyebrow ? h("p", { "class": "cc-eyebrow", text: CC.home.heroEyebrow }) : null,
          h("h1", { "class": "cc-hero__title cc-head", text: s.title }),
          s.sub ? h("p", { "class": "cc-hero__sub", text: s.sub }) : null,
          h("div", { "class": "cc-hero__ctas" }, [
            h("a", { "class": "cc-btn cc-btn--light", href: ctaHref, target: s.target || null, text: ctaText }),
            h("a", { "class": "cc-btn cc-btn--ghost", href: CC.home.secondaryCta.href, text: CC.home.secondaryCta.text, style: "color: var(--cc-white) !important" })
          ])
        ]),
        s.img ? h("div", { "class": "cc-hero__media" }, [h("div", { "class": "cc-hero__img", role: "img", "aria-label": s.title, style: "background-image:url(\"" + s.img + "\")" })]) : null
      ])
    ]);
  }

  function quickSection(root) {
    var w = q(".widget-4.icon, .icon.custom", root);
    if (!w) { return null; }
    var items = qa(".widget_content .item", w).map(function (it) {
      var a = q(".title a", it) || q("a", it), im = q(".icon img", it);
      if (!a) { return null; }
      return h("li", null, [h("a", { href: a.getAttribute("href"), target: a.getAttribute("target") || null }, [
        im ? h("img", { src: im.getAttribute("src"), alt: "" }) : null, txt(a)
      ])]);
    }).filter(Boolean);
    if (!items.length) { return null; }
    return h("nav", { "class": "cc-quick", "aria-label": txt(q(".widget_header h5", w)) || "Quick links" }, [h("ul", null, items)]);
  }

  /* Shabbat times: read from ChabadOne's candle-lighting widget (homepage), cached for other pages */
  function readShabbat(root) {
    var cl = q(".candlelighting", root);
    if (!cl) { return null; }
    var out = {};
    qa(".times_wrapper .medium_top_padding, .times_wrapper > div", cl).forEach(function (r) {
      var when = txt(q(".when_to_light", r)).toLowerCase(), time = txt(q(".bold", r)), a = q("a", r);
      if (!time) { return; }
      if (!out.candles && /light/.test(when)) { out.candles = time; out.day = a ? txt(a).replace(time, "").replace(/^[\s-]+/, "").split(",")[0] : ""; out.href = a ? a.getAttribute("href") : ""; }
      else if (!out.ends && /ends/.test(when)) { out.ends = time; }
    });
    var pa = q(".parsha_content a", cl);
    if (pa) { out.parsha = txt(pa); out.parshaHref = pa.getAttribute("href"); }
    return out.candles ? out : null;
  }
  function shabbatBar() {
    var KEY = "cc-shabbat-v1", data = null, now = Date.now();
    var hp = q(".hp-table");
    // Cache the result (or the absence of a result) for 6h so inner pages don't refetch "/" every time
    function save(dd) { try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), d: dd || null })); } catch (e) {} }
    if (hp) { data = readShabbat(hp); save(data); }
    function render(dd) {
      if (!dd || q(".cc-shabbat-bar")) { return; }
      var t = (dd.candles || "").toLowerCase();
      var bits = ["Candle lighting " + t + (dd.day ? " (" + dd.day + ")" : "")];
      if (dd.ends) { bits.push("Shabbat ends " + dd.ends.toLowerCase()); }
      if (dd.parsha) { bits.push("Torah portion: " + dd.parsha); }
      var bar = h("div", { "class": "cc-shabbat-bar", role: "note" }, [h("div", { "class": "cc-wrap" }, [
        h("a", { href: dd.href || "/tools/shabbat-holiday-calendar/default.htm" }, [
          h("strong", { text: "Shabbat in " + CC.shabbatPlace }),
          h("span", { "class": "cc-shabbat-bar__full", text: " \u00b7 " + bits.join(" \u00b7 ") }),
          h("span", { "class": "cc-shabbat-bar__short", text: " \u00b7 candles " + t })
        ])
      ])]);
      d.body.insertBefore(bar, d.body.firstChild);
    }
    if (data) { render(data); return; }
    if (hp) { return; }
    try { var c = JSON.parse(localStorage.getItem(KEY) || "null"); if (c && now - c.at < 6 * 3600 * 1000) { render(c.d); return; } } catch (e) {}
    if (!window.fetch || !window.DOMParser) { return; }
    fetch("/", { credentials: "same-origin" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (html2) {
      var dd = html2 ? readShabbat(new DOMParser().parseFromString(html2, "text/html")) : null;
      save(dd); render(dd);
    }).catch(function () {});
  }

  /* Testimonials: quotes come from the Testimonials page (CC.testimonialsUrl) */
  function parseTestimonials(doc) {
    return qa(".article-body blockquote, .co_body blockquote, blockquote", doc).map(function (bq) {
      var ps = qa("p", bq).map(txt).filter(Boolean);
      if (!ps.length) { ps = [txt(bq)]; }
      var by = "", ctx = "";
      var last = ps[ps.length - 1];
      if (ps.length > 1 && /^[\u2014\u2013-]/.test(last)) {
        ps.pop();
        var who = last.replace(/^[\u2014\u2013-]+\s*/, "");
        var cut = who.indexOf(",");
        by = cut > 0 ? who.slice(0, cut).trim() : who; ctx = cut > 0 ? who.slice(cut + 1).trim() : "";
      }
      return { quote: ps.join(" ").replace(/^["\u201c]|["\u201d]$/g, ""), by: by, ctx: ctx };
    }).filter(function (t) { return t.quote; });
  }
  function testimonialsSection(list) {
    var sec = h("section", { "class": "cc-section cc-section--cream cc-testimonials", "aria-labelledby": "cc-tm-h" });
    function build(items) {
      if (!items || !items.length) { if (sec.parentNode) { sec.parentNode.removeChild(sec); } return; }
      var idx = 0;
      var quote = h("p", { "class": "cc-testimonial__quote" });
      var by = h("p", { "class": "cc-testimonial__by" });
      var dots = h("div", { "class": "cc-hero__dots cc-testimonials__dots", role: "group", "aria-label": "Choose a testimonial" });
      function show(i) {
        idx = (i + items.length) % items.length; var t = items[idx];
        quote.textContent = "\u201c" + t.quote + "\u201d";
        by.textContent = "";
        if (t.by) { by.appendChild(h("strong", { text: t.by })); }
        if (t.ctx) { by.appendChild(h("span", { text: t.ctx })); }
        qa("button", dots).forEach(function (b, j) { b.setAttribute("aria-current", j === idx ? "true" : "false"); });
      }
      var nav = null;
      if (items.length > 1) {
        items.forEach(function (t, i) { var b = h("button", { type: "button", "aria-label": "Testimonial " + (i + 1) }); b.addEventListener("click", function () { show(i); }); dots.appendChild(b); });
        var prev = h("button", { type: "button", "class": "cc-round", "aria-label": "Previous testimonial", text: "\u2190" });
        var next = h("button", { type: "button", "class": "cc-round", "aria-label": "Next testimonial", text: "\u2192" });
        prev.addEventListener("click", function () { show(idx - 1); });
        next.addEventListener("click", function () { show(idx + 1); });
        nav = h("div", { "class": "cc-testimonials__nav" }, [prev, dots, next]);
      }
      sec.textContent = "";
      sec.appendChild(h("div", { "class": "cc-wrap" }, [
        h("p", { "class": "cc-eyebrow", text: CC.home.testimonialsEyebrow }),
        h("h2", { "class": "cc-h2 cc-head", id: "cc-tm-h", text: CC.home.testimonialsTitle }),
        h("figure", { "class": "cc-testimonial", "aria-live": "polite" }, [quote, by]),
        nav
      ]));
      show(0);
    }
    if (list) { build(list); return sec; }
    if (!CC.testimonialsUrl) { return null; }
    cachedPage("cc-testimonials-v1", 6 * 3600 * 1000, CC.testimonialsUrl, parseTestimonials, function (v) { build(v || []); });
    return sec;
  }

  function partnerSection() {
    var p = CC.home.partner;
    if (!p) { return null; }
    return h("section", { "class": "cc-section cc-section--ink cc-partner", "aria-labelledby": "cc-partner-h" }, [
      h("div", { "class": "cc-wrap cc-split" }, [
        h("div", null, [h("h2", { "class": "cc-h2 cc-head", id: "cc-partner-h", text: p.title }), h("p", { "class": "cc-lede", text: p.text })]),
        h("div", { "class": "cc-partner__ctas" }, [
          h("a", { "class": "cc-btn cc-btn--accent", href: CC.donateUrl, text: p.donate }),
          h("a", { "class": "cc-btn cc-btn--ghost", href: p.dedicateHref, text: p.dedicate, style: "color: var(--cc-white) !important" })
        ])
      ])
    ]);
  }

  /* "Coming up": one card per course or event, led by its date.
     Courses come from the registration Events page (title, description, Register link); their dated
     sessions from the native calendar feed fold in as "Next class". Calendar items with no registration
     page show as their own cards. */
  var MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  function parseWhen(t) {
    var m = /(\w{3})\w*,\s+(\w+)\s+(\d{1,2}),\s+(\d{4})(?:\s*-\s*(\d{1,2}:\d{2}\s*[ap]m))?/i.exec(t || "");
    if (!m) { return null; }
    var mi = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
    if (mi < 0) { return null; }
    return { wd: m[1], mon: m[2].slice(0, 3), day: m[3], key: m[4] + "-" + (mi < 9 ? "0" : "") + (mi + 1) + "-" + (m[3].length < 2 ? "0" : "") + m[3],
      time: m[5] ? m[5].replace(/\s*([ap]m)$/i, " $1").toLowerCase() : "" };
  }
  function evKey(t) { return String(t || "").toLowerCase().replace(/^\s*[a-z]{2,5}\s*:\s*/, "").replace(/[^a-z0-9]+/g, ""); }
  function splitTitle(t) {
    var m = /^\s*([A-Za-z]{2,5})\s*:\s*(.+)$/.exec(t || "");
    if (m && CC.home.prefixes[m[1].toUpperCase()]) { return { kicker: CC.home.prefixes[m[1].toUpperCase()], title: m[2] }; }
    return { kicker: "", title: t };
  }
  function featureCard(ev) {
    var w = ev.when, st = splitTitle(ev.title);
    var meta = null;
    if (ev.sessions.length) {
      var first = ev.sessions[0], times = ev.sessions.filter(function (x) { return x.key === first.key && x.time; }).map(function (x) { return x.time; });
      meta = h("p", { "class": "cc-feature__meta" }, [h("strong", { text: "Next class: " }), first.wd + ", " + first.mon + " " + first.day + (times.length ? " · " + times.join(" or ") : "")]);
    } else if (w) {
      meta = h("p", { "class": "cc-feature__meta" }, [h("strong", { text: "Starts: " }), w.wd + ", " + w.mon + " " + w.day]);
    }
    return h("article", { "class": "cc-feature" }, [
      w ? h("div", { "class": "cc-feature__date", "aria-hidden": "true" }, [
        h("span", { "class": "cc-feature__m", text: w.mon }), h("span", { "class": "cc-feature__d", text: w.day }), h("span", { "class": "cc-feature__w", text: w.wd })
      ]) : h("div", { "class": "cc-feature__date", "aria-hidden": "true" }),
      h("div", { "class": "cc-feature__body" }, [
        st.kicker ? h("p", { "class": "cc-feature__kicker", text: st.kicker }) : null,
        h("h3", { "class": "cc-feature__title cc-head", text: st.title }),
        ev.desc ? h("p", { "class": "cc-feature__desc", text: ev.desc }) : null,
        meta,
        h("div", { "class": "cc-feature__cta" }, [h("a", { "class": "cc-btn", href: ev.href, text: ev.cta })])
      ])
    ]);
  }

  function eventsSection(root) {
    var grid = h("div", { "class": "cc-features" });
    var sec = h("section", { "class": "cc-section cc-section--cream cc-events", "aria-labelledby": "cc-events-h" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-head-row" }, [
          h("div", null, [h("p", { "class": "cc-eyebrow", text: CC.home.eventsEyebrow }), h("h2", { "class": "cc-h2 cc-head", id: "cc-events-h", text: CC.home.eventsTitle }), CC.home.eventsLine ? h("p", { "class": "cc-lede", text: CC.home.eventsLine }) : null]),
          h("div", { "class": "cc-events__nav" }, [h("a", { "class": "cc-btn cc-btn--ghost", href: CC.eventsUrl, text: CC.home.eventsAll })])
        ]),
        grid
      ])
    ]);
    // Dated sessions from the native "Upcoming Events" feed on the homepage
    var sessions = qa(".upcoming_events .widget_content li", root).map(function (li) {
      // The title link sits in the heading; an icon-only .register_link may come first
      var a = q("h6 a, h5 a, h4 a, h3 a", li) || q("a:not(.register_link)", li);
      var reg = q("a.register_link", li), title = a ? txt(a) : "", when = parseWhen(txt(q("small", li)));
      if (!title || !when) { return null; }
      when.title = title; when.k = evKey(title); when.href = (reg || a).getAttribute("href"); when.reg = !!reg;
      return when;
    }).filter(Boolean);
    function render(courses) {
      var used = {}, cards = [];
      courses.forEach(function (c) {
        c.sessions = sessions.filter(function (x) { return x.k === evKey(c.title); });
        if (c.sessions.length) { c.when = c.sessions[0]; }
        used[evKey(c.title)] = 1;
        cards.push(c);
      });
      sessions.forEach(function (x) {   // calendar items without a registration page: one card each (next date)
        if (used[x.k]) { return; }
        used[x.k] = 1;
        cards.push({ title: x.title, href: x.href, cta: x.reg ? "Register" : "Details", desc: "", when: x, sessions: sessions.filter(function (y) { return y.k === x.k; }) });
      });
      grid.textContent = "";
      if (!cards.length) {
        grid.appendChild(h("div", { "class": "cc-card" }, [h("h3", { text: "New classes are on the way" }), h("p", { text: "Check the full calendar or join our weekly email to hear first." })]));
        return;
      }
      cards.sort(function (x, y) { return x.when && y.when ? (x.when.key < y.when.key ? -1 : x.when.key > y.when.key ? 1 : 0) : (x.when ? -1 : 1); });
      cards.slice(0, 6).forEach(function (c) { grid.appendChild(featureCard(c)); });
    }
    render([]);   // first paint from the calendar feed
    cachedPage("cc-courses-v1", 3600 * 1000, CC.eventsSource, function (doc) {
      return qa(".event", doc).map(function (e) {
        var a = q("h2 a", e); if (!a) { return null; }
        var desc = q(".bottom_padding", e);
        var descText = desc ? desc.innerHTML.replace(/<br\s*\/?>/gi, " \u00b7 ").replace(/<[^>]+>/g, " ") : "";
        var tmp = d.createElement("textarea"); tmp.innerHTML = descText;
        return {
          title: txt(a), href: a.getAttribute("href"), cta: "Register",
          when: parseWhen(txt(q(".performance__date", e))),
          desc: tmp.value.replace(/\s+/g, " ").replace(/(\s*\u00b7\s*)+/g, " \u00b7 ").replace(/^\s*\u00b7\s*|\s*\u00b7\s*$/g, "").trim()
        };
      }).filter(Boolean);
    }, function (courses) { if (courses && courses.length) { render(courses); } });
    return sec;
  }

  function introSection(root) {
    var m = q(".widget-4.message, .message.custom", root);
    if (!m) { return null; }
    var head = txt(q(".widget_header h5", m));
    var body = q(".message_format .bottom_padding, .widget_content .bottom_padding, .widget_content", m);
    var more = q("a.readMore", m);
    var bodyText = body ? txt(body).replace(more ? txt(more) : "\u0000", "").trim() : "";
    return h("section", { "class": "cc-section cc-intro", "aria-label": head || "About us" }, [
      h("div", { "class": "cc-wrap" }, [
        h("p", { "class": "cc-eyebrow", text: CC.home.introEyebrow }),
        h("h2", { "class": "cc-h2 cc-head", text: head || "There's a place for you here." }),
        bodyText ? h("p", { "class": "cc-lede", text: bodyText }) : null,
        more ? h("p", { style: "margin-top:24px" }, [h("a", { "class": "cc-link", href: more.getAttribute("href"), text: txt(more) || "Learn more" })]) : null
      ])
    ]);
  }

  function programsSection(root) {
    var c = q(".sneak-peek-container", root);
    if (!c) { return null; }
    var cards = qa(".sneak-peek-item", c).map(function (it) {
      var a = q("h6 a, .title_only a", it), th = q("a.thumbnail img, img", it);
      if (!a) { return null; }
      return h("a", { "class": "cc-program", href: a.getAttribute("href") }, [
        h("div", { "class": "cc-program__img", style: th ? "background-image:url('" + bgUrl(th).replace(/'/g, "%27") + "')" : null }),
        h("div", { "class": "cc-program__label" }, [h("h3", { "class": "cc-program__title cc-head", text: txt(a) }), h("span", { "class": "cc-program__more", text: "Learn more →" })])
      ]);
    }).filter(Boolean);
    if (!cards.length) { return null; }
    return h("section", { "class": "cc-section cc-programs", "aria-labelledby": "cc-programs-h" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-head-row" }, [h("div", null, [
          h("p", { "class": "cc-eyebrow", text: CC.home.programsEyebrow }),
          h("h2", { "class": "cc-h2 cc-head", id: "cc-programs-h", text: CC.home.programsTitle })
        ])]),
        h("div", { "class": "cc-grid cc-grid--4" }, cards)
      ])
    ]);
  }

  function subscribeSection(root) {
    var s = q(".hp_subscribe .subscribe, .widget-4.subscribe", root);
    if (!s) { return null; }
    var sec = h("section", { "class": "cc-section cc-subscribe", "aria-labelledby": "cc-sub-h" }, [
      h("div", { "class": "cc-wrap cc-split" }, [
        h("div", null, [h("h2", { "class": "cc-h2 cc-head", id: "cc-sub-h", text: CC.home.subscribeTitle }), h("p", { "class": "cc-lede", text: CC.home.subscribeText })]),
        h("div", { "class": "cc-subscribe__form" })
      ])
    ]);
    q(".cc-subscribe__form", sec).appendChild(s);
    return sec;
  }

  function homeShell() {
    // Detect the homepage by its widget table, NOT by body.home: ChabadOne adds that class
    // late with its own script, so checking it caused random fall-backs to the native homepage.
    var hp = q(".hp-table");
    if (!hp || q("#cc-home")) { return; }
    addClass(html, "cc-home-page");
    var shell = h("div", { id: "cc-home" });
    var build = {
      hero: function () { return heroSection(readSlides(q(".promo_slider", hp) || hp)); },
      quick: function () { return quickSection(hp); },
      intro: function () { return introSection(hp); },
      events: function () { return eventsSection(hp); },
      programs: function () { return programsSection(hp); },
      testimonials: function () { return testimonialsSection(); },
      partner: partnerSection,
      subscribe: function () { return subscribeSection(hp); }
    };
    CC.home.sections.forEach(function (k) { var s = build[k] && build[k](); if (s) { shell.appendChild(s); } });
    hp.parentNode.insertBefore(shell, hp);
    addClass(hp, "cc-native-parked");
    addClass(html, "cc-shell-ready");
  }

  /* ---------- Event registration page ----------
     Only adds conveniences on top of ChabadOne's own form logic; never submits anything. */
  function registration() {
    var page = d.getElementById("RegisterSinglePage");
    if (!page) { return; }

    // 1) Picking a package category (e.g. "Couple - $215, for up to 2 reservations")
    //    pre-selects that many attendees instead of 1.
    page.addEventListener("change", function (e) {
      var sel = e.target;
      if (!sel || !sel.id || !/_priceCategory$/.test(sel.id)) { return; }
      var base = sel.id.replace(/_priceCategory$/, "");
      setTimeout(function () {   // let ChabadOne fill the quantity list first
        var qty = d.getElementById(base + "_quantityOfAttendees");
        if (!qty || qty.disabled) { return; }
        var opt = sel.options[sel.selectedIndex];
        var info = txt(d.getElementById(base + "_priceInfo"));
        var m = info.match(/up to (\d+)/i);
        var want = m ? m[1] : (opt && /couple/i.test(opt.text) ? "2" : "");
        if (!want) { return; }
        for (var i = 0; i < qty.options.length; i++) {
          if (qty.options[i].value === want) {
            qty.value = want;
            qty.dispatchEvent(new Event("change", { bubbles: true }));
            break;
          }
        }
      }, 0);
    });

    // 3) Hide a per-person "Notes / Comments" box when the page already has the general
    //    Comments box further down (it would ask the same thing twice). Optional fields only.
    function hideDuplicateNotes() {
      if (!d.getElementById("PaymentComments")) { return; }
      qa(".reservation .embedded_form .form-line", page).forEach(function (li) {
        if (li.getAttribute("data-cc-dup") || !q("textarea", li) || q(".form-required", li)) { return; }
        if (/^\s*(notes|comments)\b/i.test(txt(q("label", li)))) {
          li.setAttribute("data-cc-dup", "1");
          li.style.setProperty("display", "none", "important");
        }
      });
    }
    hideDuplicateNotes();
    if (window.MutationObserver) {
      new MutationObserver(hideDuplicateNotes).observe(page, { childList: true, subtree: true });
    }

    // 2) Make "Add additional reservations" say which registration types exist.
    qa(".performance", page).forEach(function (perf) {
      var sel = q("select[id$='_priceCategory']", perf);
      var link = q(".toggle_message", perf);
      if (!sel || !link) { return; }
      var names = [];
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === "") { continue; }
        var n = sel.options[i].text.split(" - ")[0].trim();
        if (n) { names.push(n); }
      }
      if (names.length > 1) {
        for (var k = link.childNodes.length - 1; k >= 0; k--) {
          if (link.childNodes[k].nodeType === 3) { link.removeChild(link.childNodes[k]); }
        }
        link.appendChild(d.createTextNode("Add another registration (" + names.join(" or ") + ")"));
      }
    });
  }

  // Tiny hook so a design preview can show the testimonials layout with sample data (never used by the site itself)
  window.ccTheme = { testimonialsSection: testimonialsSection };

  /* ---------- Run ---------- */
  onReady(function () {
    [header, shabbatBar, footer, homeShell, registration].forEach(function (fn) {
      try { fn(); } catch (e) {
        if (window.console) { console.error("[cc-theme]", fn.name, e); }
        if (fn === homeShell) { addClass(html, "cc-shell-failed"); }
      }
    });
  });
})();
