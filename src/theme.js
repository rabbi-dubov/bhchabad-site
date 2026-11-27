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

  /* The look (launch switch, Nov 27, 2026). The new look (html.cc-v2; theme.css section 25 onward) is what
     every visitor gets: LOOK_DEFAULT = "next". Adding "?look=now" to any address brings the previous look back
     for that browser only (a way back if a page misbehaves); "?look=next" returns to the new one.
     To put the whole site back on the previous look, set LOOK_DEFAULT to "now" and release.
     The header loader may already have added cc-v2 and the heading font before the page was drawn; this block
     does the same for an older loader, and takes the class off again when this browser asked for "now". */
  var LOOK_DEFAULT = "next", look = LOOK_DEFAULT;
  try {
    // ChabadOne rewrites "/7581757?look=next" to ".../aid/7581757/look/next/...", so both spellings are read
    var lk = /[?&\/]look[=\/](next|now)(?=[\/&#]|$)/.exec(location.pathname + location.search);
    if (lk) { localStorage.setItem("cc-look", lk[1]); }
    look = localStorage.getItem("cc-look") || LOOK_DEFAULT;
  } catch (e) {}
  html.className = html.className.replace(/\s*\bcc-v2\b/g, "");
  if (look === "next") {
    html.className += " cc-v2";
    if (!d.querySelector('link[href*="Instrument+Serif:ital@0;1"]')) {
      var lf = d.createElement("link");
      lf.rel = "stylesheet";
      lf.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap";
      d.head.appendChild(lf);
    }
  }

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
    // Registration page: most people one form may register, by event id (the number-of-registrants list
    // is cut to 1..N). The Missing Piece = 1-3 (Levi, Nov 17).
    regMaxAttendees: { "24326": 3 },
    // Least number of registrants by price category name, on every event: a couple is always 2 (Levi, Nov 20)
    regMinByCategory: [{ match: /couple/i, min: 2 }],
    // Our own About page. ChabadOne reserves /about for Chabad.org's "About Chabad-Lubavitch" article,
    // so every link on the site that points at /about is sent here instead (fixLinks).
    aboutUrl: "/7581763",
    donateUrl: "/4970020",
    contactUrl: "/tools/feedback.asp",   // the message form itself
    contactPageUrl: "/7603665",          // our Contact page (phone, email, the form); the phone menu's "Contact" opens it (Levi, Nov 16)
    // A "Contact" item in the main menu, just before Donate, on every page (Levi, Nov 16: "Yes, add it").
    // ChabadOne's menu shows only the first 5 pages + Donate, so the theme adds it. "" removes it.
    menuContact: "Contact",
    subscribeUrl: "/tools/subscribe/default.htm",
    // The newsletter page lists every list ChabadOne holds with none ticked; this one (Chabad News and Updates)
    // starts ticked, so "Email updates" > name > Subscribe works without hunting for the right box. "" = none.
    subscribeDefaultList: "22372",
    // Old addresses from the Wix site that people may still have (Google, old emails): the "page not found"
    // page sends them on to the page that replaced them. Lower case, no trailing slash.
    oldPaths: { "/past-courses": "/7617671", "/jliaudio": "/7617671", "/try": "/7581757" },
    // Menu (Nov 16 review). On phones a row with sub-pages opens its list when tapped; the row's own page
    // becomes the list's first line, named here (else "<Label> overview"). Hidden on computers.
    menuOverview: { "About": "About us", "Learn": "Learn overview" },
    // Sub-page names in the menus, by page number (the page's own title stays as it is). PROPOSAL in test
    // only, Nov 16: Levi agreed the Learn list was confusing; wording waits for his OK.
    menuLabels: {
      "7593397": "JLI course: Kabbalah",
      "7620415": "JLI course: The Missing Piece",
      "7645563": "JLI course: Kabbalah",            // the ordinary pages that replace the two JLI mini-sites
      "7645556": "JLI course: The Missing Piece",
      "7593500": "Women’s learning: NEXT GENesis"
    },
    // Sub-pages left out of the menus, by page number (Torah Deep Dive is not running; proposal, as above)
    menuHide: ["7593547"],
    // Testimonials live on an ordinary ChabadOne page. Each one = a Quote (blockquote) whose last line
    // starts with a dash: "— Name, context". The homepage reads them; no quotes = no section.
    testimonialsUrl: "/7617013", // "In their words" page (hidden, under About)
    // New look, course pages (see coursePageNext): page number -> the course's name in course-pages.json.
    // moved = the old JLI mini-site pages (no site header) -> the ordinary pages made Nov 27 to replace them
    // (Levi: "Move all of them over to the new template"); host = the page that shows a course by "?course=<name>".
    courseNext: {
      pages: { "7645556": "missing-piece", "7645563": "kabbalah", "7593500": "genesis" },
      moved: { "7620415": "7645556", "7593397": "7645563" },
      // the course pages offered on the "page not found" page, in this order (page number, name)
      list: [["7645556", "The Missing Piece"], ["7645563", "Kabbalah and the Hidden Architecture of You"], ["7593500", "NEXT GENesis"]],
      host: "/7581757"
    },
    // Homepage photos live on an ordinary ChabadOne page: pictures under a heading containing "Welcome"
    // rotate beside the welcome text, under "Strip" they scroll in the photo strip, under "Donate" the
    // first one is the donate background, under "Cards" they replace the program-card pictures in order.
    // No headings: the first 4 pictures = welcome, all = strip.
    photosUrl: "/7603881",   // "Homepage photos" page (hidden, under About)
    shabbatPlace: "Bloomfield Hills",
    // Slim notice bar at the top of every page; a visitor's × hides it for them. Set to null to remove it.
    notice: {
      id: "new-site-2026",   // change the id to show a new message to visitors who closed the old one
      text: "Welcome to our new website! We're still building it, so some pages are on the way.",
      linkText: "Can't find something? Let us know",
      linkHref: "/tools/feedback.asp"
    },
    quoteFont: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap",
    // Hebrew serif for the homepage B"H, loaded for just those letters
    bhFont: "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500&text=%D7%91%D7%94%D7%B4&display=swap",
    home: {
      // B"H in the top corner of the homepage hero only (Levi, Oct 27); "" removes it
      bh: "ב״ה",
      // Homepage sections, in order.
      // "pair" = newsletter and donate side by side (Levi, Nov 16); "partner" and "subscribe" still work alone.
      sections: ["hero", "quick", "intro", "strip", "events", "programs", "testimonials", "pair"],
      // New look only (html.cc-v2): its own section order, and a numbers band in place of a Tanya feature
      // (Levi, Nov 26: "a bar with powerful stats"). Only figures already published on the site.
      // Nov 27 (Levi): the numbers band felt out of place; the strongest feedback carries that spot instead
      // ("numbers" still works if it is put back in this list).
      sectionsNext: ["top", "ways", "events", "intro", "testimonials", "pair"],
      // New look: how many quotes "In their words" shows at once (the first on the testimonials page is the large one)
      wallQuotes: 4,
      // New look, the opening ("top"): one photo with the first slide's own words (eyebrow, title, text), and a
      // "Next up" card filled from the nearest dated event. topEm = the word of the title set in italics.
      // The photo: the pictures under a "Hero" heading on the photos page (they change slowly), else the first slide's.
      topEm: "home",
      topCtas: [["See what’s coming up", "#cc-events-h"], ["Get in touch", "/7603665"]],
      // New look, "ways": the ways in, in place of the icon row (name, one line, page).
      // Shul added Nov 27 (Levi: "we should also highlight the shul experience here"). Four, not five, since the
      // launch day: Tanya is part of Learn here (Levi: "merge tanya with learn, so that there are only 4
      // sections there"); it keeps its own place in the menu. The Learn line's wording is Claude's.
      ways: [
        ["Learn", "JLI courses, weekly classes and Tanya, in person or on Zoom", "/7581757"],
        ["Celebrate", "Holidays and events through the year", "/7581764"],
        ["Shul", "Shabbat services, once a month", "/7581760"],
        ["Women", "NEXT GENesis: monthly evenings of learning, with dinner", "/7593500"]
      ],
      numbersTitle: "In Bloomfield Hills since", numbersYear: "2017",
      numbers: [["46", "courses taught"], ["550+", "course participants"], ["40,000+", "Tanya podcast plays"], ["95", "countries listening"]],
      numbersLinks: [["See this season’s courses", "/7581757"], ["Listen to the Tanya podcast", "/7581759"]],
      // Hero = every slide of the ChabadOne promo slider. In a slide's title, "Eyebrow | Title" adds the
      // small label above it; in its text, "Description | Date line" adds the date line under it.
      heroEyebrow: "Shalom and welcome",   // label for the first slide when its title has none
      heroCta: "See what's coming up",
      heroSeconds: 7,
      secondaryCta: { text: "About us", href: "/7581763" },   // shown on the first slide only (= CC.aboutUrl)
      introEyebrow: "Welcome",
      // New look, welcome section: the word of its heading set in italics, and the three promises under the text
      introEm: "you",
      introPoints: ["No membership", "No labels", "No prior knowledge"],
      eventsEyebrow: "Coming up",
      eventsTitle: "Discover the joy and meaning in Judaism",
      eventsLine: "The first class of every course is yours to try, commitment-free.",
      eventsAll: "All events",   // was "Full calendar": the page it opens is a list of events, not a calendar (Levi, Nov 26)
      // Course page for a registration event (event id -> page). Its card's "Learn more" opens the page and
      // "Register" the registration (Levi, Nov 17). Events not listed keep their own link.
      eventPages: { "24326": "/7645556", "23504": "/7645563", "23481": "/7593500" },
      // The same courses by name, for slides and cards whose link has no event number (e.g. /jli-register)
      eventNames: { "24326": "Missing Piece", "23504": "Kabbalah", "23481": "NEXT GENesis" },
      // Calendar items to show even when the homepage feed (next 5 calendar items only) hasn't reached them yet.
      // date = YYYY-MM-DD; each drops off by itself after its date, and isn't doubled once the feed lists it.
      // image = the card's photo (paste the picture's address); without it, the first picture on the item's page. register = optional
      // "Register" button ("<page>#rsvp" scrolls to the RSVP form on that page).
      extraEvents: [
        { title: "Shain Park Menorah Lighting", date: "2026-12-05", time: "6:30 pm", href: "/7358669", register: "/7358669#rsvp", first: true,
          image: "https://w2.chabad.org/media/images/1396/Mdjq13962289.jpg" }
      ],
      // Fixed date line on a card instead of the feed's date, for series (the first word match wins; Levi, Nov 20)
      whenText: [
        { match: /genesis/i, text: "Monthly on Tuesdays" }
      ],
      // Events whose registration has closed (event id): their cards and slides keep "Learn more" but drop "Register"
      // (Levi, Nov 22: the Kabbalah course has closed registration)
      closedEvents: ["23504"],
      // Event-name prefixes turned into a readable label on the course card
      prefixes: { "JLI": "JLI course", "RCS": "Rosh Chodesh Society" },
      // Category tag on each event card: the first rule whose words match the event's name, label or text
      tags: [
        { label: "Holiday", tone: "holiday", match: /chanuk|hanuk|menorah|purim|passover|pesach|seder|sukk|shavu|rosh hashana|yom kippur|simch|lag b.?omer|tu b.?shvat|megillah|shofar/i },
        { label: "Shabbat", tone: "shabbat", match: /shabbat|shabbos|kiddush/i },
        { label: "Women", tone: "women", match: /women|ladies|genesis|challah|rosh chodesh/i },
        { label: "JLI Course", tone: "course", match: /\bjli\b|course/i }
      ],
      tagDefault: { label: "Event", tone: "event" },
      programsEyebrow: "Our programs",
      programsTitle: "Programs for the whole community",
      programsMax: 4,   // the ChabadOne Programs widget always holds 6 items; show the first 4
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
      subscribeEyebrow: "Email updates",
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
  function removeClass(n, c) { if (n) { n.className = (" " + n.className + " ").replace(new RegExp(" " + c + "(?= )", "g"), "").replace(/^ +| +$/g, ""); } }
  // Fetch a same-site page at most once per `ttl` per visitor: the parsed result (or the lack of one)
  // is kept in localStorage, so ordinary browsing does not send extra requests to ChabadOne.
  function cachedPage(key, ttl, url, parse, done) {
    var now = Date.now();
    try { var c = JSON.parse(localStorage.getItem(key) || "null"); if (c && now - c.at < ttl) { done(c.d); return; } } catch (e) {}
    if (!url || !window.fetch || !window.DOMParser) { done(null); return; }
    function save(v) { try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), d: v })); } catch (e) {} done(v); }
    fetch(url, { credentials: "same-origin" }).then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (t) { var v = null; try { v = t ? parse(new DOMParser().parseFromString(t, "text/html")) : null; } catch (e) {} return v; }, function () { return null; })
      .then(save);
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
    // New look: the header keeps the emblem and the name typed in the site's own fonts (Levi, Nov 27: "Revert
    // back to the websites fonts/style"; the official wide logo with its own lettering was tried and dropped).
    // Over the homepage photo the emblem has to be white: that is the emblem part of the official on-dark logo
    // file, shown through a cut-out (theme.css .cc-emblem-dark); the typed name turns white there.
    if (lw && /cc-v2/.test(html.className) && !q(".cc-emblem-dark", lw)) {
      var lb = (window.ccBase || "https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/live/").replace(/[^\/]+\/$/, "") + "data/brand/";
      lw.appendChild(h("span", { "class": "cc-emblem-dark", "aria-hidden": "true" }, [h("img", { src: lb + "logo-wide-on-dark-web.png", alt: "", width: "614", height: "176" })]));
    }
    // The emblem repeats the title's home link: keep it clickable, but out of the tab order and screen readers
    qa("#header_branding a").forEach(function (a) {
      if (a !== t && !txt(a) && !a.getAttribute("aria-label")) {
        a.setAttribute("aria-hidden", "true"); a.setAttribute("tabindex", "-1");
        // its picture is decoration too: an empty alt, so no screen reader reads out the file name
        qa("img:not([alt])", a).forEach(function (im) { im.setAttribute("alt", ""); });
      }
    });
    contactItem();
    phoneMenu();
    menus();
  }

  /* "Contact" in the main menu, just before Donate (getting in touch is the site's goal). It copies the
     last plain menu item (Shul), so it looks and works like the others on computers and in the phone drawer. */
  function contactItem() {
    var row = q("#tabContentMain");
    if (!CC.menuContact || !CC.contactPageUrl || !row || q(".cc-contact-item", row)) { return; }
    var kids = Array.prototype.slice.call(row.children), donate = null, model = null, i;
    for (i = 0; i < kids.length; i++) { if (/\bdonate_link\b/.test(kids[i].className)) { donate = kids[i]; } }
    for (i = kids.length - 1; i >= 0; i--) {
      if (/\bco_menu_item\b/.test(kids[i].className) && !/\b(donate_link|multi_level|home)\b/.test(kids[i].className)) { model = kids[i]; break; }
    }
    if (!donate || !model) { return; }
    var id = (/(\d+)$/.exec(CC.contactPageUrl) || [])[1], item = model.cloneNode(true);
    var here = !!id && location.pathname.indexOf("/aid/" + id + "/") >= 0;
    item.className = "co_menu_item cc-contact-item" + (here ? " selected" : "");
    // on the Contact page itself only Contact is marked (ChabadOne also marks About, its parent in the menu)
    if (here) { kids.forEach(function (k) { if (k !== item) { removeClass(k, "selected"); } }); }
    qa("[id]", item).forEach(function (n) { n.removeAttribute("id"); });
    qa("a", item).forEach(function (a) { a.setAttribute("href", CC.contactPageUrl); });
    var lab = q("span.parent a", item);
    if (lab) { lab.textContent = CC.menuContact; }
    var prev = donate.previousElementSibling, div = prev && /\bco_menu_item_divider\b/.test(prev.className) ? prev.cloneNode(true) : null;
    row.insertBefore(item, donate);
    if (div) { row.insertBefore(div, donate); }
  }

  // The phone drawer replaces the desktop menu at this width (the same markup, restyled by the CSS)
  var phoneMq = window.matchMedia ? window.matchMedia("(max-width: 1024px)") : { matches: false };
  function onMq(fn) { if (phoneMq.addEventListener) { phoneMq.addEventListener("change", fn); } else if (phoneMq.addListener) { phoneMq.addListener(fn); } }

  /* Phone menu (ChabadOne's drawer): names for its two icon buttons, Escape closes it,
     and the page behind stays still while it is open (html.cc-menu-open, see the CSS).
     While closed it sits off-screen, so it is made inert (keyboards and screen readers skip its links);
     opening it moves the focus to its close button, closing it brings the focus back to the menu button. */
  function phoneMenu() {
    // two elements carry .js-mobile-menu-close: the × button and the dimmed backdrop beside the drawer.
    // The × is the one to name and focus; the backdrop is for mouse and touch only (Nov 16: the backdrop
    // got the name and the focus, and its focus ring showed as an orange line along the drawer).
    var open = q(".js-mobile-menu-open"), was = false;
    if (!open || open.getAttribute("data-cc-menu")) { return; }
    open.setAttribute("data-cc-menu", "1");
    open.setAttribute("aria-label", "Menu");
    open.setAttribute("aria-expanded", "false");
    // ChabadOne's own script builds parts of the drawer after ours has run (the × button, the backdrop, the
    // sub-list arrows), so they are looked up again whenever they are needed, and once more on page load
    // (Nov 16: on the live site the × stayed unnamed and the closed drawer was not made inert).
    function parts() { return { wrap: q(".site-nav-wrapper"), close: q(".site-nav-wrapper .cs-mobile-menu-close"), back: q(".cs-mobile-menu-close-back") }; }
    function prep() {
      var p = parts();
      if (p.close) { p.close.setAttribute("aria-label", "Close menu"); }
      if (p.back && p.back !== p.close) { p.back.setAttribute("tabindex", "-1"); p.back.setAttribute("aria-hidden", "true"); p.back.removeAttribute("aria-label"); }
      // the drawer's bottom "Contact" opened the bare message form: with the Contact row in the menu it goes;
      // without it, it opens our Contact page
      if (CC.contactPageUrl) {
        var hasItem = !!q("#tabContentMain .cc-contact-item");
        qa(".mobile-menu-bottom-links a").forEach(function (a) {
          if (!/feedback\.asp/i.test(a.getAttribute("href") || "")) { return; }
          if (hasItem) { a.style.setProperty("display", "none", "important"); a.setAttribute("aria-hidden", "true"); a.setAttribute("tabindex", "-1"); }
          else { a.setAttribute("href", CC.contactPageUrl); }
        });
      }
      return p;
    }
    function isOpen() { return /\bmenu-open\b/.test(d.body.className); }
    function sync() {
      var p = prep(), on = isOpen();
      open.setAttribute("aria-expanded", on ? "true" : "false");
      if (on) { addClass(html, "cc-menu-open"); } else { html.className = html.className.replace(/\s?cc-menu-open\b/g, ""); }
      if (p.wrap) { p.wrap.inert = phoneMq.matches && !on; }
      if (on && !was && p.close) { try { p.close.focus(); } catch (e) {} }
      if (!on && was && p.wrap && p.wrap.contains(d.activeElement)) { open.focus(); }
      was = on;
    }
    sync();
    onMq(sync);
    window.addEventListener("load", sync);
    if (window.MutationObserver) { new MutationObserver(sync).observe(d.body, { attributes: true, attributeFilter: ["class"] }); }
    d.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && isOpen()) {
        var close = parts().close;
        if (close) { close.click(); } else { d.body.className = d.body.className.replace(/\s?menu-open\b/g, ""); }
        if (isOpen()) { d.body.className = d.body.className.replace(/\s?menu-open\b/g, ""); }
        open.focus();
      }
    });
  }

  /* Menus (Levi, Nov 16 review):
     - computers: a dropdown also opens for the keyboard (focus inside it) and Escape closes it;
       ChabadOne opened them on mouse hover only, so Tab skipped every sub-page;
     - phones: tapping a row with sub-pages opens its list (only the small arrow did), and the row's
       own page is the list's first line (CC.menuOverview);
     - sub-page names and hidden sub-pages from CC.menuLabels / CC.menuHide. */
  function menus() {
    var byId = function (a) { var m = /\/aid\/(\d+)\//.exec(a.getAttribute("href") || "") || /^\/(\d+)$/.exec(a.getAttribute("href") || ""); return m ? m[1] : ""; };
    qa("#tabContentMain .co_submenu_container a.item").forEach(function (a) {
      var id = byId(a), s = q("span", a);
      if (id && (CC.menuHide || []).indexOf(id) >= 0) { a.style.setProperty("display", "none", "important"); a.setAttribute("aria-hidden", "true"); a.setAttribute("tabindex", "-1"); return; }
      if (id && CC.menuLabels && CC.menuLabels[id] && s) { s.textContent = CC.menuLabels[id]; }
    });
    qa("#tabContentMain > .co_menu_item.multi_level").forEach(function (li) {
      if (li.getAttribute("data-cc-menu")) { return; }
      li.setAttribute("data-cc-menu", "1");
      var label = q("span.parent a", li), col = q(".co_submenu_container .co_column", li), quiet = false;
      if (!label) { return; }
      var name = txt(label);
      // the extra link ChabadOne lays behind an open dropdown repeats the label: one stop for the keyboard is enough
      qa("a.bg_extension", li).forEach(function (b) { b.setAttribute("tabindex", "-1"); b.setAttribute("aria-hidden", "true"); });
      if (col && !q(".cc-overview", col)) {
        col.insertBefore(h("a", { "class": "item cc-overview", href: label.getAttribute("href") }, [h("span", { text: (CC.menuOverview || {})[name] || name + " overview" })]), col.firstChild);
      }
      // on phones the whole row is the control, so the small arrow button stays out of the tab order.
      // ChabadOne adds that button with its own script after ours, so it is looked up when needed.
      function arrow() {
        var t = q(".cs-menu-item-toggle", li);
        if (t && !t.getAttribute("data-cc-quiet")) { t.setAttribute("data-cc-quiet", "1"); t.setAttribute("tabindex", "-1"); t.setAttribute("aria-hidden", "true"); }
        return t;
      }
      arrow();
      window.addEventListener("load", arrow);
      function shown() { return phoneMq.matches ? /\bitem-open\b/.test(li.className) : /\b(hover|cc-kb-open)\b/.test(li.className); }
      function sync() { label.setAttribute("aria-expanded", shown() ? "true" : "false"); }
      label.addEventListener("click", function (e) {
        if (!phoneMq.matches) { return; }
        var t = arrow();
        e.preventDefault();
        if (t) { t.click(); } else if (/\bitem-open\b/.test(li.className)) { removeClass(li, "item-open"); } else { addClass(li, "item-open"); }
      });
      // ChabadOne opens a list with inline styles on mouse hover; the keyboard gets the class .cc-kb-open
      // (see the CSS), only for keyboard focus, so a mouse click on a label doesn't pin its list open
      function byKeyboard(el) { try { return el.matches(":focus-visible"); } catch (x) { return true; } }
      li.addEventListener("focusin", function (e) { if (!phoneMq.matches && !quiet && byKeyboard(e.target)) { addClass(li, "cc-kb-open"); } });
      li.addEventListener("focusout", function (e) {
        if (!(e.relatedTarget && li.contains(e.relatedTarget))) { removeClass(li, "cc-kb-open"); }
      });
      li.addEventListener("keydown", function (e) {
        if ((e.key === "Escape" || e.key === "Esc") && /\bcc-kb-open\b/.test(li.className)) {
          removeClass(li, "cc-kb-open"); quiet = true; label.focus(); quiet = false;
        }
      });
      if (window.MutationObserver) { new MutationObserver(sync).observe(li, { attributes: true, attributeFilter: ["class"] }); }
      onMq(sync);
      sync();
    });
  }

  /* Curly quotes and apostrophes everywhere (Levi, Nov 16: straight ones look off, above all in the titles).
     Pages typed in ChabadOne use typewriter ' and "; visible text gets ’ ‘ “ ” instead.
     Form fields, code and scripts are never touched, nor are attributes (alt, links). */
  function curl(v, prev) {
    var out = "", i, c, b, open = /[\s(\[{—–‘“]/;
    for (i = 0; i < v.length; i++) {
      c = v.charAt(i); b = i ? v.charAt(i - 1) : prev;
      if (c === "\"") { out += (b === "" || open.test(b)) ? "“" : "”"; }
      else if (c === "'") { out += open.test(b) ? "‘" : "’"; }
      else { out += c; }
    }
    return out;
  }
  function smartQuotes(root) {
    root = root || d.body;
    if (!root || !d.createTreeWalker) { return; }
    var skip = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|NOSCRIPT|TITLE)$/;
    var w = d.createTreeWalker(root, 4 /* text nodes */, null, false), n, v, p, ok, prev = "";
    while ((n = w.nextNode())) {
      v = n.nodeValue;
      if (/['"]/.test(v)) {
        ok = true;
        for (p = n.parentNode; p && p !== root.parentNode; p = p.parentNode) { if (skip.test(p.nodeName) || p.isContentEditable) { ok = false; break; } }
        if (ok) { n.nodeValue = v = curl(v, prev); }
      }
      if (v.length) { prev = v.charAt(v.length - 1); }
    }
  }

  /* ChabadOne reserves some short addresses for Chabad.org articles (/about opens "About Chabad-Lubavitch").
     Content typed in ChabadOne (the homepage message's "Get to know us", for one) still uses them,
     so links to those addresses go to our own page instead. */
  function fixLinks() {
    var map = { "/about": CC.aboutUrl };
    qa("a[href]").forEach(function (a) {
      // any of the site's own domains (bhchabad.org since the Nov 20 switch, lightbhchabad.org before it), with or without www
      var href = (a.getAttribute("href") || "").replace(/^(https?:)?\/\/(www\.)?(light)?bhchabad\.org/i, "").replace(/[?#].*$/, "").replace(/\/$/, "").toLowerCase();
      if (map[href]) { a.setAttribute("href", map[href]); }
    });
  }

  /* ---------- 1b. Notice bar ("new website, still building") ---------- */
  function noticeBar() {
    var n = CC.notice;
    if (!n || q(".cc-notice")) { return; }
    var key = "cc-notice-closed-" + n.id;
    try { if (localStorage.getItem(key)) { return; } } catch (e) {}
    var close = h("button", { type: "button", "class": "cc-notice__close", "aria-label": "Close this message", text: "×" });
    var bar = h("div", { "class": "cc-notice", role: "note" }, [h("div", { "class": "cc-wrap" }, [
      h("p", null, [h("span", { text: n.text + " " }), n.linkText ? h("a", { href: n.linkHref, text: n.linkText }) : null]),
      close
    ])]);
    close.addEventListener("click", function () {
      try { localStorage.setItem(key, "1"); } catch (e) {}
      if (bar.parentNode) { bar.parentNode.removeChild(bar); }
    });
    d.body.insertBefore(bar, d.body.firstChild);
  }

  /* ---------- 2. Footer: rich multi-column footer ---------- */
  function footer() {
    var f = q("#footer");
    if (!f || q("#cc-footer")) { return; }
    var navLinks = qa("#tabContentMain > .co_menu_item:not(.home):not(.donate_link):not(.cc-contact-item) > span.parent a").map(function (a) {
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
        h("li", null, [h("a", { href: CC.subscribeUrl, text: "Email updates" })]),   // the newsletter goes out twice a month
        h("li", null, [h("a", { href: CC.donateUrl, text: "Donate" })])
      ])]),
      // The center is the family home (Levi, Nov 15): no street address or map here; ask people to get in touch
      h("div", null, [h("h4", { text: "Get in touch" }), h("ul", null, [
        h("li", null, [h("a", { href: "tel:" + CC.phone.replace(/\D/g, ""), text: CC.phone })]),
        h("li", null, [h("a", { href: "mailto:" + CC.email, text: CC.email })]),
        h("li", null, [h("a", { href: CC.contactUrl, text: "Send us a message" })])
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
    // Hidden slides are also inert, so the keyboard can't tab into their invisible buttons
    function hide(l, off) { if (off) { l.setAttribute("aria-hidden", "true"); } else { l.removeAttribute("aria-hidden"); } l.inert = off; }
    layers.forEach(function (l, i) { addClass(l, "cc-slide"); if (i === 0) { addClass(l, "is-on"); } else { hide(l, true); } });
    box.show = function (i) {
      qa(":scope > .cc-slide", box).forEach(function (l, j) {
        l.className = l.className.replace(/\s?is-on\b/g, "");
        if (j === i) { addClass(l, "is-on"); }
        hide(l, j !== i);
      });
    };
    return box;
  }
  function photoLayer(src, alt) { return h("div", { "class": "cc-photo", role: alt ? "img" : null, "aria-label": alt || null, "aria-hidden": alt ? null : "true", style: "background-image:url(\"" + String(src).replace(/"/g, "%22") + "\")" }); }
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

  // Course page for a link or title (CC.home.eventPages / eventNames): { id, page, reg } or null
  function coursePage(href, title) {
    var pages = CC.home.eventPages || {}, names = CC.home.eventNames || {};
    var m = /eventid[=\/](\d+)/i.exec(href || ""), id = m && pages[m[1]] ? m[1] : "";
    if (!id) {
      var k = evKey(title);
      Object.keys(names).some(function (n) { var nk = evKey(names[n]); if (k && nk && pages[n] && k.indexOf(nk) >= 0) { id = n; return true; } return false; });
    }
    if (!id) { return null; }
    // Only a link that names this event's number is kept; anything else (/jli-register, a page) gets the direct address
    var own = new RegExp("eventid[=\\/]" + id + "(\\D|$)", "i").test(href || "");
    if ((CC.home.closedEvents || []).indexOf(id) >= 0) { return { id: id, page: pages[id], reg: "" }; }
    return { id: id, page: pages[id], reg: own ? href : "/tools/events/register.asp?eventid=" + id };
  }

  // Rotating hero: every slide of the ChabadOne promo slider, with arrows, dots and a pause on hover.
  function heroSection(slides) {
    if (!slides.length) { return null; }
    var texts = slides.map(function (s, i) {
      var eyebrow = s.eyebrow || (i === 0 ? CC.home.heroEyebrow : "");
      var ctaHref = s.href || "#cc-events-h", ctaText = s.href ? (s.cta || "Learn more") : CC.home.heroCta, regBtn = null;
      // A course slide: "Learn more" opens the course page, "Register" the registration (Levi, Nov 17)
      var cp = s.href ? coursePage(s.href, s.eyebrow + " " + s.title) : null;
      if (cp && ctaHref !== cp.page) {
        ctaHref = cp.page; ctaText = "Learn more";
        if (cp.reg) regBtn = h("a", { "class": "cc-btn cc-btn--ghost", href: cp.reg, text: "Register", style: "color: var(--cc-white) !important" });
      }
      return h("div", null, [
        eyebrow ? h("p", { "class": "cc-eyebrow", text: eyebrow }) : null,
        // every slide title is an h2: the page's one h1 is the organisation's name (homeShell), which stays
        // readable to screen readers and search engines whichever slide is showing (a hidden slide is inert)
        h("h2", { "class": "cc-hero__title cc-head", text: s.title }),
        s.sub ? h("p", { "class": "cc-hero__sub", text: s.sub }) : null,
        s.info ? h("p", { "class": "cc-hero__info", text: s.info }) : null,
        h("div", { "class": "cc-hero__ctas" }, [
          h("a", { "class": "cc-btn cc-btn--light", href: ctaHref, target: s.target || null, text: ctaText }),
          regBtn,
          i === 0 && !regBtn ? h("a", { "class": "cc-btn cc-btn--ghost", href: CC.home.secondaryCta.href, text: CC.home.secondaryCta.text, style: "color: var(--cc-white) !important" }) : null
        ])
      ]);
    });
    var textBox = stack("cc-hero__text", texts);
    var imgBox = stack("cc-hero__imgs", slides.map(function (s) { var l = photoLayer(s.img, s.title); addClass(l, "cc-hero__img"); return l; }));
    var media = h("div", { "class": "cc-hero__media" }, [imgBox]);
    var sec = h("section", { "class": "cc-hero", "aria-label": "Welcome", "aria-roledescription": "carousel" }, [h("div", { "class": "cc-wrap" }, [textBox, media])]);
    if (slides.length < 2) { return sec; }
    var idx = 0, timer = null, hovered = false, focused = false;
    var dots = h("div", { "class": "cc-hero__dots", role: "group", "aria-label": "Choose a slide" });
    function show(i) {
      idx = (i + slides.length) % slides.length;
      textBox.show(idx); imgBox.show(idx);
      qa("button", dots).forEach(function (b, j) { b.setAttribute("aria-current", j === idx ? "true" : "false"); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    // rotation waits while the mouse is over the hero or the keyboard is inside it (a click on a dot doesn't restart it)
    function start() { stop(); if (!reduceMotion && !hovered && !focused) { timer = setInterval(function () { show(idx + 1); }, CC.home.heroSeconds * 1000); } }
    slides.forEach(function (s, i) { var b = h("button", { type: "button", "aria-label": "Slide " + (i + 1) + ": " + s.title, "aria-current": i ? "false" : "true" }); b.addEventListener("click", function () { show(i); start(); }); dots.appendChild(b); });
    var prev = roundBtn("Previous slide", "←"), next = roundBtn("Next slide", "→");
    prev.addEventListener("click", function () { show(idx - 1); start(); });
    next.addEventListener("click", function () { show(idx + 1); start(); });
    media.appendChild(h("div", { "class": "cc-hero__nav" }, [prev, dots, next]));
    sec.addEventListener("mouseenter", function () { hovered = true; stop(); });
    sec.addEventListener("mouseleave", function () { hovered = false; start(); });
    sec.addEventListener("focusin", function () { focused = true; stop(); });
    sec.addEventListener("focusout", function (e) { if (!e.relatedTarget || !sec.contains(e.relatedTarget)) { focused = false; start(); } });
    start();
    return sec;
  }

  // Quick-link icons drawn in the theme's own line style, picked by the link's words;
  // a link with no match keeps the icon chosen in ChabadOne.
  function svgIcon(body) {
    return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7E1735" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + body + "</svg>");
  }
  var QUICK_ICONS = [
    { match: /event|calendar/i, svg: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>' },
    { match: /tanya|listen|podcast/i, svg: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3.5" y="14" width="4.5" height="6" rx="1.5"/><rect x="16" y="14" width="4.5" height="6" rx="1.5"/>' },
    { match: /educat|learn|class|course/i, svg: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>' },
    { match: /donat|give|support/i, svg: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>' },
    { match: /contact|email|connect/i, svg: '<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="m4 7 8 6 8-6"/>' }
  ];
  function quickIcon(label, fallback) {
    for (var i = 0; i < QUICK_ICONS.length; i++) { if (QUICK_ICONS[i].match.test(label)) { return svgIcon(QUICK_ICONS[i].svg); } }
    return fallback;
  }
  function quickSection(root) {
    var w = q(".widget-4.icon, .icon.custom", root);
    if (!w) { return null; }
    var items = qa(".widget_content .item", w).map(function (it) {
      var a = q(".title a", it) || q("a", it), im = q(".icon img", it);
      if (!a) { return null; }
      var src = quickIcon(txt(a), im ? im.getAttribute("src") : "");
      return h("li", null, [h("a", { href: a.getAttribute("href"), target: a.getAttribute("target") || null }, [
        src ? h("img", { src: src, alt: "" }) : null, txt(a)
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
  // One quote at a time with arrows and dots; onShow(i) lets a caller follow along (e.g. a photo per quote)
  function quoteRotator(items, onShow) {
    var idx = 0;
    var quote = h("p", { "class": "cc-testimonial__quote" });
    var by = h("p", { "class": "cc-testimonial__by" });
    var dots = h("div", { "class": "cc-hero__dots cc-testimonials__dots", role: "group", "aria-label": "Choose a testimonial" });
    function show(i) {
      idx = (i + items.length) % items.length; var t = items[idx];
      quote.textContent = "“" + curl(t.quote, " ") + "”";
      by.textContent = "";
      if (t.by) { by.appendChild(h("strong", { text: t.by })); }
      if (t.ctx) { by.appendChild(h("span", { text: t.ctx })); }
      if (onShow) { onShow(idx); }
      qa("button", dots).forEach(function (b, j) { b.setAttribute("aria-current", j === idx ? "true" : "false"); });
    }
    var nav = null;
    if (items.length > 1) {
      items.forEach(function (t, i) { var b = h("button", { type: "button", "aria-label": "Testimonial " + (i + 1) }); b.addEventListener("click", function () { show(i); }); dots.appendChild(b); });
      var prev = h("button", { type: "button", "class": "cc-round", "aria-label": "Previous testimonial", text: "←" });
      var next = h("button", { type: "button", "class": "cc-round", "aria-label": "Next testimonial", text: "→" });
      prev.addEventListener("click", function () { show(idx - 1); });
      next.addEventListener("click", function () { show(idx + 1); });
      nav = h("div", { "class": "cc-testimonials__nav" }, [prev, dots, next]);
    }
    return { figure: h("figure", { "class": "cc-testimonial", "aria-live": "polite" }, [quote, by]), nav: nav, show: show };
  }
  function testimonialsSection(list) {
    var sec = h("section", { "class": "cc-section cc-section--cream cc-testimonials", "aria-labelledby": "cc-tm-h" });
    function build(items) {
      if (!items || !items.length) { sec.hidden = true; if (sec.parentNode) { sec.parentNode.removeChild(sec); } return; }
      loadQuoteFont();
      // New look (Levi, Nov 27: the strongest feedback in place of the numbers band): a dark band with the first
      // quote of the testimonials page set large and the next few in a row under it, all in view at once.
      // Words only: no picture stands beside a quote unless it is that person (Levi, Nov 26).
      if (/cc-v2/.test(html.className)) {
        var fig = function (t, cls) {
          return h("figure", { "class": "cc-wall__q " + cls }, [
            h("p", { "class": "cc-wall__text", text: "“" + curl(t.quote, " ") + "”" }),
            t.by ? h("figcaption", { "class": "cc-wall__by", text: t.by }) : null
          ]);
        };
        var rest = items.slice(1, Math.max(1, CC.home.wallQuotes || 4));
        sec.className = "cc-section cc-section--ink cc-wall";
        sec.textContent = "";
        sec.appendChild(h("div", { "class": "cc-wrap" }, [
          h("h2", { "class": "cc-eyebrow", id: "cc-tm-h", text: CC.home.testimonialsTitle }),
          fig(items[0], "cc-wall__q--big"),
          rest.length ? h("div", { "class": "cc-wall__row" }, rest.map(function (t) { return fig(t, ""); })) : null
        ]));
        return;
      }
      // One photo layer per distinct picture; a quote without its own picture keeps the one before it
      var photos = [], layerOf = [], last = -1;
      items.forEach(function (t, i) {
        if (t.photo) { var j = photos.indexOf(t.photo); if (j < 0) { photos.push(t.photo); j = photos.length - 1; } last = j; }
        layerOf[i] = last < 0 ? 0 : last;
      });
      var photoBox = photos.length ? stack("cc-tm__photo", photos.map(function (p) { return photoLayer(p, ""); })) : null;
      var rot = quoteRotator(items, photoBox ? function (i) { photoBox.show(layerOf[i]); } : null);
      var show = rot.show;
      var body = [
        h("p", { "class": "cc-eyebrow", text: CC.home.testimonialsEyebrow }),
        h("h2", { "class": "cc-h2 cc-head", id: "cc-tm-h", text: CC.home.testimonialsTitle }),
        photoBox ? h("span", { "class": "cc-tm__mark", "aria-hidden": "true", text: "“" }) : null,
        rot.figure,
        rot.nav
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
    var g = { hero: [], welcome: [], strip: [], donate: [], cards: [] }, all = [], cur = null, headed = false;
    qa("h1, h2, h3, h4, h5, h6, strong, b, img", root).forEach(function (el) {
      if (el.tagName === "IMG") {
        var src = imgSrc(el);
        if (!src) { return; }
        var p = { src: src, alt: el.getAttribute("alt") || "" };
        all.push(p); if (cur) { g[cur].push(p); }
        return;
      }
      var t = txt(el).toLowerCase();
      if (/hero|opening/.test(t)) { cur = "hero"; headed = true; }
      else if (/welcome/.test(t)) { cur = "welcome"; headed = true; }
      else if (/strip|gallery|community/.test(t)) { cur = "strip"; headed = true; }
      else if (/donat|partner/.test(t)) { cur = "donate"; headed = true; }
      else if (/card|program/.test(t)) { cur = "cards"; headed = true; }
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

  /* New look only: the homepage opening. One photo across the page, the first slide's own words over it,
     and a "Next up" card that eventsSection fills with the nearest dated event (fillNext). */
  var ARROW = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
  function withArrow(el) { var s = d.createElement("span"); s.className = "cc-arrow"; s.innerHTML = ARROW; el.appendChild(s); return el; }
  var nextBox = null;
  function fillNext(c) {
    if (!nextBox) { return; }
    var w = c && c.when;
    if (!w) { nextBox.hidden = true; return; }
    var st = splitTitle(c.title), rsvp = c.oneOff && c.reg;
    nextBox.textContent = "";
    nextBox.setAttribute("href", rsvp ? c.reg : c.href);
    nextBox.appendChild(h("span", { "class": "cc-next__date" }, [h("span", { text: w.mon }), h("strong", { text: w.day }), h("span", { text: w.wd })]));
    nextBox.appendChild(h("span", { "class": "cc-next__body" }, [
      h("span", { "class": "cc-next__label", text: "Next up" + (w.time ? " · " + w.time : "") }),
      h("span", { "class": "cc-next__title cc-head", text: st.title }),
      withArrow(h("span", { "class": "cc-next__go", text: rsvp ? "RSVP" : "Learn more" }))
    ]));
    nextBox.hidden = false;
  }
  function topSection(slides) {
    var s = slides[0];
    if (!s) { return null; }
    var title = h("h2", { "class": "cc-top__title cc-head" }), em = CC.home.topEm, at = em ? s.title.indexOf(em) : -1;
    if (at < 0) { title.textContent = s.title; }
    else { title.appendChild(d.createTextNode(s.title.slice(0, at))); title.appendChild(h("em", { text: em })); title.appendChild(d.createTextNode(s.title.slice(at + em.length))); }
    var photos = h("div", { "class": "cc-top__photos", "aria-hidden": "true" }, [s.img ? photoLayer(s.img, "") : null]);
    nextBox = h("a", { "class": "cc-next", href: CC.eventsUrl, hidden: "hidden" });
    var sec = h("section", { "class": "cc-top", "aria-label": "Welcome" }, [
      photos,
      h("div", { "class": "cc-wrap" }, [
        h("div", { "class": "cc-top__text" }, [
          h("p", { "class": "cc-eyebrow", text: s.eyebrow || CC.home.heroEyebrow }),
          title,
          s.sub ? h("p", { "class": "cc-top__sub", text: s.sub }) : null,
          h("div", { "class": "cc-hero__ctas" }, (CC.home.topCtas || []).map(function (l, i) {
            var a = h("a", { "class": "cc-btn " + (i ? "cc-btn--ghost" : "cc-btn--light"), href: l[1], text: l[0] });
            return i ? a : withArrow(a);
          }))
        ]),
        nextBox
      ])
    ]);
    // "Hero" pictures from the photos page take the slide picture's place, changing slowly
    withPhotos(function (g) {
      var list = g && g.hero || [];
      if (!list.length) { return; }
      var box = stack("cc-top__photos", list.map(function (p) { return photoLayer(p.src, ""); }));
      box.setAttribute("aria-hidden", "true");
      sec.replaceChild(box, photos);
      if (list.length > 1 && !reduceMotion) { var i = 0; setInterval(function () { if (d.hidden) { return; } i = (i + 1) % list.length; box.show(i); }, 8000); }
    });
    return sec;
  }
  // New look only: four ways in, as a row of plain numbered links
  function waysSection() {
    var list = CC.home.ways || [];
    if (!list.length) { return null; }
    return h("nav", { "class": "cc-ways", "aria-label": "Find your way in" }, [h("ul", { "class": "cc-wrap" }, list.map(function (w, i) {
      var name = h("span", { "class": "cc-ways__name cc-head", text: w[0] });
      var arrow = d.createElement("span"); arrow.className = "cc-ways__arrow";
      arrow.innerHTML = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
      name.appendChild(arrow);
      return h("li", null, [h("a", { href: w[2] }, [h("span", { "class": "cc-ways__n", text: "0" + (i + 1) }), name, h("span", { "class": "cc-ways__line", text: w[1] })])]);
    }))]);
  }

  // New look only: the centre in four numbers, on the dark band
  function numbersSection() {
    var n = CC.home.numbers || [];
    if (!n.length) { return null; }
    var title = h("h2", { "class": "cc-h2 cc-head", id: "cc-num-h" });
    title.appendChild(d.createTextNode(CC.home.numbersTitle + " "));
    title.appendChild(h("em", { text: CC.home.numbersYear }));
    return h("section", { "class": "cc-section cc-section--ink cc-numbers", "aria-labelledby": "cc-num-h" }, [
      h("div", { "class": "cc-wrap" }, [
        title,
        h("ul", { "class": "cc-numbers__list" }, n.map(function (x) { return h("li", null, [h("strong", { text: x[0] }), h("span", { text: x[1] })]); })),
        h("div", { "class": "cc-hero__ctas" }, (CC.home.numbersLinks || []).map(function (l, i) {
          return h("a", { "class": "cc-btn " + (i ? "cc-btn--ghost" : "cc-btn--accent"), href: l[1], text: l[0] });
        }))
      ])
    ]);
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
      when = (!ev.oneOff && (ev.desc || ev.reg) ? "Next: " : "") + first.wd + ", " + first.mon + " " + first.day + (times.length ? " · " + times.join(" or ") : "");
    } else if (w) {
      when = "Starts " + w.wd + ", " + w.mon + " " + w.day;
    }
    (CC.home.whenText || []).some(function (r) { if (r.match.test(st.title)) { when = r.text; return true; } return false; });
    var ctas = [h("a", { "class": "cc-btn", href: ev.href, text: "Learn more" })];
    if (ev.reg && ev.reg !== ev.href) { ctas.push(h("a", { "class": "cc-btn cc-btn--ghost", href: ev.reg, text: "Register" })); }
    return h("article", { "class": "cc-ev cc-ev--" + tag.tone }, [
      h("div", { "class": "cc-ev__img", style: ev.img ? "background-image:url(\"" + ev.img.replace(/"/g, "%22") + "\")" + (ev.imgTop ? ";background-position:center 15%" : "") : null }, [
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
          h("div", null, [h("p", { "class": "cc-eyebrow", text: CC.home.eventsEyebrow }), h("h2", { "class": "cc-h2 cc-head", id: "cc-events-h", text: CC.home.eventsTitle }),
            // the "first class is yours to try" line is about courses, not about every event: the new look leaves it to
            // the course pages (Levi, Nov 27)
            CC.home.eventsLine && !/cc-v2/.test(html.className) ? h("p", { "class": "cc-lede", text: CC.home.eventsLine }) : null]),
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
    // the row is built before the shell is on the page (no width yet): measure again once it has one
    if (window.ResizeObserver) { new ResizeObserver(function () { upd(); }).observe(grid); }
    // Dated sessions from the native "Upcoming Events" feed on the homepage
    var sessions = qa(".upcoming_events .widget_content li", root).map(function (li) {
      // The title link sits in the heading; an icon-only .register_link may come first
      var a = q("h6 a, h5 a, h4 a, h3 a", li) || q("a:not(.register_link)", li);
      var reg = q("a.register_link", li), title = a ? txt(a) : "", when = parseWhen(txt(q("small", li)));
      if (!title || !when) { return null; }
      when.title = title; when.k = evKey(title); when.href = (reg || a).getAttribute("href"); when.reg = !!reg; when.page = a ? a.getAttribute("href") : "";
      return when;
    }).filter(Boolean);
    // An event with no picture of its own borrows the picture of the hero slide with the same name
    var slidePics = readSlides(q(".promo_slider", root) || root).map(function (s) { return { k: evKey(s.title), img: s.img }; });
    function slidePic(title) {
      var k = evKey(title);
      for (var i = 0; i < slidePics.length; i++) {
        var s = slidePics[i];
        if (s.img && s.k && k && (s.k.indexOf(k) >= 0 || k.indexOf(s.k) >= 0)) { return s.img; }
      }
      return "";
    }
    // A registration event with its own course page (CC.home.eventPages): "Learn more" opens the page,
    // "Register" the registration.
    function linkPage(c) {
      var cp = coursePage(c.reg || c.href, c.title) || coursePage(c.href, c.title);
      if (!cp || c.href === cp.page) { return c; }
      c.reg = cp.reg;
      c.href = cp.page;
      return c;
    }
    function pageNo(u) { var m = /(?:^|\/)(\d{5,})(?:[\/?#.]|$)/.exec(u || ""); return m ? m[1] : ""; }
    // Calendar items beyond the feed's first 5 (CC.home.extraEvents), until their date has passed
    function extras() {
      var t = new Date(), today = t.getFullYear() + "-" + (t.getMonth() < 9 ? "0" : "") + (t.getMonth() + 1) + "-" + (t.getDate() < 10 ? "0" : "") + t.getDate();
      return (CC.home.extraEvents || []).map(function (e) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.date || "");
        if (!m || !e.title || e.date < today) { return null; }
        var dt = new Date(+m[1], +m[2] - 1, +m[3]);
        return { title: e.title, k: evKey(e.title), href: e.href || "", page: e.href || "", reg: false, register: e.register || "", image: e.image || "", key: e.date,
          wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getDay()], mon: MONTHS[dt.getMonth()].replace(/^./, function (c) { return c.toUpperCase(); }),
          day: String(+m[3]), time: e.time || "", extra: true, first: !!e.first };
      }).filter(function (x) {
        if (!x) { return false; }
        var n = pageNo(x.page), hit = null;   // already in the feed (same name or same page): no second card,
        sessions.forEach(function (y) {       // but the feed's card takes this item's page, RSVP, picture and place
          if (y.k === x.k || (n && (pageNo(y.page) === n || pageNo(y.href) === n))) {
            hit = y;
            if (x.page) { y.page = x.page; y.href = x.page; }
            if (x.register) { y.register = x.register; }
            if (x.image) { y.image = x.image; }
            if (x.first) { y.first = true; }
            if (x.time && !y.time) { y.time = x.time; }
            y.extra = true;   // a one-off: plain date line, text from its own page
          }
        });
        return !hit;
      });
    }
    sessions = sessions.concat(extras());
    // An extra item's photo and line come from its own page (og:image / og:description), cached for an hour
    var pagePics = {}, lastCourses = null;
    sessions.forEach(function (x) {
      if (!x.extra || !x.page) { return; }
      cachedPage("cc-evpage3-" + pageNo(x.page), 3600 * 1000, x.page, function (doc) {
        function meta(p) { var m = q("meta[property='" + p + "']", doc); return m ? (m.getAttribute("content") || "").trim() : ""; }
        // The page's own first picture (the flyer), not og:image (that is the site logo); skip header/menu/footer
        var og = meta("og:image"), body = q("#co_body_container", doc) || doc.body || doc, pic = "";
        qa("img", body).some(function (im) {
          if (im.closest && im.closest("header, nav, footer, #header_branding, .site-logo-wrapper, .co_local_menu, #co_ads_container")) { return false; }
          var src = imgSrc(im);
          if (!src || src === og || /logo|icon|\.svg(\?|$)/i.test(src)) { return false; }
          pic = src; return true;
        });
        // The card's line: the page's description, else its own opening line (a card with only a title looked empty)
        var lead = q(".cc-hero__sub, .cc-lede", body) || qa("p", body).filter(function (p) { return txt(p).length > 40; })[0];
        return { img: pic || og, flyer: !!pic, desc: meta("og:description") || txt(lead) };
      }, function (v) {
        if (!v || (!v.img && !v.desc)) { return; }
        pagePics[x.k] = v;
        if (lastCourses) { render(lastCourses); }
      });
    });
    function render(courses) {
      lastCourses = courses;
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
        var pg = pagePics[x.k] || {};
        if (x.image) { pg = { img: x.image, flyer: true, desc: pg.desc }; }
        cards.push({ title: x.title, href: x.page || x.href, reg: x.register || (x.reg ? x.href : ""), desc: pg.desc || "", img: pg.img || "", imgTop: !!pg.flyer, oneOff: !!x.extra, first: !!x.first, when: x, sessions: sessions.filter(function (y) { return y.k === x.k; }) });
      });
      grid.textContent = "";
      if (!cards.length) {
        grid.appendChild(h("div", { "class": "cc-card" }, [h("h3", { text: "New classes are on the way" }), h("p", { text: "Check the full calendar or join our weekly email to hear first." })]));
        setTimeout(upd, 0);
        return;
      }
      cards.sort(function (x, y) { return x.when && y.when ? (x.when.key < y.when.key ? -1 : x.when.key > y.when.key ? 1 : 0) : (x.when ? -1 : y.when ? 1 : 0); });
      // An extra item marked first (CC.home.extraEvents) leads the row until its date (Levi, Nov 26: menorah lighting first)
      // "Next up" (new look) = the nearest date a visitor can still join: a course whose registration has closed is passed over
      var dated = cards.filter(function (c) { return c.when; });
      var soonest = dated.filter(function (c) {
        var cp = coursePage(c.reg || c.href, c.title) || coursePage(c.href, c.title);
        return !(cp && (CC.home.closedEvents || []).indexOf(cp.id) >= 0);
      })[0] || dated[0];
      cards = cards.filter(function (c) { return c.first; }).concat(cards.filter(function (c) { return !c.first; }));
      cards.slice(0, 8).forEach(function (c) { c.img = c.img || slidePic(c.title); grid.appendChild(eventCard(linkPage(c))); });
      fillNext(soonest ? linkPage(soonest) : null);   // new look: the "Next up" card in the opening
      smartQuotes(grid);   // the cards can be rebuilt after the page's own pass ran
      setTimeout(upd, 0);
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
    // New look (the approved homepage board): one word of the heading in italics, three short promises under the
    // text, and the photos in an arch at the left with small dots under it
    var v2 = /cc-v2/.test(html.className), headText = head || "There's a place for you here.", headNode = h("h2", { "class": "cc-h2 cc-head" });
    var em = v2 ? CC.home.introEm : "", at = em ? (" " + headText + " ").indexOf(" " + em + " ") : -1;
    if (at < 0) { headNode.textContent = headText; }
    else { headNode.appendChild(d.createTextNode(headText.slice(0, at))); headNode.appendChild(h("em", { text: em })); headNode.appendChild(d.createTextNode(headText.slice(at + em.length))); }
    var points = v2 ? (CC.home.introPoints || []) : [];
    // the promises stand on their own line now: a closing sentence of the text that only repeats them is left out
    if (points.length && bodyText) {
      var cut = bodyText.lastIndexOf(". ", bodyText.length - 3), lastSentence = cut > 0 ? bodyText.slice(cut + 2).toLowerCase() : "";
      if (lastSentence && points.every(function (p) { return lastSentence.indexOf(p.toLowerCase()) >= 0; })) { bodyText = bodyText.slice(0, cut + 1); }
    }
    var words = h("div", { "class": v2 ? "cc-welcome__words" : null }, [
      v2 ? null : h("p", { "class": "cc-eyebrow", text: CC.home.introEyebrow }),
      headNode,
      bodyText ? h("p", { "class": "cc-lede", text: bodyText }) : null,
      points.length ? h("ul", { "class": "cc-welcome__points" }, points.map(function (t) { return h("li", { "class": "cc-head", text: t }); })) : null,
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
      var dots = v2 && list.length > 1 ? h("div", { "class": "cc-welcome__dots", "aria-hidden": "true" }, list.map(function (p, j) { return h("span", { "class": j ? null : "is-on" }); })) : null;
      wrap.appendChild(v2 ? h("div", { "class": "cc-welcome__media" }, [box, dots]) : box);
      // a calm change every 6 seconds (3 was restless beside the text); it waits while the mouse is on the photo
      // or the browser tab is in the background
      if (list.length > 1 && !reduceMotion) {
        var i = 0, held = false;
        box.addEventListener("mouseenter", function () { held = true; });
        box.addEventListener("mouseleave", function () { held = false; });
        setInterval(function () {
          if (held || d.hidden) { return; }
          i = (i + 1) % list.length; box.show(i);
          if (dots) { qa("span", dots).forEach(function (s, j) { s.className = j === i ? "is-on" : ""; }); }
        }, 6000);
      }
    });
    return sec;
  }

  // A slow sideways strip of real photos (the "Strip" pictures on the photos page)
  function stripSection() {
    if (!CC.photosUrl) { return null; }
    var sec = h("section", { "class": "cc-strip", "aria-label": "Photos from our community" });
    withPhotos(function (g) {
      var list = g && g.strip || [];
      if (list.length < 4) { sec.hidden = true; if (sec.parentNode) { sec.parentNode.removeChild(sec); } return; }
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
      // "Learn more" never opens a registration form (Levi, Nov 17): a card that links to a course's
      // registration goes to that course's page instead (CC.home.eventPages)
      var href = a.getAttribute("href") || "", cp = /\/tools\/events\/register/i.test(href) ? coursePage(href, "") : null;
      if (cp && cp.page) { href = cp.page; }
      return h("a", { "class": "cc-program", href: href }, [
        h("div", { "class": "cc-program__img", style: th ? "background-image:url('" + bgUrl(th).replace(/'/g, "%27") + "')" : null }),
        h("div", { "class": "cc-program__label" }, [h("h3", { "class": "cc-program__title cc-head", text: txt(a) }), h("span", { "class": "cc-program__more", text: "Learn more →" })])
      ]);
    }).filter(Boolean).slice(0, CC.home.programsMax);
    if (!cards.length) { return null; }
    // ChabadOne shrinks Programs pictures to 350px; full-size ones under a "Cards" heading on the
    // photos page replace them, in order
    withPhotos(function (g) {
      (g && g.cards || []).forEach(function (p, i) {
        var im = cards[i] && q(".cc-program__img", cards[i]);
        if (im) { im.style.backgroundImage = "url(\"" + String(p.src).replace(/"/g, "%22") + "\")"; }
      });
    });
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

  /* Newsletter and donate side by side, the same size and weight (Levi, Nov 16: "make sure they're balanced"):
     the same eyebrow, heading and text sizes in both, the form and the buttons along one bottom line,
     and the donate photo showing through instead of an empty maroon box. */
  function pairSection(root) {
    var p = CC.home.partner, s = q(".hp_subscribe .subscribe, .widget-4.subscribe", root);
    if (!s || !p) { return s ? subscribeSection(root) : partnerSection(); }
    var news = h("div", { "class": "cc-pair__panel cc-pair__news" }, [
      CC.home.subscribeEyebrow ? h("p", { "class": "cc-eyebrow", text: CC.home.subscribeEyebrow }) : null,
      h("h2", { "class": "cc-h2 cc-head", id: "cc-sub-h", text: CC.home.subscribeTitle }),
      h("p", { "class": "cc-lede", text: CC.home.subscribeText }),
      h("div", { "class": "cc-subscribe__form cc-pair__action" })
    ]);
    q(".cc-subscribe__form", news).appendChild(s);
    var give = h("div", { "class": "cc-pair__panel cc-pair__give" }, [
      p.eyebrow ? h("p", { "class": "cc-eyebrow", text: p.eyebrow }) : null,
      h("h2", { "class": "cc-h2 cc-head", id: "cc-partner-h", text: p.title }),
      h("p", { "class": "cc-lede", text: p.text }),
      h("div", { "class": "cc-pair__action cc-pair__ctas" }, [
        h("a", { "class": "cc-btn cc-btn--accent", href: CC.donateUrl, text: p.donate }),
        p.dedicate ? h("a", { "class": "cc-btn cc-btn--ghost", href: p.dedicateHref, text: p.dedicate }) : null
      ])
    ]);
    function setBg(src) {
      if (!src) { return; }
      addClass(give, "cc-pair__give--photo");
      give.style.setProperty("--cc-partner-img", "url(\"" + String(src).replace(/"/g, "%22") + "\")");
    }
    setBg(p.image);
    withPhotos(function (g) { if (g && g.donate.length) { setBg(g.donate[0].src); } });
    return h("section", { "class": "cc-section cc-subscribe cc-pair", "aria-label": "Email updates and donations" }, [
      h("div", { "class": "cc-wrap" }, [h("div", { "class": "cc-pair__grid" }, [news, give])])
    ]);
  }

  function homeShell() {
    if (!q(".hp-table") && /\bcc-home-wait\b/.test(html.className)) { addClass(html, "cc-shell-failed"); }
    // Detect the homepage by its widget table, NOT by body.home: ChabadOne adds that class
    // late with its own script, so checking it caused random fall-backs to the native homepage.
    var hp = q(".hp-table");
    if (!hp || q("#cc-home")) { return; }
    addClass(html, "cc-home-page");
    var shell = h("div", { id: "cc-home" }, [h("h1", { "class": "cc-sr", text: CC.org })]);
    var build = {
      hero: function () { return heroSection(readSlides(q(".promo_slider", hp) || hp)); },
      quick: function () { return quickSection(hp); },
      intro: function () { return introSection(hp); },
      strip: stripSection,
      events: function () { return eventsSection(hp); },
      programs: function () { return programsSection(hp); },
      testimonials: function () { return testimonialsSection(); },
      numbers: numbersSection,
      top: function () { return topSection(readSlides(q(".promo_slider", hp) || hp)); },
      ways: waysSection,
      partner: partnerSection,
      subscribe: function () { return subscribeSection(hp); },
      pair: function () { return pairSection(hp); }
    };
    var order = /cc-v2/.test(html.className) && CC.home.sectionsNext ? CC.home.sectionsNext : CC.home.sections;
    order.forEach(function (k) { var s = build[k] && build[k](); if (s) { shell.appendChild(s); } });
    var heroWrap = CC.home.bh && q(".cc-hero .cc-wrap, .cc-top .cc-wrap", shell);
    if (heroWrap) {
      if (CC.bhFont && !q("link[data-cc-bh-font]")) { d.head.appendChild(h("link", { rel: "stylesheet", href: CC.bhFont, "data-cc-bh-font": "1" })); }
      heroWrap.appendChild(h("span", { "class": "cc-bh", lang: "he", "aria-hidden": "true", text: CC.home.bh }));
    }
    hp.parentNode.insertBefore(shell, hp);
    // New look: the opening photo runs up under the header, so the styles need the header's height
    if (/cc-v2/.test(html.className) && q(".cc-top", shell)) {
      var hd = q("#header"), setH = function () { if (hd) { html.style.setProperty("--cc-hdr-h", hd.offsetHeight + "px"); } };
      setH(); window.addEventListener("resize", setH); window.addEventListener("load", setH);
    }
    addClass(hp, "cc-native-parked");
    // The parked widgets sit off-screen (the shell reads them); keep their ~40 links (sample items,
    // Chabad.org articles) away from the keyboard and screen readers
    hp.setAttribute("aria-hidden", "true");
    hp.inert = true;
    addClass(html, "cc-shell-ready");
  }

  /* ---------- Landing pages ----------
     A ChabadOne web document whose body is one <div class="cc-landing"> (the CSS does the layout).
     Quotes typed as blockquotes inside .cc-quotes become a rotator; a photo strip's single row gets
     the copy that lets it loop. */
  function landingPage() {
    var root = q(".cc-landing");
    if (!root) { return; }
    addClass(html, "cc-landing-page");
    qa(".cc-quotes", root).forEach(function (box) {
      var items = parseTestimonials(box);
      if (!items.length) { return; }
      loadQuoteFont();
      qa("blockquote", box).forEach(function (bq) { bq.parentNode.removeChild(bq); });
      var rot = quoteRotator(items);
      var wrap = q(".cc-wrap", box) || box;
      [h("span", { "class": "cc-tm__mark", "aria-hidden": "true", text: "“" }), rot.figure, rot.nav].forEach(function (n) { if (n) { wrap.appendChild(n); } });
      rot.show(0);
    });
    qa(".cc-strip__track", root).forEach(function (track) {
      var rows = qa(".cc-strip__row", track);
      if (rows.length !== 1) { return; }
      var copy = rows[0].cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      qa("img", copy).forEach(function (im) { im.setAttribute("alt", ""); });
      track.appendChild(copy);
    });
  }

  /* ---------- Course library (any page with a .cc-library block) ----------
     Page markup: links in .cc-chips (href "#all" or "#<tag>") filter the .cc-course cards by their
     cc-tag-<tag> class; each card's .cc-course__open link opens a pop-up with the card's cover,
     season, title, description, recording link and its hidden .cc-course__more (lessons).
     A link to #<card id> opens that course straight away. */
  function courseLibrary() {
    qa(".cc-library").forEach(function (lib) {
      var cards = qa(".cc-course", lib), chips = qa(".cc-chips a", lib);
      if (!cards.length) { return; }
      function filter(tag) {
        chips.forEach(function (a) { a.setAttribute("aria-pressed", (a.getAttribute("href") || "") === "#" + tag ? "true" : "false"); });
        cards.forEach(function (c) { c.hidden = !(tag === "all" || (" " + c.className + " ").indexOf(" cc-tag-" + tag + " ") >= 0); });
      }
      chips.forEach(function (a) {
        a.setAttribute("role", "button");
        a.addEventListener("click", function (ev) { ev.preventDefault(); filter((a.getAttribute("href") || "#all").slice(1)); });
        // a link acting as a button also answers the Space bar
        a.addEventListener("keydown", function (ev) { if (ev.key === " " || ev.key === "Spacebar") { ev.preventDefault(); a.click(); } });
      });
      if (chips.length) { filter("all"); }

      var body = h("div", { "class": "cc-dialog__body" });
      var close = h("button", { type: "button", "class": "cc-dialog__x", "aria-label": "Close", text: "×" });
      var dlg = h("dialog", { "class": "cc-dialog", "aria-label": "Course details" }, [close, body]);
      d.body.appendChild(dlg);
      if (typeof dlg.showModal !== "function") { return; } // very old browsers: cards stay plain links
      close.addEventListener("click", function () { dlg.close(); });
      // close on a click in the dimmed backdrop only (not on the card's own padding, or after selecting text)
      dlg.addEventListener("click", function (ev) {
        if (ev.target !== dlg) { return; }
        var r = dlg.getBoundingClientRect();
        if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) { dlg.close(); }
      });
      dlg.addEventListener("close", function () { if (history.replaceState && /^#c-/.test(location.hash)) { history.replaceState(null, "", location.pathname + location.search); } });
      function open(card) {
        body.textContent = "";
        var cover = q(".cc-course__cover", card);
        if (cover) {
          var fig = cover.cloneNode(true); fig.className = "cc-dialog__cover";
          // the pop-up is wide: let a srcset pick its large file, and load it now
          qa("img", fig).forEach(function (im) { im.removeAttribute("loading"); if (im.getAttribute("srcset")) { im.setAttribute("sizes", "(max-width: 700px) 100vw, 640px"); } });
          body.appendChild(fig);
        }
        var when = q(".cc-course__when", card), title = q(".cc-course__title", card), desc = q(".cc-course__desc", card);
        if (when) { body.appendChild(h("p", { "class": "cc-eyebrow", text: txt(when) })); }
        body.appendChild(h("h2", { "class": "cc-h2 cc-head", text: txt(title) }));
        // recording button right under the title (Levi, Nov 14: no scrolling to find it).
        // ChabadOne's save can split one link into two ("Listen" + " on the podcast"), so rejoin by href.
        var recs = qa(".cc-course__foot a", card);
        if (recs.length) {
          var href = recs[0].getAttribute("href");
          var label = recs.filter(function (a) { return a.getAttribute("href") === href; }).map(txt).join(" ").replace(/\s+/g, " ").trim();
          body.appendChild(h("p", { "class": "cc-dialog__cta" }, [h("a", { "class": "cc-btn", href: href, target: "_blank", rel: "noopener", text: label })]));
        }
        if (desc) { body.appendChild(h("p", { "class": "cc-lede", text: txt(desc) })); }
        var more = q(".cc-course__more", card);
        if (more) { qa(":scope > *", more).forEach(function (n) { body.appendChild(n.cloneNode(true)); }); }
        dlg.showModal();
        if (card.id && history.replaceState) { history.replaceState(null, "", "#" + card.id); }
      }
      cards.forEach(function (card) {
        var o = q(".cc-course__open", card);
        if (o) { o.addEventListener("click", function (ev) { ev.preventDefault(); open(card); }); }
      });
      if (/^#c-/.test(location.hash)) {
        var hit = d.getElementById(location.hash.slice(1));
        if (hit && lib.contains(hit)) { open(hit); }
      }
    });
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

  /* ---------- Registration: cap the number of registrants (CC.regMaxAttendees) ----------
     Runs on any event registration layout (not only #RegisterSinglePage). ChabadOne refills the
     number list when the category changes, so it is cut again after every change and just before it opens. */
  function registrationCap() {
    if (!/\/tools\/events\//i.test(location.pathname) && !/eventid/i.test(location.href) && !q("[id$='_priceCategory'], #RegisterSinglePage")) { return; }
    var map = CC.regMaxAttendees || {}, id = "", m = /eventid[=\/](\d+)/i.exec(location.href);
    if (m) { id = m[1]; }
    if (!id) {
      var inp = q("input[name='eventid' i], input[id='eventid' i], input[name='EventID']");
      id = inp ? String(inp.value || "").trim() : "";
    }
    if (!id) {   // ChabadOne's own script names the saved progress "Event_<id>_StoredProgress"
      m = /Event_(\d+)_StoredProgress/.exec(d.documentElement.innerHTML) || /eventid\W{0,3}(\d{4,7})/i.exec(d.documentElement.innerHTML);
      id = m ? m[1] : "";
    }
    var max = +(map[id] || 0);
    // A number list 1..N (10+ numbers, nothing else) also counts, whatever its id; dates and ages never do
    function numberList(sel) {
      var n = 0, low = 99;
      for (var i = 0; i < sel.options.length; i++) {
        var v = String(sel.options[i].value).trim();
        if (v === "" || v === "0") { continue; }
        if (!/^\d+$/.test(v)) { return false; }
        n++; low = Math.min(low, +v);
      }
      return n >= 10 && low <= 1;
    }
    function isQty(sel) {
      var key = (sel.id || "") + " " + (sel.name || "") + " " + (sel.className || "");
      if (/category|day|month|year|age|date|birth|hour|minute|time/i.test(key)) { return false; }
      return /quantity|attendee|qty|ticket/i.test(key) || numberList(sel);
    }
    // Info box for checking a real page: add ?ccdebug (or #ccdebug) to the address
    if (/ccdebug/i.test(location.search + location.hash)) {
      var box = h("pre", { style: "position:fixed;left:8px;bottom:8px;z-index:99999;max-width:94vw;max-height:45vh;overflow:auto;background:#fff;color:#000;border:2px solid #c00;padding:8px;font:12px/1.4 monospace;white-space:pre-wrap;user-select:text" });
      var show = function () {
        var lines = ["theme test " + (window.ccMode || "") + " | eventid " + (id || "?") + " | max " + (max || "none")];
        qa("select").forEach(function (sel, i) {
          var o = sel.options, f = o.length ? o[0].value : "", l = o.length ? o[o.length - 1].value : "";
          lines.push(i + ": id=" + (sel.id || "-") + " name=" + (sel.name || "-") + " opts=" + o.length + " [" + f + ".." + l + "] seen=" + (sel.offsetParent ? "y" : "n") + " capped=" + (sel.getAttribute("data-cc-capped") ? "y" : "n"));
        });
        var widgets = qa("[role=listbox], .select2, .chosen-container, .nice-select, .selectric, .dropdown-menu, .custom-select").length;
        lines.push("custom dropdowns: " + widgets);
        box.textContent = lines.join("\n");
      };
      d.body.appendChild(box); show();
      d.addEventListener("change", function () { setTimeout(show, 400); }, true);
      setTimeout(show, 2000);
    }
    var mins = CC.regMinByCategory || [];
    if (!max && !mins.length) { return; }
    // The price category list that belongs to a quantity list (same id prefix), and its least number
    function minFor(sel) {
      var pre = String(sel.id || "").replace(/quantit[\s\S]*$/i, ""), cat = null;
      qa("select").some(function (s) { if (s !== sel && /categor/i.test(s.id || s.name || "") && String(s.id || "").indexOf(pre) === 0) { cat = s; return true; } return false; });
      var o = cat && cat.selectedIndex >= 0 ? cat.options[cat.selectedIndex] : null, t = o ? o.text : "", low = 0;
      mins.some(function (r) { if (r.match.test(t)) { low = r.min; return true; } return false; });
      return low;
    }
    function cap(sel) {
      if (!sel || sel.tagName !== "SELECT" || !isQty(sel)) { return; }
      var low = minFor(sel), cut = false, raise = false;
      for (var i = sel.options.length - 1; i >= 0; i--) {
        var v = parseInt(sel.options[i].value, 10);
        if (max && v > max) { if (sel.options[i].selected) { cut = true; } sel.remove(i); sel.setAttribute("data-cc-capped", "1"); }
        else if (low && v > 0 && v < low && sel.options.length > 1) { if (sel.options[i].selected) { raise = true; } sel.remove(i); sel.setAttribute("data-cc-capped", "1"); }
      }
      if (cut) { sel.value = String(max); }
      if (raise || (low && parseInt(sel.value, 10) < low)) { sel.value = String(low); }
      if (cut || raise) { sel.dispatchEvent(new Event("change", { bubbles: true })); }
    }
    function capAll() { qa("select").forEach(cap); }
    capAll();
    d.addEventListener("change", function () { setTimeout(capAll, 0); setTimeout(capAll, 300); }, true);
    ["focus", "mousedown", "touchstart", "keydown"].forEach(function (t) {
      d.addEventListener(t, function (e) { cap(e.target); }, true);
    });
    if (window.MutationObserver) {
      var busy = false;
      new MutationObserver(function () { if (busy) { return; } busy = true; capAll(); busy = false; }).observe(d.body, { childList: true, subtree: true });
    }
  }

  /* ---------- "#rsvp" on any page: jump to the page's RSVP / sign-up form ----------
     Lets a button link to "<page>#rsvp" without editing the page (homepage event cards use it). */
  function rsvpJump() {
    if (!/^#rsvp$/i.test(location.hash) || d.getElementById("rsvp")) { return; }
    var done = false;
    function find() {
      var body = q("#co_body_container") || d.body;
      var named = qa("[id*='rsvp' i], [name*='rsvp' i]", body)[0];
      if (named) { return named; }
      return qa(".embedded_form, form, iframe", body).filter(function (n) {
        return !(n.closest && n.closest("header, nav, footer, #header_branding, .co_local_menu, #co_ads_container")) && !/search/i.test((n.id || "") + (n.className || "") + (n.getAttribute("action") || ""));
      })[0];
    }
    function go() {
      var t = find();
      if (!t) { return; }
      if (!done) { t.id = t.id || "rsvp"; t.style.scrollMarginTop = "110px"; done = true; }
      t.scrollIntoView({ block: "start" });
    }
    go();
    if (!done) { setTimeout(go, 1200); }
    window.addEventListener("load", function () { setTimeout(go, 50); });
  }

  /* ---------- "Page not found" (ChabadOne's own page, .notfound-container) ----------
     An old Wix address listed in CC.oldPaths goes straight to its new page. Otherwise the page gets the
     site's sections as buttons (read from the menu), and its search field and button get names. */
  // The page of a course whose registration has closed (CC.home.closedEvents + eventPages): mark it, and the
  // theme's CSS drops its Register buttons. JLI's minisite draws its buttons after this script runs, so the
  // hiding is done in CSS, not here (Levi, Nov 26: the Kabbalah page's Register opened the Missing Piece form).
  function closedCourse() {
    var home = CC.home || {}, pages = home.eventPages || {};
    var hit = (home.closedEvents || []).some(function (id) {
      var p = String(pages[id] || "").replace(/^\//, "");
      return !!p && new RegExp("(^|/)" + p + "(/|$)").test(location.pathname);
    });
    if (hit) { addClass(html, "cc-course-closed"); }
  }

  /* ChabadOne's own Event Reservations list keeps a Register button on an event whose registration has closed
     (checked Nov 27: the Kabbalah event's "Purchase Tickets By" date had passed and its own page said "Reservations
     for this event segment is closed", yet the list still offered Register; no event setting removes it). For the
     events in CC.home.closedEvents the button gives way to a plain note, and the title opens the course page. */
  function eventsListClosed() {
    var home = CC.home || {}, closed = home.closedEvents || [], pages = home.eventPages || {};
    if (!closed.length) { return; }
    qa(".event").forEach(function (ev) {
      var inp = q("form input[name='eventid']", ev), id = inp ? String(inp.value) : "";
      if (closed.indexOf(id) < 0) { return; }
      var form = inp.form || q("form", ev);
      if (!form || form.getAttribute("data-cc-closed")) { return; }
      form.setAttribute("data-cc-closed", "1");
      form.style.setProperty("display", "none", "important");
      form.parentNode.insertBefore(h("p", { "class": "cc-ev-closed" }, [
        h("span", { text: "Registration has closed." }),
        pages[id] ? h("a", { "class": "cc-link", href: pages[id], text: "About this course" }) : null
      ]), form);
      var t = q("h2 a", ev);
      if (t && pages[id]) { t.setAttribute("href", pages[id]); }
    });
  }

  function notFound() {
    var box = q(".notfound-main-content");
    if (!box) { return; }
    var to = (CC.oldPaths || {})[location.pathname.replace(/\/+$/, "").toLowerCase()];
    if (to) { location.replace(to); return; }
    var sb = q(".notfound-search-form button", box), si = q(".notfound-search-input", box);
    if (sb && !sb.getAttribute("aria-label")) { sb.setAttribute("aria-label", "Search"); }
    if (si && !si.getAttribute("aria-label")) { si.setAttribute("aria-label", "Search this site"); }
    if (q(".cc-notfound-links", box)) { return; }
    // The current courses first. ChabadOne sends a deleted page's address to /tools/404.htm and drops the
    // address that was asked for, so the two old JLI course addresses (in emails and flyers already sent)
    // cannot be forwarded: the next best thing is to offer the course pages right here.
    var courses = ((CC.courseNext || {}).list || []).map(function (c) {
      return h("a", { "class": "cc-btn cc-btn--ghost", href: "/" + c[0], text: c[1] });
    });
    if (courses.length) {
      box.appendChild(h("p", { "class": "cc-notfound-label", text: "Looking for a course?" }));
      box.appendChild(h("nav", { "class": "cc-notfound-links cc-notfound-links--courses", "aria-label": "Courses" }, courses));
      box.appendChild(h("p", { "class": "cc-notfound-label", text: "Or start from a main page" }));
    }
    var links = qa("#tabContentMain > .co_menu_item:not(.home):not(.donate_link) > span.parent a").map(function (a) {
      return h("a", { "class": "cc-btn cc-btn--ghost", href: a.getAttribute("href"), text: txt(a) });
    });
    if (links.length) { box.appendChild(h("nav", { "class": "cc-notfound-links", "aria-label": "Main pages" }, links)); }
  }

  /* ---------- Newsletter page (/tools/subscribe): the main list starts ticked (CC.subscribeDefaultList) ---------- */
  function subscribePage() {
    var f = q("form[name='subscribe']");
    if (!f || !CC.subscribeDefaultList) { return; }
    var boxes = qa("input[type='checkbox'][name='subscriptions']", f);
    if (!boxes.length || boxes.some(function (b) { return b.checked; })) { return; }
    boxes.forEach(function (b) { if (b.value === CC.subscribeDefaultList) { b.checked = true; } });
  }

  /* ---------- Browser-tab icon: the official favicon from the chabadbrand.com brand kit ----------
     ChabadOne uses the whole site logo (emblem + words) as the icon, unreadable at tab size. Ours is a square
     favicon (kit 04. Social/favicon.svg, default colors), kept in data/brand/ (Levi, Nov 20). */
  function favicon() {
    var base = "https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/data/brand/";
    qa("link[rel~='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']").forEach(function (l) { l.parentNode.removeChild(l); });
    [["icon", "image/svg+xml", "favicon.svg", ""], ["icon", "image/png", "favicon-32.png", "32x32"], ["icon", "image/png", "favicon-192.png", "192x192"],
     ["apple-touch-icon", "", "favicon-180.png", "180x180"]].forEach(function (f) {
      var l = d.createElement("link"); l.rel = f[0]; if (f[1]) { l.type = f[1]; } if (f[3]) { l.setAttribute("sizes", f[3]); } l.href = base + f[2];
      d.head.appendChild(l);
    });
  }

  /* ---------- New look only: the course page, one template for every course (Levi, Nov 27: "you can now build
     the course template") ----------
     Every course is drawn from one entry in course-pages.json (src/course-pages.json, built beside this script):
     opening (course art, title in the site's heading font), floating course bar with Register, About + facts card,
     lessons list, teacher, Good to know, closing Register band. Only the words, the pictures and a few colors
     taken from the course art change from course to course.
     Where it shows (new look, html.cc-v2): on a course's own page (CC.courseNext.pages), in place of the
     page's body; and on the Learn page with "?course=<name>" in the address. Two courses used to live on JLI
     mini-site pages without the site's header and menu; each now has an ordinary page (CC.courseNext.moved),
     and the old addresses and links to them lead to the new page. */
  function coursePageId() {
    var p = /\/aid\/(\d+)\//.exec(location.pathname) || /^\/(\d+)\/?$/.exec(location.pathname);
    return p ? p[1] : "";
  }
  function courseSlug() {
    var cfg = CC.courseNext || {}, m = /[?&\/]course[=\/]([a-z0-9-]+)(?=[\/&#.]|$)/i.exec(location.pathname + location.search);
    if (m) { return m[1].toLowerCase(); }
    var id = coursePageId();
    return (cfg.pages || {})[(cfg.moved || {})[id] || id] || "";
  }
  function courseHref(slug) {
    var cfg = CC.courseNext || {}, id = "";
    Object.keys(cfg.pages || {}).forEach(function (k) { if (cfg.pages[k] === slug) { id = k; } });
    return id ? "/" + id : cfg.host + "?course=" + slug;
  }
  function buildCourse(c) {
    var open = c.state !== "closed", col = c.colors || {}, vars = [];
    Object.keys(col).forEach(function (k) { if (/^#[0-9a-f]{3,8}$/i.test(col[k])) { vars.push("--cp-" + k.replace(/[A-Z]/g, function (x) { return "-" + x.toLowerCase(); }) + ":" + col[k]); } });
    function titleNode(tag, cls, text, em) {
      var n = h(tag, { "class": cls + " cc-head" }), at = em ? text.lastIndexOf(em) : -1;
      if (at < 0) { n.textContent = text; }
      else { n.appendChild(d.createTextNode(text.slice(0, at))); n.appendChild(h("em", { text: em })); n.appendChild(d.createTextNode(text.slice(at + em.length))); }
      return n;
    }
    function regBtn(cls) { return withArrow(h("a", { "class": "cc-btn cc-cp__btn " + (cls || ""), href: c.register, text: "Register" })); }
    function nextBtn(cls) { return c.next ? withArrow(h("a", { "class": "cc-btn cc-cp__btn " + (cls || ""), href: courseHref(c.next.course), text: c.next.text })) : null; }
    var lessonsId = "cc-cp-lessons", lessonsWord = "See the " + String(c.lessonsTitle || "lessons").toLowerCase();
    var toLessons = h("a", { "class": "cc-btn cc-cp__btn", href: "#" + lessonsId, text: lessonsWord });
    toLessons.addEventListener("click", function (e) {
      var t = d.getElementById(lessonsId);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
    });
    var play = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
    var trailerBtn = null;
    if (c.trailer) {
      trailerBtn = h("a", { "class": "cc-btn cc-cp__btn cc-cp__btn--line", href: c.trailer, target: "_blank", rel: "noopener" });
      trailerBtn.innerHTML = play; trailerBtn.appendChild(d.createTextNode("Watch the trailer"));
    }
    // opening: Register first while enrolling; a closed course leads with its lessons
    var first = open && c.register ? regBtn("cc-cp__btn--main") : toLessons, second = trailerBtn || (first === toLessons ? null : toLessons);
    addClass(first, "cc-cp__btn--main"); if (second && second !== trailerBtn) { addClass(second, "cc-cp__btn--line"); }
    var words = h("div", { "class": "cc-cp__words" }, [
      c.eyebrow ? h("p", { "class": "cc-cp__eyebrow", text: c.eyebrow }) : null,
      titleNode("h1", "cc-cp__title", c.title, c.em),
      c.lead ? h("p", { "class": "cc-cp__lead", text: c.lead }) : null,
      h("div", { "class": "cc-cp__ctas" }, [first, second]),
      c.note ? h("p", { "class": "cc-cp__note", text: c.note }) : null
    ]);
    var artImg = c.art ? h("img", { src: c.art, alt: c.artAlt || "", style: c.artPos ? "object-position:" + c.artPos : null }) : null;
    var banner = c.opening === "banner";
    // a faint line pattern taken from the course's own graphics (hexagons for The Missing Piece) behind the words
    var lines = (c.pattern || []).filter(function (p) { return /^[MmLlHhVvZz0-9 .,-]+$/.test(p); });
    if (lines.length && !banner) {
      var pat = h("span", { "class": "cc-cp__pattern", "aria-hidden": "true" });
      pat.innerHTML = '<svg viewBox="0 0 680 660" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" stroke-width="1.5">' + lines.map(function (p) { return '<path d="' + p + '"/>'; }).join("") + "</svg>";
      words.insertBefore(pat, words.firstChild);
    }
    var top = h("header", { "class": "cc-cp__top cc-cp__top--" + (banner ? "banner" : "split") }, banner ? [
      c.banner ? h("img", { "class": "cc-cp__backdrop", src: c.banner, alt: "" }) : null,
      h("div", { "class": "cc-wrap" }, [words, artImg ? h("div", { "class": "cc-cp__art" }, [artImg]) : null])
    ] : [artImg ? h("div", { "class": "cc-cp__art" }, [artImg]) : null, words]);

    // the floating course bar: name, when and where, price, and the one button that matters now
    var barBtn = open && c.register ? regBtn("cc-cp__btn--bar") : nextBtn("cc-cp__btn--bar");
    var bar = h("div", { "class": "cc-cp__barwrap" }, [h("div", { "class": "cc-cp__bar" }, [
      h("div", { "class": "cc-cp__bar-text" }, [h("span", { "class": "cc-cp__bar-name cc-head", text: c.title }), c.bar ? h("span", { "class": "cc-cp__bar-when", text: c.bar }) : null]),
      h("div", { "class": "cc-cp__bar-act" }, [
        c.price ? h("span", { "class": "cc-cp__bar-price", text: c.price }) : null,
        c.priceShort ? h("span", { "class": "cc-cp__bar-short" }, [h("strong", { "class": "cc-head", text: c.priceShort[0] }), c.priceShort[1] ? h("span", { text: c.priceShort[1] }) : null]) : null,
        barBtn
      ])
    ])]);

    var about = c.about || {}, trailerBox = null;
    if (c.trailer) {
      trailerBox = h("a", { "class": "cc-cp__trailer", href: c.trailer, target: "_blank", rel: "noopener", "aria-label": "Play the course trailer" }, [
        c.art ? h("img", { src: c.art, alt: "" }) : null, h("span", { "class": "cc-cp__trailer-play" }), h("span", { "class": "cc-cp__trailer-word", text: "Watch the course trailer" })]);
      q(".cc-cp__trailer-play", trailerBox).innerHTML = play;
    }
    var facts = h("aside", { "class": "cc-cp__facts", "aria-label": "At a glance" }, (c.facts || []).map(function (f) {
      return h("div", { "class": "cc-cp__fact" }, [h("span", { "class": "cc-cp__fact-k", text: f[0] }), h("span", { "class": "cc-cp__fact-v cc-head", text: f[1] }), f[2] ? h("span", { "class": "cc-cp__fact-n", text: f[2] }) : null]);
    }).concat(open && c.register ? [regBtn("cc-cp__btn--facts"), h("a", { "class": "cc-cp__ask", href: CC.contactPageUrl, text: "A question first? Get in touch" })] : []));
    var main = h("div", { "class": "cc-wrap cc-cp__main" }, [
      h("section", { "class": "cc-cp__about", "aria-labelledby": "cc-cp-about" }, [
        h("h2", { "class": "cc-cp__eyebrow", id: "cc-cp-about", text: "About the course" }),
        about.lead ? h("p", { "class": "cc-cp__about-lead cc-head", text: about.lead }) : null
      ].concat((about.text || []).map(function (t) { return h("p", { "class": "cc-cp__about-text", text: t }); })).concat([trailerBox])),
      facts
    ]);

    var lessons = (c.lessons || []).length ? h("section", { "class": "cc-cp__lessons" + (c.colors && c.colors.paper ? " cc-cp__lessons--paper" : "") + (c.lessonsBlend ? " cc-cp__lessons--blend" : "") + (c.lessonsZoom ? " cc-cp__lessons--zoom" : "") + (c.lessonsShape === "hex" ? " cc-cp__lessons--hex" : ""), id: lessonsId, "aria-labelledby": "cc-cp-les" }, [h("div", { "class": "cc-wrap" }, [
      h("h2", { "class": "cc-cp__h2 cc-head", id: "cc-cp-les", text: c.lessonsTitle || "Lessons" }),
      h("ol", { "class": "cc-cp__list" }, c.lessons.map(function (l, i) {
        return h("li", null, [
          l.img ? h("img", { "class": "cc-cp__pic", src: l.img, alt: "", loading: "lazy", width: "104", height: "104" }) : h("span", { "class": "cc-cp__num cc-head", "aria-hidden": "true", text: String(i + 1) }),
          h("div", null, [
            h("span", { "class": "cc-cp__les-k", text: "Lesson " + (i + 1) + (l.when ? " · " + l.when : "") }),
            h("h3", { "class": "cc-cp__les-t cc-head", text: l.title }),
            l.text ? h("p", { "class": "cc-cp__les-p", text: l.text }) : null
          ])
        ]);
      }))
    ])]) : null;

    var tc = c.teacher, teacher = tc ? h("section", { "class": "cc-cp__teacher", "aria-labelledby": "cc-cp-who" }, [h("div", { "class": "cc-wrap" }, [
      tc.photo ? h("div", { "class": "cc-cp__teacher-pic" }, [h("img", { src: tc.photo, alt: tc.photoAlt || "", loading: "lazy" })]) : null,
      h("div", { "class": "cc-cp__teacher-words" }, [
        h("p", { "class": "cc-cp__eyebrow", text: "Your teacher" }),
        h("h2", { "class": "cc-cp__h2 cc-head", id: "cc-cp-who", text: tc.name }),
        tc.text ? h("p", { "class": "cc-cp__teacher-text", text: tc.text }) : null,
        (tc.stats || []).length ? h("ul", { "class": "cc-cp__stats" }, tc.stats.map(function (s) { return h("li", null, [h("strong", { "class": "cc-head", text: s[0] }), h("span", { text: s[1] })]); })) : null
      ])
    ])]) : null;

    var faq = (c.faq || []).length ? h("section", { "class": "cc-cp__faq", "aria-labelledby": "cc-cp-faq" }, [h("div", { "class": "cc-wrap" }, [
      h("h2", { "class": "cc-cp__h2 cc-head", id: "cc-cp-faq", text: "Good to know" }),
      h("div", { "class": "cc-cp__cards" }, c.faq.map(function (f) { return h("div", { "class": "cc-cp__card" }, [h("h3", { "class": "cc-head", text: f[0] }), h("p", { text: f[1] })]); }))
    ])]) : null;

    var cl = c.closing, close = cl ? h("section", { "class": "cc-cp__close", "aria-labelledby": "cc-cp-reg" }, [
      c.art ? h("div", { "class": "cc-cp__close-art" }, [h("img", { src: c.art, alt: "", loading: "lazy", style: c.artPos ? "object-position:" + c.artPos : null })]) : null,
      h("div", { "class": "cc-cp__close-body" }, [
        h("div", { "class": "cc-cp__close-words" }, [titleNode("h2", "cc-cp__close-title", cl.title + " " + cl.em, cl.em), cl.text ? h("p", { text: cl.text }) : null]),
        h("div", { "class": "cc-cp__close-act" }, [
          (cl.prices || []).length ? h("div", { "class": "cc-cp__prices" }, cl.prices.map(function (p) { return h("div", null, [h("span", { text: p[0] }), h("strong", { "class": "cc-head", text: p[1] })]); })) : null,
          open && c.register ? regBtn("cc-cp__btn--close") : nextBtn("cc-cp__btn--close"),
          cl.ask ? h("a", { "class": "cc-btn cc-cp__btn cc-cp__btn--closeline", href: CC.contactPageUrl, text: cl.ask }) : null
        ])
      ])
    ]) : null;
    var closeH = close && q(".cc-cp__close-title", close);
    if (closeH) { closeH.setAttribute("id", "cc-cp-reg"); }

    return h("div", { "class": "cc-landing cc-cp cc-cp--" + (open ? "open" : "closed"), style: vars.join(";") }, [top, bar, main, lessons, teacher, faq, close]);
  }
  /* The registration page of a course (Levi, Nov 27: it "needs some help, to make it feel more seamless visually
     with the course info page"). When the event being registered for is a course in course-pages.json, the
     page's plain title band gives way to a short version of the course page's opening: the course's own
     colors, its title in the same lettering, when and where, the fee, the course art, and a way back to the
     course page. The event's own banner picture (the same art with JLI's lettering) is left out, since the
     band now does its job. The form itself is ChabadOne's and is not touched. */
  function registrationCourse() {
    if (!/cc-v2/.test(html.className) || !window.fetch || !window.ccBase) { return; }
    if (!/\/tools\/events\/register/i.test(location.pathname)) { return; }
    var m = /eventid[=\/](\d+)/i.exec(location.pathname + location.search), head = q("header.article-header");
    if (!m || !head || !q("#co_body_container") || q(".cc-regtop")) { return; }
    fetch(window.ccBase + "course-pages.json" + (window.ccV || "")).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      var all = (data && data.courses) || {}, slug = "", c = null;
      Object.keys(all).forEach(function (k) { if (new RegExp("eventid=" + m[1] + "(\\D|$)").test(all[k].register || "")) { slug = k; c = all[k]; } });
      if (!c || c.state === "closed" || q(".cc-regtop")) { return; }
      // The stylesheet and this script reach browsers separately, and the file host can hand out a new script
      // with an older stylesheet for a while (it did on Nov 27: the band came out unstyled, with the art at
      // full size above the form). So the band is only built when its own rules are really there.
      var probe = h("div", { "class": "cc-regtop" });
      probe.style.display = "none"; d.body.appendChild(probe);
      var styled = window.getComputedStyle(probe).position === "relative";
      d.body.removeChild(probe);
      if (!styled) { return; }
      var col = c.colors || {}, vars = [];
      Object.keys(col).forEach(function (k) { if (/^#[0-9a-f]{3,8}$/i.test(col[k])) { vars.push("--cp-" + k.replace(/[A-Z]/g, function (x) { return "-" + x.toLowerCase(); }) + ":" + col[k]); } });
      var title = h("h1", { "class": "cc-regtop__title cc-head" }), at = c.em ? c.title.lastIndexOf(c.em) : -1;
      if (at < 0) { title.textContent = c.title; }
      else { title.appendChild(d.createTextNode(c.title.slice(0, at))); title.appendChild(h("em", { text: c.em })); title.appendChild(d.createTextNode(c.title.slice(at + c.em.length))); }
      // regArt "fit" (course-pages.json): the art is shown whole at the right, for a picture that carries the
      // course name and must not be cut; otherwise it fills its side of the band, cropped as on the course page
      var fit = c.regArt === "fit";
      var band = h("header", { "class": "cc-regtop" + (c.art ? " cc-regtop--art" : "") + (fit ? " cc-regtop--fit" : ""), style: vars.join(";") }, [
        c.art ? h("div", { "class": "cc-regtop__art", "aria-hidden": "true" }, [h("img", { src: c.art, alt: "", style: c.artPos && !fit ? "object-position:" + c.artPos : null })]) : null,
        h("div", { "class": "cc-wrap cc-regtop__in" }, [
          h("a", { "class": "cc-regtop__back", href: courseHref(slug), text: "About this course" }),
          h("p", { "class": "cc-regtop__eyebrow", text: "Registration" }),
          title,
          c.bar ? h("p", { "class": "cc-regtop__line", text: c.bar }) : null,
          c.price ? h("p", { "class": "cc-regtop__price", text: c.price }) : null
        ])
      ]);
      var wrap = head.parentNode, holder = wrap && /master-content-wrapper/.test(wrap.className) && wrap.children.length === 1 ? wrap : head;
      holder.parentNode.insertBefore(band, holder);
      holder.hidden = true; holder.setAttribute("aria-hidden", "true"); holder.style.setProperty("display", "none", "important");
      addClass(html, "cc-reg-course");
      smartQuotes(band);
      // The form's buttons, links, step marks and highlights take the course's color in place of the site's
      // maroon, provided it reads well on white (contrast of 4.5 or more with white text).
      function onWhite(hex) {
        var n = parseInt(hex.slice(1), 16), ch = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 1.05 / (0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2] + 0.05);
      }
      var six = /^#[0-9a-f]{6}$/i, main = six.test(col.label || "") ? col.label : (six.test(col.deep || "") ? col.deep : ""), form = q("#co_body_container");
      if (main && form && onWhite(main) >= 4.5) {
        var dark = six.test(col.ink || "") && onWhite(col.ink) >= 7 ? col.ink : main;
        form.style.setProperty("--cc-primary", main);
        form.style.setProperty("--cc-primary-2", dark);
        form.style.setProperty("--cc-focus", main);
        form.style.setProperty("--cc-accent-text", main);
        form.style.setProperty("--cc-ink", dark);
        form.style.setProperty("--cc-tint", "color-mix(in srgb, " + main + " 8%, #fff)");
      }
    }).catch(function () {});
  }

  /* The "Date" line of a registration page is ChabadOne's own, made from the event's settings. An event saved
     without a start time shows "12:00AM" as its start, and one without an end time ends at 12:00AM the day after
     (Levi, Nov 27, on The Missing Piece: "absolutely the wrong start time"). So: (1) a course in course-pages.json
     with a `regDate` shows that line instead (a course with two class times has no single right start time);
     (2) any other event whose line has a midnight time shows its dates only, with a midnight end moved back to
     the day it belongs to. Either way the "add to calendar" link goes, since the file it gives has the same
     wrong time. Runs on every event, in both looks. */
  function registrationDate() {
    if (!/\/tools\/events\/register/i.test(location.pathname)) { return; }
    var box = q(".ical_link");
    if (!box || box.getAttribute("data-cc-date")) { return; }
    var raw = (box.textContent || "").replace(/\s+/g, " ").trim();
    function put(t) { box.textContent = t; box.setAttribute("data-cc-date", "1"); }
    if (/\b12:00\s*AM\b/i.test(raw)) { put(datesOnly(raw)); }
    var m = /eventid[=\/](\d+)/i.exec(location.pathname + location.search);
    if (!m || !window.fetch || !window.ccBase) { return; }
    fetch(window.ccBase + "course-pages.json" + (window.ccV || "")).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      var all = (data && data.courses) || {};
      Object.keys(all).forEach(function (k) {
        var c = all[k];
        if (c.regDate && new RegExp("eventid=" + m[1] + "(\\D|$)").test(c.register || "")) { put(c.regDate); }
      });
    }).catch(function () {});
  }
  // "Jan 20,  12:00AM - Feb 24, 2027 8:30PM" -> "Jan 20 – Feb 24, 2027". A time is kept only when it is not
  // midnight and the event is one day; when the line cannot be read, the times are simply taken out.
  function datesOnly(raw) {
    var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var TIME = /,?\s*(\d{1,2}:\d{2}\s*[AP]M)\s*$/i;
    function part(s) {
      s = s.trim();
      var t = TIME.exec(s), rest = (t ? s.slice(0, t.index) : s).replace(/,\s*$/, "").trim();
      var dm = /^(?:[A-Za-z]+,\s*)?([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:,\s*(\d{4}))?$/.exec(rest);
      return { time: t ? t[1].replace(/\s+/g, "") : "", mon: dm ? MON.indexOf(dm[1].charAt(0).toUpperCase() + dm[1].slice(1, 3).toLowerCase()) : -1, day: dm ? +dm[2] : 0, year: dm && dm[3] ? +dm[3] : 0, text: rest };
    }
    var bits = raw.split(/\s+[-–]\s+/), a = part(bits[0]), b = bits[1] ? part(bits[1]) : null;
    var plain = raw.replace(/,?\s*\d{1,2}:\d{2}\s*[AP]M/gi, "").replace(/\s+[-–]\s+/, " – ").replace(/\s+/g, " ").trim();
    if (a.mon < 0 || (b && b.mon < 0 && !/^\d{1,2}:\d{2}/.test(bits[1].trim()))) { return plain; }
    var year = (b && b.year) || a.year || new Date().getFullYear();
    var start = new Date(a.year || year, a.mon, a.day), end = b && b.mon >= 0 ? new Date(b.year || year, b.mon, b.day) : start;
    if (!a.year && end < start) { start = new Date(year - 1, a.mon, a.day); }   // "Nov 9 - May 11, 2027": Nov 9 is 2026
    if (b && /^12:00AM$/i.test(b.time) && end > start) { end = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1); }
    function fmt(dt, withYear) { return MON[dt.getMonth()] + " " + dt.getDate() + (withYear ? ", " + dt.getFullYear() : ""); }
    if (+end === +start) {
      var t = /^12:00AM$/i.test(a.time) ? "" : a.time;
      return fmt(start, true) + (t ? ", " + t.replace(/(AM|PM)$/i, " $1").toLowerCase() : "");
    }
    return fmt(start, start.getFullYear() !== end.getFullYear()) + " – " + fmt(end, true);
  }

  function coursePageNext() {
    var cfg = CC.courseNext;
    if (!cfg || !/cc-v2/.test(html.className)) { return; }
    var moved = cfg.moved || {};
    // A link to an old JLI mini-site course page leads to the ordinary page that replaced it: links already on
    // the page are corrected now and once more after the late-built parts (events, cards) are in, and any
    // link is corrected again at the moment it is clicked.
    function movedHref(a) {
      var hr = a.getAttribute("href") || "", m = /^(?:https?:\/\/(?:www\.)?bhchabad\.org)?\/(\d{5,})\/?(#[\w-]*)?$/i.exec(hr) || /\/aid\/(\d{5,})\/[^#]*(#[\w-]*)?$/.exec(hr);
      // "#lessons" was the lessons block of the mini-site; on the new page it is "#cc-cp-lessons"
      if (!m || !moved[m[1]]) { return; }
      var to = moved[m[1]];
      a.setAttribute("href", "/" + to + (m[2] === "#lessons" ? "#cc-cp-lessons" : (m[2] || "")));
      a.setAttribute("data-cc-moved", "1");
      // ChabadOne's menu can go on listing a deleted page for a while. Where the same menu list already has
      // the new page, the leftover line is taken out, so no course shows twice.
      var box = a.closest ? a.closest(".co_submenu_container") : null;
      if (box && qa("a[href]", box).some(function (b) { return b !== a && !b.getAttribute("data-cc-moved") && new RegExp("/" + to + "(/|$)").test(b.getAttribute("href") || ""); })) {
        a.hidden = true; a.setAttribute("aria-hidden", "true"); a.style.setProperty("display", "none", "important");
      }
    }
    function movedAll() { qa("a[href]").forEach(movedHref); }
    movedAll(); setTimeout(movedAll, 1500); window.addEventListener("load", function () { setTimeout(movedAll, 600); });
    d.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (a) { movedHref(a); }
    }, true);
    var slug = courseSlug();
    if (!slug) { return; }
    var to = moved[coursePageId()];
    if (to) { location.replace("/" + to); return; }                     // an old mini-site address: on to its new page
    if (!q("#header")) { location.replace(cfg.host + "?course=" + slug); return; }
    var old = q(".cc-landing"), holder = old ? old.parentNode : (q(".co_body.article-body") || q("#co_content_container"));
    if (!holder || !window.fetch || !window.ccBase) { return; }
    addClass(html, "cc-course-wait");   // the page's own body stays out of sight while the course is fetched
    function done() { removeClass(html, "cc-course-wait"); }
    fetch(window.ccBase + "course-pages.json" + (window.ccV || "")).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      var c = data && data.courses && data.courses[slug];
      if (!c) { done(); return; }
      var page = buildCourse(c);
      qa(":scope > *", holder).forEach(function (n) { n.hidden = true; n.setAttribute("aria-hidden", "true"); addClass(n, "cc-cp-parked"); });
      holder.appendChild(page);
      addClass(html, "cc-course-page");
      d.title = c.title + " - " + CC.org;
      var hd = q("#header"), setH = function () { if (hd) { html.style.setProperty("--cc-hdr-h", hd.offsetHeight + "px"); } };
      setH(); window.addEventListener("resize", setH); window.addEventListener("load", setH);
      smartQuotes(page);
      // at the closing band the same button is on the page itself: the floating bar steps aside there
      var closing = q(".cc-cp__close", page);
      if (closing && window.IntersectionObserver) {
        new IntersectionObserver(function (es) {
          es.forEach(function (en) { if (en.isIntersecting) { addClass(page, "cc-cp--end"); } else { removeClass(page, "cc-cp--end"); } });
        }, { threshold: 0.35 }).observe(closing);
      }
      done();
      // a link that named a part of the page ("...#cc-cp-lessons") lands on that part, now that it exists
      var part = /^#[\w-]+$/.test(location.hash) ? d.getElementById(location.hash.slice(1)) : null;
      if (part && page.contains(part)) { part.scrollIntoView(); } else { window.scrollTo(0, 0); }
    }).catch(done);
  }

  // Tiny hook so a design preview can show the testimonials layout with sample data (never used by the site itself)
  window.ccTheme = { testimonialsSection: testimonialsSection };

  /* ---------- Run ---------- */
  onReady(function () {
    [favicon, header, noticeBar, footer, shabbatTimes, homeShell, landingPage, coursePageNext, courseLibrary, registration, registrationCourse, registrationDate, registrationCap, rsvpJump, closedCourse, eventsListClosed, notFound, subscribePage, fixLinks, smartQuotes].forEach(function (fn) {
      try { fn(); } catch (e) {
        if (window.console) { console.error("[cc-theme]", fn.name, e); }
        if (fn === homeShell) { addClass(html, "cc-shell-failed"); }
      }
    });
  });
})();
