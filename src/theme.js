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
    // Homepage photos live on an ordinary ChabadOne page: pictures under a heading containing "Welcome"
    // rotate beside the welcome text, under "Strip" they scroll in the photo strip, under "Donate" the
    // first one is the donate background. No headings: the first 4 pictures = welcome, all = strip.
    photosUrl: null,         // set to e.g. "/homepage-photos" once that page exists
    shabbatPlace: "Bloomfield Hills",
    quoteFont: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap",
    home: {
      // Homepage sections, in order.
      sections: ["hero", "quick", "intro", "strip", "events", "programs", "testimonials", "partner", "subscribe"],
      // Hero = every slide of the ChabadOne promo slider. In a slide's title, "Eyebrow | Title" adds the
      // small label above it; in its text, "Description | Date line" adds the date line under it.
      heroEyebrow: "Shalom and welcome",   // label for the first slide when its title has none
      heroCta: "See what's coming up",
      heroSeconds: 7,
      secondaryCta: { text: "About us", href: "/about" },   // shown on the first slide only
      introEyebrow: "Welcome",
      eventsEyebrow: "Coming up",
      eventsTitle: "Discover the joy and meaning in Judaism",
      eventsLine: "The first class of every course is yours to try, commitment-free.",
      eventsAll: "Full calendar",
      // Event-name prefixes turned into a readable label on the course card
      prefixes: { "JLI": "JLI course", "RCS": "Rosh Chodesh Society" },
      // Category tag on each event card: the first rule whose words match the event's name, label or text
      tags: [
        { label: "Holiday", tone: "holiday", match: /chanuk|hanuk|purim|passover|pesach|seder|sukk|shavu|rosh hashana|yom kippur|simch|lag b.?omer|tu b.?shvat|megillah|shofar/i },
        { label: "Shabbat", tone: "shabbat", match: /shabbat|shabbos|kiddush/i },
        { label: "Women", tone: "women", match: /women|ladies|genesis|challah|rosh chodesh/i },
        { label: "JLI Course", tone: "course", match: /\bjli\b|course/i }
      ],
      tagDefault: { label: "Event", tone: "event" },
      programsEyebrow: "Our programs",
      programsTitle: "Programs for the whole community",
      testimonialsEyebrow: "Testimonials",
      testimonialsTitle: "In their words",
      partner: {
        eyebrow: "Support our work",
        image: "",   // background photo; the "Donate" picture on the photos page wins
        title: "Partner with us",
        text: "Chabad of Bloomfield Hills is funded entirely by friends and supporters like you. Every gift keeps our classes, holidays and programs open to everyone.",
        donate: "Donate",
        dedicate: "Dedicate a class or event",
        dedicateHref: "mailto:rabbi@bhchabad.org?subject=Dedicating%20a%20class%20or%20event"
      },
      subscribeTitle: "Stay in the loop",
      subscribeText: "Classes, events and holiday celebrations in Bloomfield Hills, straight to your inbox.",
      subscribeList: ["New classes and courses, before they fill up", "Holiday celebrations and Shabbat times", "Easy to unsubscribe anytime"]
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
        h("div", { "class": "cc-footer__shabbat", hidden: "hidden" }),
        social.length ? h("div", { "class": "cs-f-social-icons" }, social) : null
      ]),
      h("div", null, [h("h4", { text: "Explore" }), h("ul", null, navLinks)]),
      h("div", null, [h("h4", { text: "Get involved" }), h("ul", null, [
        h("li", null, [h("a", { href: CC.eventsUrl, text: "Upcoming events" })]),
        h("li", null, [h("a", { href: CC.subscribeUrl, text: "Weekly email" })]),
        h("li", null, [h("a", { href: CC.contactUrl, text: "Contact us" })]),
        h("li", null, [h("a", { href: CC.donateUrl, text: "Donate" })])
      ])]),
      h("div", null, [h("h4", { text: "Find us" }), h("address", null, [
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
  // Shared: layers stacked in one grid cell, so a slideshow keeps the height of its tallest layer
  // and the page below never jumps. show(i) fades to layer i.
  function stack(cls, layers) {
    var box = h("div", { "class": "cc-stack " + (cls || "") }, layers);
    layers.forEach(function (l, i) { addClass(l, "cc-slide"); if (i === 0) { addClass(l, "is-on"); } else { l.setAttribute("aria-hidden", "true"); } });
    box.show = function (i) {
      qa(":scope > .cc-slide", box).forEach(function (l, j) {
        l.className = l.className.replace(/\s?is-on\b/g, "");
        if (j === i) { addClass(l, "is-on"); l.removeAttribute("aria-hidden"); } else { l.setAttribute("aria-hidden", "true"); }
      });
    };
    return box;
  }
  function photoLayer(src, alt) { return h("div", { role: "img", "aria-label": alt || "", style: "background-image:url(\"" + String(src).replace(/"/g, "%22") + "\")" }); }
  function roundBtn(label, arrow) { return h("button", { type: "button", "class": "cc-round", "aria-label": label, text: arrow }); }
  function splitPipe(s) { var i = (s || "").indexOf(" | "); return i < 0 ? [s || "", ""] : [s.slice(0, i).trim(), s.slice(i + 3).trim()]; }

  function readSlides(root) {
    var caps = qa(".captionList li", root), slides = qa(".slide_wrapper", root);
    return caps.map(function (li, i) {
      var big = q("big", li), span = q("span", li), a = q("a.readMore", li);
      var title = txt(big);
      var sub = span ? txt(span).replace(title, "").trim() : "";
      var t = splitPipe(title), s = splitPipe(sub);
      var img = slides[i] ? bgUrl(q("img", slides[i]) || slides[i]) : "";
      // "Eyebrow | Title" and "Description | Date line" (see CC.home)
      return { eyebrow: t[1] ? t[0] : "", title: t[1] || t[0], sub: s[0], info: s[1], href: a ? a.getAttribute("href") : "", cta: txt(a), target: a ? a.getAttribute("target") : "", img: img };
    }).filter(function (s) { return s.title || s.img; });
  }

  // Rotating hero: every slide of the ChabadOne promo slider, with arrows, dots and a pause on hover.
  function heroSection(slides) {
    if (!slides.length) { return null; }
    var texts = slides.map(function (s, i) {
      var eyebrow = s.eyebrow || (i === 0 ? CC.home.heroEyebrow : "");
      var ctaHref = s.href || "#cc-events-h", ctaText = s.href ? (s.cta || "Learn more") : CC.home.heroCta;
      return h("div", null, [
        eyebrow ? h("p", { "class": "cc-eyebrow", text: eyebrow }) : null,
        h(i === 0 ? "h1" : "h2", { "class": "cc-hero__title cc-head", text: s.title }),
        s.sub ? h("p", { "class": "cc-hero__sub", text: s.sub }) : null,
        s.info ? h("p", { "class": "cc-hero__info", text: s.info }) : null,
        h("div", { "class": "cc-hero__ctas" }, [
          h("a", { "class": "cc-btn cc-btn--light", href: ctaHref, target: s.target || null, text: ctaText }),
          i === 0 ? h("a", { "class": "cc-btn cc-btn--ghost", href: CC.home.secondaryCta.href, text: CC.home.secondaryCta.text, style: "color: var(--cc-white) !important" }) : null
        ])
      ]);
    });
    var textBox = stack("cc-hero__text", texts);
    var imgBox = stack("cc-hero__imgs", slides.map(function (s) { var l = photoLayer(s.img, s.title); addClass(l, "cc-hero__img"); return l; }));
    var media = h("div", { "class": "cc-hero__media" }, [imgBox]);
    var sec = h("section", { "class": "cc-hero", "aria-label": "Welcome", "aria-roledescription": "carousel" }, [h("div", { "class": "cc-wrap" }, [textBox, media])]);
    if (slides.length < 2) { return sec; }
    var idx = 0, timer = null;
    var dots = h("div", { "class": "cc-hero__dots", role: "group", "aria-label": "Choose a slide" });
    function show(i) {
      idx = (i + slides.length) % slides.length;
      textBox.show(idx); imgBox.show(idx);
      qa("button", dots).forEach(function (b, j) { b.setAttribute("aria-current", j === idx ? "true" : "false"); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { stop(); if (!reduceMotion) { timer = setInterval(function () { show(idx + 1); }, CC.home.heroSeconds * 1000); } }
    slides.forEach(function (s, i) { var b = h("button", { type: "button", "aria-label": "Slide " + (i + 1) + ": " + s.title, "aria-current": i ? "false" : "true" }); b.addEventListener("click", function () { show(i); start(); }); dots.appendChild(b); });
    var prev = roundBtn("Previous slide", "←"), next = roundBtn("Next slide", "→");
    prev.addEventListener("click", function () { show(idx - 1); start(); });
    next.addEventListener("click", function () { show(idx + 1); start(); });
    media.appendChild(h("div", { "class": "cc-hero__nav" }, [prev, dots, next]));
    sec.addEventListener("mouseenter", stop); sec.addEventListener("mouseleave", start);
    sec.addEventListener("focusin", stop); sec.addEventListener("focusout", start);
    start();
    return sec;
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
  // Shabbat times sit quietly in the footer (Levi, Oct 24: a bar at the top of every page was too much)
  function shabbatTimes() {
    var KEY = "cc-shabbat-v1", data = null, now = Date.now();
    var hp = q(".hp-table");
    // Cache the result (or the absence of a result) for 6h so inner pages don't refetch "/" every time
    function save(dd) { try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), d: dd || null })); } catch (e) {} }
    if (hp) { data = readShabbat(hp); save(data); }
    function render(dd) {
      var box = q(".cc-footer__shabbat");
      if (!dd || !box || box.firstChild) { return; }
      var line = "Candles " + (dd.candles || "").toLowerCase() + (dd.day ? " " + dd.day : "") + (dd.ends ? " \u00b7 ends " + dd.ends.toLowerCase() : "");
      box.appendChild(h("span", { "class": "cc-footer__shabbat-label", text: "This Shabbat in " + CC.shabbatPlace }));
      box.appendChild(d.createTextNode(line));
      box.appendChild(h("br"));
      box.appendChild(h("a", { href: dd.href || "/tools/shabbat-holiday-calendar/default.htm", text: "Shabbat and holiday times" }));
      box.removeAttribute("hidden");
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

  /* Testimonials: quotes come from the Testimonials page (CC.testimonialsUrl).
     A picture placed just before a quote (or inside it) is shown beside that quote. */
  function imgSrc(im) {
    var s = im && (im.getAttribute("data-src") || im.getAttribute("src")) || "";
    var w = +(im && im.getAttribute("width")) || 0;
    return /spacer\.gif|^data:/i.test(s) || (w && w < 60) ? "" : s;
  }
  function photoBefore(bq) {
    var inner = q("img", bq);
    if (inner) { return imgSrc(inner); }
    for (var n = bq.previousElementSibling, k = 0; n && k < 3; n = n.previousElementSibling, k++) {
      if (n.tagName === "BLOCKQUOTE" || q("blockquote", n)) { break; }
      var im = n.tagName === "IMG" ? n : q("img", n);
      if (im) { return imgSrc(im); }
    }
    return "";
  }
  function parseTestimonials(doc) {
    return qa(".article-body blockquote, .co_body blockquote, blockquote", doc).map(function (bq) {
      var photo = photoBefore(bq);
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
      return { quote: ps.join(" ").replace(/^["\u201c]|["\u201d]$/g, ""), by: by, ctx: ctx, photo: photo };
    }).filter(function (t) { return t.quote; });
  }
  function loadQuoteFont() {
    if (!CC.quoteFont || q("link[data-cc-quote-font]")) { return; }
    d.head.appendChild(h("link", { rel: "stylesheet", href: CC.quoteFont, "data-cc-quote-font": "1" }));
  }
  function testimonialsSection(list) {
    var sec = h("section", { "class": "cc-section cc-section--cream cc-testimonials", "aria-labelledby": "cc-tm-h" });
    function build(items) {
      if (!items || !items.length) { if (sec.parentNode) { sec.parentNode.removeChild(sec); } return; }
      loadQuoteFont();
      var idx = 0;
      var quote = h("p", { "class": "cc-testimonial__quote" });
      var by = h("p", { "class": "cc-testimonial__by" });
      var dots = h("div", { "class": "cc-hero__dots cc-testimonials__dots", role: "group", "aria-label": "Choose a testimonial" });
      // One photo layer per distinct picture; a quote without its own picture keeps the one before it
      var photos = [], layerOf = [], last = -1;
      items.forEach(function (t, i) {
        if (t.photo) { var j = photos.indexOf(t.photo); if (j < 0) { photos.push(t.photo); j = photos.length - 1; } last = j; }
        layerOf[i] = last < 0 ? 0 : last;
      });
      var photoBox = photos.length ? stack("cc-tm__photo", photos.map(function (p) { return photoLayer(p, ""); })) : null;
      function show(i) {
        idx = (i + items.length) % items.length; var t = items[idx];
        quote.textContent = "\u201c" + t.quote + "\u201d";
        by.textContent = "";
        if (t.by) { by.appendChild(h("strong", { text: t.by })); }
        if (t.ctx) { by.appendChild(h("span", { text: t.ctx })); }
        if (photoBox) { photoBox.show(layerOf[idx]); }
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
      var body = [
        h("p", { "class": "cc-eyebrow", text: CC.home.testimonialsEyebrow }),
        h("h2", { "class": "cc-h2 cc-head", id: "cc-tm-h", text: CC.home.testimonialsTitle }),
        photoBox ? h("span", { "class": "cc-tm__mark", "aria-hidden": "true", text: "“" }) : null,
        h("figure", { "class": "cc-testimonial", "aria-live": "polite" }, [quote, by]),
        nav
      ];
      sec.textContent = "";
      if (photoBox) {
        addClass(sec, "cc-tm");
        sec.appendChild(h("div", { "class": "cc-wrap cc-tm__grid" }, [photoBox, h("div", { "class": "cc-tm__body" }, body)]));
      } else {
        sec.appendChild(h("div", { "class": "cc-wrap" }, body));
      }
      show(0);
    }
    if (list) { build(list); return sec; }
    if (!CC.testimonialsUrl) { return null; }
    cachedPage("cc-testimonials-v2", 6 * 3600 * 1000, CC.testimonialsUrl, parseTestimonials, function (v) { build(v || []); });
    return sec;
  }

  /* Homepage photos page (CC.photosUrl): groups pictures by the heading above them */
  function parsePhotos(doc) {
    var root = q(".article-body", doc) || q(".co_body", doc) || q("#BodyContainer", doc) || doc.body;
    var g = { welcome: [], strip: [], donate: [] }, all = [], cur = null, headed = false;
    qa("h1, h2, h3, h4, h5, h6, strong, b, img", root).forEach(function (el) {
      if (el.tagName === "IMG") {
        var src = imgSrc(el);
        if (!src) { return; }
        var p = { src: src, alt: el.getAttribute("alt") || "" };
        all.push(p); if (cur) { g[cur].push(p); }
        return;
      }
      var t = txt(el).toLowerCase();
      if (/welcome/.test(t)) { cur = "welcome"; headed = true; }
      else if (/strip|gallery|community/.test(t)) { cur = "strip"; headed = true; }
      else if (/donat|partner/.test(t)) { cur = "donate"; headed = true; }
    });
    if (!headed) { g.welcome = all.slice(0, 4); g.strip = all; }
    return g;
  }
  var photoWaiters = [], photoData;
  function withPhotos(fn) {
    if (photoData !== undefined) { fn(photoData); return; }
    photoWaiters.push(fn);
    if (photoWaiters.length > 1) { return; }
    if (!CC.photosUrl) { photoData = null; photoWaiters.forEach(function (f) { f(null); }); return; }
    cachedPage("cc-photos-v1", 3600 * 1000, CC.photosUrl, parsePhotos, function (v) {
      photoData = v || null;
      photoWaiters.forEach(function (f) { try { f(photoData); } catch (e) {} });
    });
  }

  function partnerSection() {
    var p = CC.home.partner;
    if (!p) { return null; }
    var sec = h("section", { "class": "cc-section cc-section--ink cc-partner", "aria-labelledby": "cc-partner-h" }, [
      h("div", { "class": "cc-wrap cc-split" }, [
        h("div", null, [
          p.eyebrow ? h("p", { "class": "cc-eyebrow", text: p.eyebrow }) : null,
          h("h2", { "class": "cc-h2 cc-head", id: "cc-partner-h", text: p.title }), h("p", { "class": "cc-lede", text: p.text })]),
        h("div", { "class": "cc-partner__ctas" }, [
          h("a", { "class": "cc-btn cc-btn--accent", href: CC.donateUrl, text: p.donate }),
          h("a", { "class": "cc-btn cc-btn--ghost", href: p.dedicateHref, text: p.dedicate, style: "color: var(--cc-white) !important" })
        ])
      ])
    ]);
    function setBg(src) {
      if (!src) { return; }
      addClass(sec, "cc-partner--photo");
      sec.style.setProperty("--cc-partner-img", "url(\"" + String(src).replace(/"/g, "%22") + "\")");
    }
    setBg(p.image);
    withPhotos(function (g) { if (g && g.donate.length) { setBg(g.donate[0].src); } });
    return sec;
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
  function tagFor(st, ev) {
    var hay = [st.kicker, st.title, ev.desc].join(" ");
    for (var i = 0; i < CC.home.tags.length; i++) { if (CC.home.tags[i].match.test(hay)) { return CC.home.tags[i]; } }
    return CC.home.tagDefault;
  }
  // One card: photo with a category tag, date line, title, short text, "Learn more" (+ "Register" when separate)
  function eventCard(ev) {
    var w = ev.when, st = splitTitle(ev.title), tag = tagFor(st, ev), when = "";
    if (ev.sessions.length) {
      var first = ev.sessions[0], times = ev.sessions.filter(function (x) { return x.key === first.key && x.time; }).map(function (x) { return x.time; });
      when = (ev.desc || ev.reg ? "Next: " : "") + first.wd + ", " + first.mon + " " + first.day + (times.length ? " · " + times.join(" or ") : "");
    } else if (w) {
      when = "Starts " + w.wd + ", " + w.mon + " " + w.day;
    }
    var ctas = [h("a", { "class": "cc-btn", href: ev.href, text: "Learn more" })];
    if (ev.reg && ev.reg !== ev.href) { ctas.push(h("a", { "class": "cc-btn cc-btn--ghost", href: ev.reg, text: "Register" })); }
    return h("article", { "class": "cc-ev cc-ev--" + tag.tone }, [
      h("div", { "class": "cc-ev__img", style: ev.img ? "background-image:url(\"" + ev.img.replace(/"/g, "%22") + "\")" : null }, [
        h("span", { "class": "cc-ev__tag", text: tag.label })
      ]),
      h("div", { "class": "cc-ev__body" }, [
        when ? h("p", { "class": "cc-ev__when", text: when }) : null,
        h("h3", { "class": "cc-ev__title cc-head", text: st.title }),
        ev.desc ? h("p", { "class": "cc-ev__desc", text: ev.desc }) : null,
        h("div", { "class": "cc-ev__cta" }, ctas)
      ])
    ]);
  }

  function eventsSection(root) {
    var grid = h("div", { "class": "cc-evs" });
    var prev = roundBtn("Previous events", "←"), next = roundBtn("More events", "→");
    var sec = h("section", { "class": "cc-section cc-section--cream cc-events", "aria-labelledby": "cc-events-h" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-head-row" }, [
          h("div", null, [h("p", { "class": "cc-eyebrow", text: CC.home.eventsEyebrow }), h("h2", { "class": "cc-h2 cc-head", id: "cc-events-h", text: CC.home.eventsTitle }), CC.home.eventsLine ? h("p", { "class": "cc-lede", text: CC.home.eventsLine }) : null]),
          h("div", { "class": "cc-events__nav" }, [prev, next, h("a", { "class": "cc-btn cc-btn--ghost", href: CC.eventsUrl, text: CC.home.eventsAll })])
        ]),
        grid
      ])
    ]);
    function step() { var c = q(".cc-ev", grid); return c ? c.offsetWidth + 24 : 300; }
    function upd() {
      var max = grid.scrollWidth - grid.clientWidth - 2;
      prev.disabled = grid.scrollLeft <= 2; next.disabled = grid.scrollLeft >= max;
      prev.hidden = next.hidden = max <= 0;
    }
    prev.addEventListener("click", function () { grid.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { grid.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    grid.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    // Dated sessions from the native "Upcoming Events" feed on the homepage
    var sessions = qa(".upcoming_events .widget_content li", root).map(function (li) {
      // The title link sits in the heading; an icon-only .register_link may come first
      var a = q("h6 a, h5 a, h4 a, h3 a", li) || q("a:not(.register_link)", li);
      var reg = q("a.register_link", li), title = a ? txt(a) : "", when = parseWhen(txt(q("small", li)));
      if (!title || !when) { return null; }
      when.title = title; when.k = evKey(title); when.href = (reg || a).getAttribute("href"); when.reg = !!reg; when.page = a ? a.getAttribute("href") : "";
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
        cards.push({ title: x.title, href: x.page || x.href, reg: x.reg ? x.href : "", desc: "", when: x, sessions: sessions.filter(function (y) { return y.k === x.k; }) });
      });
      grid.textContent = "";
      if (!cards.length) {
        grid.appendChild(h("div", { "class": "cc-card" }, [h("h3", { text: "New classes are on the way" }), h("p", { text: "Check the full calendar or join our weekly email to hear first." })]));
        upd();
        return;
      }
      cards.sort(function (x, y) { return x.when && y.when ? (x.when.key < y.when.key ? -1 : x.when.key > y.when.key ? 1 : 0) : (x.when ? -1 : 1); });
      cards.slice(0, 8).forEach(function (c) { grid.appendChild(eventCard(c)); });
      upd();
    }
    render([]);   // first paint from the calendar feed
    cachedPage("cc-courses-v2", 3600 * 1000, CC.eventsSource, function (doc) {
      return qa(".event", doc).map(function (e) {
        var a = q("h2 a", e); if (!a) { return null; }
        var desc = q(".bottom_padding", e);
        var descText = desc ? desc.innerHTML.replace(/<br\s*\/?>/gi, " \u00b7 ").replace(/<[^>]+>/g, " ") : "";
        var tmp = d.createElement("textarea"); tmp.innerHTML = descText;
        var pic = qa("img", e).map(imgSrc).filter(Boolean)[0] || "";
        return {
          title: txt(a), href: a.getAttribute("href"), reg: "", img: pic,
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
    var words = h("div", null, [
      h("p", { "class": "cc-eyebrow", text: CC.home.introEyebrow }),
      h("h2", { "class": "cc-h2 cc-head", text: head || "There's a place for you here." }),
      bodyText ? h("p", { "class": "cc-lede", text: bodyText }) : null,
      more ? h("p", { style: "margin-top:24px" }, [h("a", { "class": "cc-link", href: more.getAttribute("href"), text: txt(more) || "Learn more" })]) : null
    ]);
    var wrap = h("div", { "class": "cc-wrap" }, [words]);
    var sec = h("section", { "class": "cc-section cc-intro", "aria-label": head || "About us" }, [wrap]);
    // Welcome photos (from the photos page) rotate beside the words; without them the text stays centered
    withPhotos(function (g) {
      var list = g && g.welcome || [];
      if (!list.length) { return; }
      var box = stack("cc-welcome__img", list.map(function (p) { return photoLayer(p.src, p.alt); }));
      addClass(sec, "cc-welcome"); addClass(wrap, "cc-split");
      wrap.appendChild(box);
      if (list.length > 1 && !reduceMotion) { var i = 0; setInterval(function () { i = (i + 1) % list.length; box.show(i); }, 3000); }
    });
    return sec;
  }

  // A slow sideways strip of real photos (the "Strip" pictures on the photos page)
  function stripSection() {
    if (!CC.photosUrl) { return null; }
    var sec = h("section", { "class": "cc-strip", "aria-label": "Photos from our community" });
    withPhotos(function (g) {
      var list = g && g.strip || [];
      if (list.length < 4) { if (sec.parentNode) { sec.parentNode.removeChild(sec); } return; }
      function row(hide) {
        return h("div", { "class": "cc-strip__row", "aria-hidden": hide ? "true" : null }, list.map(function (p) {
          return h("img", { src: p.src, alt: hide ? "" : p.alt, loading: "lazy" });
        }));
      }
      sec.appendChild(h("div", { "class": "cc-strip__track" }, [row(false), row(true)]));
    });
    return sec;
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
    var icon = h("span", { "class": "cc-sub__icon", "aria-hidden": "true" });
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg>';
    var sec = h("section", { "class": "cc-section cc-subscribe", "aria-labelledby": "cc-sub-h" }, [
      h("div", { "class": "cc-wrap" }, [h("div", { "class": "cc-sub__card cc-split" }, [
        h("div", null, [
          icon,
          h("h2", { "class": "cc-h2 cc-head", id: "cc-sub-h", text: CC.home.subscribeTitle }), h("p", { "class": "cc-lede", text: CC.home.subscribeText }),
          (CC.home.subscribeList || []).length ? h("ul", { "class": "cc-sub__list" }, CC.home.subscribeList.map(function (t) { return h("li", { text: t }); })) : null
        ]),
        h("div", { "class": "cc-subscribe__form" })
      ])])
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
      strip: stripSection,
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
    [header, footer, shabbatTimes, homeShell, registration].forEach(function (fn) {
      try { fn(); } catch (e) {
        if (window.console) { console.error("[cc-theme]", fn.name, e); }
        if (fn === homeShell) { addClass(html, "cc-shell-failed"); }
      }
    });
  });
})();
