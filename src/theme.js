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
    titleSub: "of Bloomfield Hills",
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
    home: {
      heroEyebrow: "Chabad Jewish Center of Bloomfield Hills",
      secondaryCta: { text: "About us", href: "/about" },
      eventsEyebrow: "Upcoming classes and events",
      eventsTitle: "Discover the joy and meaning in Judaism",
      programsEyebrow: "Whatever your age, stage and page",
      subscribeTitle: "What's happening in Jewish Bloomfield Hills?",
      subscribeText: "Get our weekly email: classes, holidays, community news and a short Torah thought."
    }
  };

  /* ---------- Helpers ---------- */
  function q(s, c) { return (c || d).querySelector(s); }
  function qa(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function txt(n) { return n ? (n.textContent || "").replace(/\s+/g, " ").trim() : ""; }
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
  function onReady(fn) { if (d.readyState === "loading") { d.addEventListener("DOMContentLoaded", fn); } else { fn(); } }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Header: scrolled state + two-line site title ---------- */
  function header() {
    var body = d.body, ticking = false;
    function upd() { ticking = false; if (window.scrollY > 4) { addClass(body, "cc-scrolled"); } else { body.className = body.className.replace(/\s?cc-scrolled\b/g, ""); } }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; window.requestAnimationFrame(upd); } }, { passive: true });
    upd();
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

  function heroSection(slides) {
    if (!slides.length) { return null; }
    var title = h("h1", { "class": "cc-hero__title cc-head" });
    var sub = h("p", { "class": "cc-hero__sub" });
    var cta = h("a", { "class": "cc-btn cc-btn--sand" });
    var img = h("div", { "class": "cc-hero__img", role: "img" });
    var dots = h("div", { "class": "cc-hero__dots", role: "group", "aria-label": "Featured items" });
    var idx = 0, timer = null;
    function show(i) {
      idx = i; var s = slides[i];
      title.textContent = s.title; sub.textContent = s.sub;
      sub.style.display = s.sub ? "" : "none";
      if (s.href) { cta.setAttribute("href", s.href); cta.textContent = s.cta || "Learn more"; cta.style.display = ""; if (s.target) { cta.setAttribute("target", s.target); } }
      else { cta.style.display = "none"; }
      img.style.backgroundImage = s.img ? "url(\"" + s.img + "\")" : "";
      img.setAttribute("aria-label", s.title);
      qa("button", dots).forEach(function (b, j) { b.setAttribute("aria-current", j === i ? "true" : "false"); });
    }
    if (slides.length > 1) {
      slides.forEach(function (s, i) {
        var b = h("button", { type: "button", "aria-label": "Show: " + s.title });
        b.addEventListener("click", function () { stop(); show(i); });
        dots.appendChild(b);
      });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (slides.length > 1 && !reduceMotion && !timer) { timer = setInterval(function () { show((idx + 1) % slides.length); }, 7000); } }
    var sec = h("section", { "class": "cc-hero", "aria-label": "Welcome" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-hero__text" }, [
          h("p", { "class": "cc-eyebrow", text: CC.home.heroEyebrow }),
          title, sub,
          h("div", { "class": "cc-hero__ctas" }, [cta, h("a", { "class": "cc-btn cc-btn--ghost", href: CC.home.secondaryCta.href, text: CC.home.secondaryCta.text, style: "color: var(--cc-white) !important" })])
        ]),
        h("div", { "class": "cc-hero__media" }, [img, slides.length > 1 ? dots : null])
      ])
    ]);
    sec.addEventListener("mouseenter", stop);
    sec.addEventListener("mouseleave", start);
    show(0); start();
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

  function weekSection(root) {
    var cl = q(".candlelighting", root);
    if (!cl) { return null; }
    var cards = [];
    var rows = qa(".times_wrapper .medium_top_padding, .times_wrapper > div", cl).filter(function (r) { return q(".when_to_light", r); });
    if (rows.length) {
      var loc = txt(q(".section_subheading", cl));
      cards.push(h("div", { "class": "cc-week__item" }, [
        h("p", { "class": "cc-week__label", text: "Shabbat" + (loc ? " in " + loc.replace(/,.*$/, "") : "") })
      ].concat(rows.slice(0, 3).map(function (r) {
        var a = q("a", r);
        var when = txt(q(".when_to_light", r));
        var time = txt(q(".bold", r));
        var date = a ? txt(a).replace(time, "").replace(/^\s*-\s*/, "") : "";
        return h("div", { "class": "cc-week__row" }, [h("span", { text: when.charAt(0) + when.slice(1).toLowerCase() + (date ? " · " + date : "") }), h("strong", { text: time })]);
      }))));
    }
    var par = q(".parsha_content", cl);
    if (par) {
      var pa = q("a", par);
      cards.push(h("div", { "class": "cc-week__item" }, [
        h("p", { "class": "cc-week__label", text: "This week's Torah portion" }),
        h("p", { "class": "cc-week__value" }, [pa ? h("a", { href: pa.getAttribute("href"), text: txt(pa) }) : txt(par)]),
        h("p", { "class": "cc-week__meta" }, [h("a", { "class": "cc-link", href: pa ? pa.getAttribute("href") : "/parshah", text: "Read and listen" })])
      ]));
    }
    var hol = q(".upcomingholiday_content", cl);
    if (hol) {
      var ha = q("a", hol), dates = qa(".medium_left_margin", hol).pop();
      cards.push(h("div", { "class": "cc-week__item" }, [
        h("p", { "class": "cc-week__label", text: "Next on the calendar" }),
        h("p", { "class": "cc-week__value" }, [ha ? h("a", { href: ha.getAttribute("href"), text: txt(ha) }) : ""]),
        dates && !q("a", dates) ? h("p", { "class": "cc-week__meta", text: txt(dates) }) : null
      ]));
    }
    if (!cards.length) { return null; }
    return h("section", { "class": "cc-week", "aria-label": "This week" }, [h("div", { "class": "cc-wrap" }, [h("div", { "class": "cc-grid" }, cards)])]);
  }

  function eventCard(ev) {
    return h("article", { "class": "cc-event" }, [
      ev.img ? h("div", { "class": "cc-event__img", style: "background-image:url('" + ev.img.replace(/'/g, "%27") + "')" }) : null,
      h("div", { "class": "cc-event__body" }, [
        ev.date ? h("p", { "class": "cc-event__date", text: ev.date }) : null,
        h("h3", { "class": "cc-event__title cc-head", text: ev.title }),
        ev.desc ? h("p", { "class": "cc-event__desc", text: ev.desc }) : null,
        h("div", { "class": "cc-event__cta" }, [h("a", { "class": "cc-btn", href: ev.href, text: ev.cta || "Register" })])
      ])
    ]);
  }

  function eventsSection(root) {
    var track = h("div", { "class": "cc-events__track", tabindex: "0", "aria-label": "Upcoming events, scroll sideways for more" });
    var prev = h("button", { type: "button", "aria-label": "Previous events", text: "←" });
    var next = h("button", { type: "button", "aria-label": "More events", text: "→" });
    function step(dir) { track.scrollBy({ left: dir * (track.clientWidth * 0.9), behavior: reduceMotion ? "auto" : "smooth" }); }
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    var sec = h("section", { "class": "cc-section cc-section--cream cc-events", "aria-labelledby": "cc-events-h" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-head-row" }, [
          h("div", null, [h("p", { "class": "cc-eyebrow", text: CC.home.eventsEyebrow }), h("h2", { "class": "cc-h2 cc-head", id: "cc-events-h", text: CC.home.eventsTitle })]),
          h("div", { "class": "cc-events__nav" }, [prev, next, h("a", { "class": "cc-btn cc-btn--ghost", href: CC.eventsUrl, text: "All events" })])
        ]),
        track
      ])
    ]);
    // 1) Calendar items already on the page (native "Upcoming Events" feed) as a quick first paint
    var native = qa(".upcoming_events .widget_content li", root).map(function (li) {
      var a = q("h6 a, a", li);
      return a ? { title: txt(a), href: a.getAttribute("href"), date: txt(q("small", li)), cta: "Details" } : null;
    }).filter(Boolean);
    function render(list) {
      track.textContent = "";
      if (!list.length) {
        track.appendChild(h("div", { "class": "cc-card" }, [h("h3", { text: "New events are on the way" }), h("p", { text: "Check the full calendar or join our weekly email to hear first." })]));
        return;
      }
      list.slice(0, 12).forEach(function (ev) { track.appendChild(eventCard(ev)); });
    }
    render(native);
    // 2) Registration events (richer: description + image) fetched from the Events page
    fetch(CC.eventsSource, { credentials: "same-origin" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (t) {
      if (!t) { return; }
      var doc = new DOMParser().parseFromString(t, "text/html");
      var evs = qa(".event", doc).map(function (e) {
        var a = q("h2 a", e); if (!a) { return null; }
        var im = q(".event__image img", e);
        var desc = q(".bottom_padding", e);
        var descText = desc ? desc.innerHTML.replace(/<br\s*\/?>/gi, " · ").replace(/<[^>]+>/g, " ") : "";
        var tmp = d.createElement("textarea"); tmp.innerHTML = descText;
        return {
          title: txt(a), href: a.getAttribute("href"),
          date: txt(q(".performance__date", e)),
          desc: tmp.value.replace(/\s+/g, " ").replace(/^( · )+/, "").trim(),
          img: im ? im.getAttribute("src") : "", cta: "Register"
        };
      }).filter(Boolean);
      if (evs.length) {
        var seen = {};
        evs.forEach(function (e) { seen[e.title.toLowerCase()] = 1; });
        render(evs.concat(native.filter(function (n) { return !seen[n.title.toLowerCase()]; })));
      }
    }).catch(function () { /* keep the native list */ });
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
        h("p", { "class": "cc-eyebrow", text: CC.home.programsEyebrow }),
        h("h2", { "class": "cc-h2 cc-head", text: head || "Programs for the whole family" }),
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
    return h("section", { "class": "cc-section", style: "padding-top:0", "aria-label": txt(q(".header-title", c)) || "Programs" }, [
      h("div", { "class": "cc-wrap" }, [h("div", { "class": "cc-grid cc-grid--4" }, cards)])
    ]);
  }

  function photosSection(root) {
    var p = q(".latest_photos", root);
    if (!p) { return null; }
    var more = q("a.readMore", p);
    var sec = h("section", { "class": "cc-section cc-photos", "aria-labelledby": "cc-photos-h" }, [
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-head-row" }, [
          h("div", null, [h("p", { "class": "cc-eyebrow", text: "Life at Chabad" }), h("h2", { "class": "cc-h2 cc-head", id: "cc-photos-h", text: txt(q(".widget_header h5", p)) || "Latest photos" })]),
          more ? h("a", { "class": "cc-btn cc-btn--ghost", href: more.getAttribute("href"), text: "See all photos" }) : null
        ])
      ])
    ]);
    if (more) { more.style.display = "none"; }
    q(".cc-wrap", sec).appendChild(p);
    return sec;
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
    if (!/\bhome\b/.test(d.body.className)) { return; }
    var hp = q(".hp-table");
    if (!hp || q("#cc-home")) { return; }
    var shell = h("div", { id: "cc-home" });
    [
      heroSection(readSlides(q(".promo_slider", hp) || hp)),
      quickSection(hp),
      weekSection(hp),
      eventsSection(hp),
      introSection(hp),
      programsSection(hp),
      photosSection(hp),
      subscribeSection(hp)
    ].forEach(function (s) { if (s) { shell.appendChild(s); } });
    hp.parentNode.insertBefore(shell, hp);
    addClass(hp, "cc-native-parked");
    addClass(html, "cc-shell-ready");
  }

  /* ---------- Run ---------- */
  onReady(function () {
    [header, footer, homeShell].forEach(function (fn) {
      try { fn(); } catch (e) {
        if (window.console) { console.error("[cc-theme]", fn.name, e); }
        if (fn === homeShell) { addClass(html, "cc-shell-failed"); }
      }
    });
  });
})();
