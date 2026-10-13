/* Gear Up product list. Easy to switch from Amazon affiliate to own stock.
   mode: 'affiliate' = button goes to Amazon with AFFILIATE_TAG from config.js
   mode: 'own'       = Randall sells and ships it (needs a price and a checkout later)
   All items below are placeholders. Swap in real Amazon product links (ASINs) later. */
(function () {
  "use strict";
  var C = window.LIBERTY || {};
  var TAG = C.AFFILIATE_TAG || "";
  var PRODUCTS = [
    { name: "Tent", note: "A sturdy tent for a primitive pad.", mode: "affiliate", search: "camping tent 4 person", icon: "tent" },
    { name: "Sleeping bag", note: "Rated for cool Ohio nights.", mode: "affiliate", search: "sleeping bag 30 degree", icon: "bag" },
    { name: "Sleeping pad", note: "Something between you and the dirt.", mode: "affiliate", search: "camping sleeping pad", icon: "pad" },
    { name: "Lantern", note: "Warm light after the fire is out.", mode: "affiliate", search: "LED camping lantern", icon: "lantern" },
    { name: "Pie iron", note: "Cast iron over the ring.", mode: "affiliate", search: "pie iron campfire cooker", icon: "pie" },
    { name: "Camp chair", note: "A seat by the fire.", mode: "affiliate", search: "folding camp chair", icon: "chair" },
    { name: "Cooler", note: "Food and water for the stay.", mode: "affiliate", search: "camping cooler", icon: "cooler" },
    { name: "Headlamp", note: "Hands free after dark.", mode: "affiliate", search: "headlamp camping", icon: "lamp" }
  ];
  var ICON = {
    tent: '<polygon points="110,230 200,90 290,230" fill="#6B5E4E" stroke="#1F1A14" stroke-width="4"/><polygon points="180,230 200,140 220,230" fill="#1F1A14"/>',
    bag: '<rect x="120" y="90" width="160" height="140" rx="40" fill="#1E2D4A"/><path d="M130 130 h140" stroke="#F3ECE1" stroke-width="4"/>',
    pad: '<rect x="80" y="140" width="240" height="50" rx="12" fill="#9B2C2C"/><path d="M110 150 v30 M150 150 v30 M190 150 v30 M230 150 v30 M270 150 v30" stroke="#F3ECE1" stroke-width="3"/>',
    lantern: '<rect x="168" y="90" width="64" height="110" rx="10" fill="#F6D9A0" stroke="#1F1A14" stroke-width="5"/><rect x="160" y="70" width="80" height="20" rx="4" fill="#1E2D4A"/><rect x="156" y="200" width="88" height="22" rx="4" fill="#1E2D4A"/>',
    pie: '<rect x="70" y="150" width="190" height="10" fill="#6B5E4E"/><rect x="255" y="115" width="90" height="80" rx="8" fill="#1F1A14"/>',
    chair: '<rect x="130" y="90" width="140" height="90" fill="#1E2D4A"/><path d="M130 180 l-20 60 M270 180 l20 60 M130 240 l140 -60 M270 240 l-140 -60" stroke="#1F1A14" stroke-width="6"/>',
    cooler: '<rect x="110" y="110" width="180" height="120" rx="10" fill="#9B2C2C"/><rect x="110" y="110" width="180" height="30" fill="#F3ECE1"/><rect x="175" y="96" width="50" height="14" fill="#1F1A14"/>',
    lamp: '<ellipse cx="200" cy="150" rx="100" ry="30" fill="none" stroke="#1E2D4A" stroke-width="12"/><rect x="175" y="125" width="50" height="40" rx="8" fill="#1F1A14"/><circle cx="200" cy="145" r="12" fill="#F6D9A0"/>'
  };
  function link(p) {
    if (p.mode === "own") return p.url || "#";
    return "https://www.amazon.com/s?k=" + encodeURIComponent(p.search) + (TAG ? "&tag=" + encodeURIComponent(TAG) : "");
  }
  var grid = document.getElementById("gear-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(function (p) {
    var btn = p.mode === "own"
      ? '<button class="btn soon" type="button" disabled>Coming soon from Liberty</button>'
      : '<a class="btn brick" href="' + link(p) + '" target="_blank" rel="sponsored noopener">Shop on Amazon</a>';
    return '<article class="product"><div class="art"><svg viewBox="0 0 400 300" role="img" aria-label="' + p.name + ' (placeholder art)"><rect width="400" height="300" fill="#EAE0D0"/><rect y="240" width="400" height="60" fill="#6B5E4E" opacity=".35"/>' + ICON[p.icon] + '</svg></div><div class="body"><span class="tag">' + (p.mode === "own" ? "Liberty stock" : "Amazon pick") + '</span> <span class="tbd">Placeholder</span><h3 style="margin-top:6px">' + p.name + '</h3><p>' + p.note + '</p>' + btn + '</div></article>';
  }).join("");
})();
