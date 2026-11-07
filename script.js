/* ---- EDIT THIS PART ---------------------------------------------------
   STORE: your contact details.
   PRODUCTS: one entry per item. Put the full product link in "url".
   Items marked sample:true show an "Example" tag; delete them when you add real ones. */
var STORE = {
  email: "youruser99@gmail.com",
  phone: "8630291293",
  helpUrl: "" /* optional: a link for "FOR ANY PROBLEM CLICK HERE" */
};

var IMG_PERFUME = "images/perfume.png";
var IMG_DECANTER = "images/decanter.png";

var PRODUCTS = [
  { title: "Yardley London English Lavender Perfume for Women, 50ml – 90% Naturally Derived, Daily Wear Spray | Lavender & Musk Fragrance",
    category: "Fragrance", image: IMG_PERFUME, url: "" },
  { title: "Ruby red glass decanter with gold enamel scenes and a faceted stopper",
    category: "Home decor", image: IMG_DECANTER, url: "" },
  { title: "Wireless earbuds with charging case", category: "Electronics", hue: 200, url: "", sample: true },
  { title: "Block-print cotton kurta for men", category: "Fashion", hue: 25, url: "", sample: true },
  { title: "Insulated steel water bottle, 1 litre", category: "Home & kitchen", hue: 150, url: "", sample: true },
  { title: "Beginner's guide to programming, paperback", category: "Books", hue: 275, url: "", sample: true }
];
/* ---- END EDIT --------------------------------------------------------- */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var state = { cat: "All", q: "", i: 0 };

  function placeholder(label, hue) {
    var safeLabel = String(label).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 380">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + hue + ',45%,92%)"/><stop offset="1" stop-color="hsl(' + hue + ',40%,80%)"/></linearGradient></defs>' +
      '<rect width="400" height="380" fill="url(#g)"/>' +
      '<rect x="130" y="95" width="140" height="150" rx="14" fill="hsl(' + hue + ',35%,60%)" opacity="0.55"/>' +
      '<circle cx="200" cy="170" r="34" fill="hsl(' + hue + ',40%,96%)" opacity="0.85"/>' +
      '<text x="200" y="300" text-anchor="middle" font-family="sans-serif" font-size="20" fill="hsl(' + hue + ',30%,28%)">Your photo here</text>' +
      '<text x="200" y="326" text-anchor="middle" font-family="sans-serif" font-size="15" fill="hsl(' + hue + ',25%,36%)">' + safeLabel + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  PRODUCTS.forEach(function (p, n) {
    p.id = n;
    if (!p.image) p.image = placeholder(p.category, p.hue || 120);
  });
  var slides = PRODUCTS.concat([{ title: "Featured image", image: "images/back1.jpg" }]);

  var cats = ["All"];
  PRODUCTS.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
  function countIn(c) { return PRODUCTS.filter(function (p) { return c === "All" || p.category === c; }).length; }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---- Slider ---- */
  var track = $("#track"), dots = $("#dots"), caption = $("#caption");
  slides.forEach(function (p, n) {
    var s = document.createElement("div"); s.className = "slide";
    s.setAttribute("role", "group"); s.setAttribute("aria-label", (n + 1) + " of " + slides.length);
    var im = document.createElement("img"); im.src = p.image; im.alt = p.title; im.loading = "lazy";
    s.appendChild(im); track.appendChild(s);
    var d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", "Show photo " + (n + 1));
    d.addEventListener("click", function () { go(n); }); dots.appendChild(d);
  });
  function go(n) {
    var len = slides.length;
    state.i = (n + len) % len;
    track.style.transform = "translateX(" + (-100 * state.i) + "%)";
    Array.prototype.forEach.call(dots.children, function (d, k) {
      if (k === state.i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    caption.textContent = slides[state.i].title;
  }
  $("#prev").addEventListener("click", function () { go(state.i - 1); });
  $("#next").addEventListener("click", function () { go(state.i + 1); });
  var slider = $("#slider");
  slider.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") go(state.i - 1);
    if (e.key === "ArrowRight") go(state.i + 1);
  });
  var paused = false;
  slider.addEventListener("mouseenter", function () { paused = true; });
  slider.addEventListener("mouseleave", function () { paused = false; });
  slider.addEventListener("focusin", function () { paused = true; });
  slider.addEventListener("focusout", function () { paused = false; });
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) setInterval(function () { if (!paused && !document.hidden) go(state.i + 1); }, 4800);
  go(0);

  /* ---- Product list ---- */
  function render() {
    var q = state.q.trim().toLowerCase();
    var items = PRODUCTS.filter(function (p) {
      return (state.cat === "All" || p.category === state.cat) &&
             (!q || (p.title + " " + p.category).toLowerCase().indexOf(q) >= 0);
    });
    $("#count").textContent = items.length + (items.length === 1 ? " product" : " products") +
      (state.cat !== "All" ? " in " + state.cat : "");
    var list = $("#list"); list.textContent = "";
    if (!items.length) {
      var e = document.createElement("p"); e.className = "empty";
      e.textContent = "No products match that search. Clear the search box or choose All.";
      list.appendChild(e);
    }
    items.forEach(function (p) {
      var row = document.createElement("article"); row.className = "row";
      var fig = document.createElement("figure");
      var im = document.createElement("img"); im.src = p.image; im.alt = p.title; im.loading = "lazy";
      fig.appendChild(im);
      var info = document.createElement("div"); info.className = "info";
      var h = document.createElement("h3"); h.textContent = p.title;
      var tags = document.createElement("div"); tags.className = "tags";
      var t1 = document.createElement("span"); t1.className = "tag"; t1.textContent = p.category; tags.appendChild(t1);
      if (p.sample) { var t2 = document.createElement("span"); t2.className = "tag"; t2.textContent = "Example"; tags.appendChild(t2); }
      if (p.price) { var pr = document.createElement("span"); pr.className = "price"; pr.textContent = p.price; tags.appendChild(pr); }
      var a = document.createElement("a"); a.className = "buy"; a.textContent = "BUY";
      if (p.url) { a.href = p.url; a.target = "_blank"; a.rel = "noopener noreferrer sponsored"; }
      else {
        a.href = "#products";
        a.addEventListener("click", function (ev) { ev.preventDefault(); toast("Add this product's link in the PRODUCTS list (url)."); });
      }
      info.appendChild(h); info.appendChild(tags); info.appendChild(a);
      row.appendChild(fig); row.appendChild(info); list.appendChild(row);
    });
    var f = $("#filters");
    Array.prototype.forEach.call(f.children, function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)); });
    Array.prototype.forEach.call($("#shopMenu").children, function (b) { b.setAttribute("aria-checked", String(b.dataset.cat === state.cat)); });
  }
  function setCat(c, scroll) {
    state.cat = c; render();
    if (scroll) $("#products").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  cats.forEach(function (c) {
    var chip = document.createElement("button"); chip.type = "button"; chip.className = "chip"; chip.dataset.cat = c; chip.textContent = c;
    chip.addEventListener("click", function () { setCat(c, false); }); $("#filters").appendChild(chip);
    var m = document.createElement("button"); m.type = "button"; m.setAttribute("role", "menuitemradio"); m.dataset.cat = c;
    var lab = document.createElement("span"); lab.textContent = c; var n = document.createElement("small"); n.textContent = countIn(c);
    m.appendChild(lab); m.appendChild(n);
    m.addEventListener("click", function () { closeMenu(); setCat(c, true); }); $("#shopMenu").appendChild(m);
  });

  /* ---- Header: shop menu + search ---- */
  var shopBtn = $("#shopBtn"), shopMenu = $("#shopMenu");
  function closeMenu() { shopMenu.hidden = true; shopBtn.setAttribute("aria-expanded", "false"); }
  shopBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = shopMenu.hidden; shopMenu.hidden = !open; shopBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) { if (!shopMenu.contains(e.target)) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  var searchBtn = $("#searchBtn"), searchRow = $("#searchRow"), qInput = $("#q");
  searchBtn.addEventListener("click", function () {
    var open = searchRow.hidden; searchRow.hidden = !open; searchBtn.setAttribute("aria-expanded", String(open));
    if (open) qInput.focus();
  });
  qInput.addEventListener("input", function () {
    state.q = qInput.value; render();
    if (state.q) $("#products").scrollIntoView({ behavior: "auto" });
  });

  /* ---- Contact ---- */
  $("#emailText").textContent = STORE.email;
  $("#phoneText").textContent = STORE.phone;
  if (STORE.helpUrl) { var h = $("#helpLink"); h.href = STORE.helpUrl; h.target = "_blank"; h.rel = "noopener noreferrer"; }
  function copyText(text, srcEl) {
    var done = function () { toast("Copied " + text); };
    var fallback = function () {
      if (srcEl) { var r = document.createRange(); r.selectNodeContents(srcEl); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      toast("Press Ctrl+C to copy the selected text");
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }
  Array.prototype.forEach.call(document.querySelectorAll(".copy"), function (b) {
    b.addEventListener("click", function () { var el = document.getElementById(b.dataset.copy); copyText(el.textContent, el); });
  });
  render();
})();
