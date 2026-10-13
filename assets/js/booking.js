/* Liberty Retreats booking demo. FAKE TEST ONLY. No payment, nothing sent. */
(function () {
  "use strict";
  var C = window.LIBERTY || {};
  var RATE = (C.PRICES && C.PRICES.night) || 80;
  var SITES = [
    { id: "primitive", name: "Sample Primitive Site", type: "Primitive",
      desc: "Tent pad in the trees. Fire ring, flag pole, first aid kit and fire blanket included. You bring the tent.",
      blocked: [2, 3, 9, 10, 16, 17, 30] },
    { id: "glamping", name: "Sample Glamping Site", type: "Glamping",
      desc: "A canvas tent set up by the Camp Host. Same quiet, a little more comfort.",
      blocked: [4, 5, 6, 12, 13, 25, 26] },
    { id: "cabin", name: "Sample Cabin Site", type: "Cabin",
      desc: "A small cabin on private land. Details set by the Camp Host.",
      blocked: [1, 7, 8, 14, 15, 21, 22] },
    { id: "waterfront", name: "Sample Waterfront Site", type: "Waterfront",
      desc: "A pad near the water. Water rules set and posted by the Camp Host.",
      blocked: [3, 4, 11, 18, 19, 27, 28] }
  ];
  var ART = {
    primitive: '<rect width="400" height="300" fill="#1E2D4A"/><circle cx="320" cy="60" r="22" fill="#F3ECE1"/><polygon points="40,240 80,150 120,240" fill="#2f4a2f"/><polygon points="300,240 345,140 390,240" fill="#2f4a2f"/><polygon points="140,240 200,150 260,240" fill="#6B5E4E" stroke="#1F1A14" stroke-width="4"/><rect y="240" width="400" height="60" fill="#3d3326"/><line x1="290" y1="110" x2="290" y2="240" stroke="#ccc" stroke-width="4"/><rect x="292" y="112" width="40" height="24" fill="#9B2C2C"/><ellipse cx="90" cy="255" rx="26" ry="8" fill="#555"/><path d="M84 252 q6 -22 12 0z" fill="#F6A04D"/>',
    glamping: '<rect width="400" height="300" fill="#7fa7c9"/><rect y="230" width="400" height="70" fill="#5b7a3a"/><polygon points="90,230 200,100 310,230" fill="#F3ECE1" stroke="#6B5E4E" stroke-width="5"/><rect x="170" y="160" width="60" height="70" fill="#6B5E4E"/><path d="M110 120 h180" stroke="#F6D9A0" stroke-width="3" stroke-dasharray="4 10"/><circle cx="60" cy="60" r="24" fill="#F6D9A0"/>',
    cabin: '<rect width="400" height="300" fill="#c9b79c"/><rect y="235" width="400" height="65" fill="#5b7a3a"/><rect x="110" y="140" width="180" height="95" fill="#8a5a33" stroke="#1F1A14" stroke-width="4"/><polygon points="95,145 200,75 305,145" fill="#3d3326"/><rect x="185" y="180" width="32" height="55" fill="#3d3326"/><rect x="130" y="165" width="34" height="28" fill="#F6D9A0"/><rect x="236" y="165" width="34" height="28" fill="#F6D9A0"/><rect x="250" y="88" width="16" height="36" fill="#555"/>',
    waterfront: '<rect width="400" height="300" fill="#f0c9a0"/><circle cx="200" cy="170" r="40" fill="#F6A04D"/><rect y="170" width="400" height="130" fill="#2c5d7c"/><path d="M0 200 q50 -10 100 0 t100 0 t100 0 t100 0" stroke="#7fa7c9" stroke-width="3" fill="none"/><polygon points="20,250 60,180 100,250" fill="#6B5E4E" stroke="#1F1A14" stroke-width="3"/><rect x="0" y="250" width="160" height="50" fill="#3d3326"/>'
  };
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function key(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function fromKey(k) { var p = k.split("-"); return new Date(+p[0], p[1] - 1, +p[2]); }
  function nice(k) { return fromKey(k).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var LS = "lr_test_bookings";
  function loadBookings() { try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch (e) { return []; } }
  function saveBookings(b) { try { localStorage.setItem(LS, JSON.stringify(b)); } catch (e) {} }
  function blockedSet(site) {
    var s = {};
    site.blocked.forEach(function (o) { var d = new Date(today); d.setDate(d.getDate() + o); s[key(d)] = 1; });
    loadBookings().forEach(function (b) {
      if (b.site !== site.id) return;
      var d = fromKey(b.checkIn), e = fromKey(b.checkOut);
      while (d < e) { s[key(d)] = 1; d.setDate(d.getDate() + 1); }
    });
    return s;
  }

  var grid = $("#site-grid");
  grid.innerHTML = SITES.map(function (s) {
    return '<article class="site-card" id="card-' + s.id + '"><div class="art"><svg viewBox="0 0 400 300" role="img" aria-label="' + s.type + ' site (placeholder illustration)">' + ART[s.id] + '</svg></div><div class="body"><span class="tbd">Fake sample site</span><h3 style="margin-top:8px">' + s.type + '</h3><p>' + esc(s.desc) + '</p><p><strong>$' + RATE + ' per site per night</strong></p><button class="btn brick" type="button" data-pick="' + s.id + '">See calendar</button></div></article>';
  }).join("");

  var state = { site: null, month: null, ci: null, co: null };
  var calSec = $("#cal-section"), ckSec = $("#checkout-section"), cfSec = $("#confirm-section");
  function show(sec) { [calSec, ckSec, cfSec].forEach(function (x) { x.hidden = x !== sec; }); if (sec) sec.scrollIntoView({ behavior: "auto", block: "start" }); }

  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pick]"); if (!b) return;
    state.site = SITES.filter(function (s) { return s.id === b.getAttribute("data-pick"); })[0];
    state.month = new Date(today.getFullYear(), today.getMonth(), 1); state.ci = state.co = null;
    document.querySelectorAll(".site-card").forEach(function (c) { c.classList.toggle("active", c.id === "card-" + state.site.id); });
    $("#cal-title").textContent = state.site.name + " calendar";
    render(); show(calSec);
  });
  $("#cal-prev").addEventListener("click", function () { var m = new Date(state.month); m.setMonth(m.getMonth() - 1); if (m >= new Date(today.getFullYear(), today.getMonth(), 1)) { state.month = m; render(); } });
  $("#cal-next").addEventListener("click", function () { state.month.setMonth(state.month.getMonth() + 1); render(); });

  function nights() { return state.ci && state.co ? Math.round((fromKey(state.co) - fromKey(state.ci)) / 864e5) : 0; }
  function render() {
    var bl = blockedSet(state.site), m = state.month;
    $("#cal-month").textContent = m.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    var html = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(function (d) { return '<span class="dow">' + d + "</span>"; }).join("");
    for (var i = 0; i < m.getDay(); i++) html += "<span></span>";
    var d = new Date(m);
    while (d.getMonth() === m.getMonth()) {
      var k = key(d), cls = [], dis = false;
      if (d < today) { cls.push("past"); dis = true; }
      else if (bl[k]) { cls.push("blocked"); dis = true; }
      if (k === state.ci || k === state.co) cls.push("sel");
      else if (state.ci && state.co && k > state.ci && k < state.co) cls.push("inrange");
      html += '<button type="button" data-day="' + k + '" class="' + cls.join(" ") + '"' + (dis ? " disabled" : "") + ' aria-label="' + nice(k) + (bl[k] ? ", booked" : "") + '">' + d.getDate() + "</button>";
      d.setDate(d.getDate() + 1);
    }
    $("#cal-grid").innerHTML = html;
    var n = nights();
    $("#cal-sum").textContent = !state.ci ? "Tap your check-in date." : !state.co ? "Check-in " + nice(state.ci) + ". Now tap your check-out date." : nice(state.ci) + " to " + nice(state.co) + ", " + n + " night" + (n > 1 ? "s" : "") + ", $" + n * RATE;
    $("#cal-go").disabled = !n;
  }
  $("#cal-grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-day]"); if (!b || b.disabled) return;
    var k = b.getAttribute("data-day");
    if (!state.ci || state.co || k <= state.ci) { state.ci = k; state.co = null; }
    else {
      var bl = blockedSet(state.site), d = fromKey(state.ci), ok = true;
      while (key(d) < k) { if (bl[key(d)]) ok = false; d.setDate(d.getDate() + 1); }
      if (ok) state.co = k; else { state.ci = k; state.co = null; }
    }
    render();
  });
  $("#cal-go").addEventListener("click", function () {
    var n = nights();
    $("#ck-site").textContent = state.site.name;
    $("#ck-dates").textContent = nice(state.ci) + " to " + nice(state.co);
    $("#ck-nights").textContent = n + " x $" + RATE;
    $("#ck-total").textContent = "$" + n * RATE;
    show(ckSec);
  });
  $("#ck-back").addEventListener("click", function () { show(calSec); });
  $("#ck-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var n = nights(), num = "LR-TEST-" + String(Math.floor(1000 + Math.random() * 9000));
    var b = { num: num, site: state.site.id, checkIn: state.ci, checkOut: state.co, name: f.name.value, party: f.party.value, total: n * RATE };
    var all = loadBookings(); all.push(b); saveBookings(all);
    $("#cf-num").textContent = num;
    $("#cf-list").innerHTML = [["Guest", f.name.value], ["Email", f.email.value], ["Phone", f.phone.value], ["Party size", f.party.value], ["Site", state.site.name], ["Arrive", nice(state.ci)], ["Leave", nice(state.co)], ["Nights", n], ["Total (TEST, not charged)", "$" + n * RATE]]
      .map(function (r) { return "<li><span>" + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></li>"; }).join("");
    f.reset(); show(cfSec);
  });
  $("#cf-again").addEventListener("click", function () { show(null); grid.scrollIntoView(); });
  $("#reset-tests").addEventListener("click", function () { saveBookings([]); if (state.site) render(); this.textContent = "Test bookings cleared"; });
})();
