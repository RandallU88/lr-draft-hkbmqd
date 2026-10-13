/* Camp Host store. Hosts buy gear from Liberty (Randall).
   Prices are private and not set: every price shows $TBD.
   TEST checkout only. No payment, nothing sent. */
(function () {
  "use strict";
  var ITEMS = [
    { id: "ring-std", name: "Fire ring, standard", cat: "Fire", note: "Steel fire ring for the pad." },
    { id: "ring-smk", name: "Fire ring, smokeless", cat: "Fire", note: "Smokeless style fire ring." },
    { id: "firstaid", name: "First aid kit", cat: "Safety gear", note: "Site first aid kit." },
    { id: "blanket", name: "Fire blanket", cat: "Safety gear", note: "Fire blanket for the site." },
    { id: "extinguisher", name: "Fire extinguisher", cat: "Safety gear", note: "Extinguisher for the site." },
    { id: "wood", name: "Firewood", cat: "Fire", note: "Firewood for guest fires." },
    { id: "pole", name: "Flag pole", cat: "Site", note: "Extendable flag pole." },
    { id: "signs", name: "Camping signage", cat: "Site", note: "Site, trail and rules signs." },
    { id: "lights", name: "Solar security path lights", cat: "Site", note: "Solar lights for paths." }
  ];
  var ICON = {
    Fire: '<ellipse cx="200" cy="210" rx="90" ry="24" fill="#555" stroke="#1F1A14" stroke-width="4"/><path d="M180 205 q20 -90 40 0z" fill="#F6A04D"/><path d="M192 205 q8 -45 16 0z" fill="#F6D9A0"/>',
    "Safety gear": '<rect x="130" y="100" width="140" height="110" rx="10" fill="#9B2C2C"/><rect x="190" y="120" width="20" height="70" fill="#F3ECE1"/><rect x="165" y="145" width="70" height="20" fill="#F3ECE1"/>',
    Site: '<rect x="196" y="60" width="8" height="180" fill="#6B5E4E"/><rect x="140" y="90" width="120" height="60" fill="#1E2D4A"/><text x="200" y="128" fill="#F3ECE1" text-anchor="middle" style="font:700 20px Georgia,serif">LIBERTY</text><circle cx="110" cy="230" r="10" fill="#F6D9A0"/><circle cx="290" cy="230" r="10" fill="#F6D9A0"/>'
  };
  var cart = {};
  function $(s) { return document.querySelector(s); }
  var grid = $("#store-grid");
  if (!grid) return;
  grid.innerHTML = ITEMS.map(function (p) {
    return '<article class="product"><div class="art"><svg viewBox="0 0 400 300" role="img" aria-label="' + p.name + ' (placeholder art)"><rect width="400" height="300" fill="#EAE0D0"/><rect y="240" width="400" height="60" fill="#6B5E4E" opacity=".35"/>' + ICON[p.cat] + '</svg></div><div class="body"><span class="tag">' + p.cat + '</span> <span class="tbd">Price $TBD</span><h3 style="margin-top:6px">' + p.name + '</h3><p>' + p.note + '</p><button class="btn brick" type="button" data-add="' + p.id + '">Add to cart</button></div></article>';
  }).join("");
  function byId(id) { return ITEMS.filter(function (i) { return i.id === id; })[0]; }
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function render() {
    var ids = Object.keys(cart);
    $("#cart-count").textContent = count();
    $("#cart-list").innerHTML = ids.length ? ids.map(function (id) {
      return '<li><span>' + byId(id).name + ' <span class="tbd">$TBD</span></span><span class="qty"><button type="button" data-dec="' + id + '" aria-label="Remove one">-</button><b>' + cart[id] + '</b><button type="button" data-inc="' + id + '" aria-label="Add one">+</button></span></li>';
    }).join("") : '<li><span class="muted">Cart is empty.</span></li>';
    $("#cart-go").disabled = !ids.length;
  }
  document.addEventListener("click", function (e) {
    var t = e.target, id;
    if ((id = t.getAttribute && t.getAttribute("data-add"))) { cart[id] = (cart[id] || 0) + 1; t.textContent = "Added (" + cart[id] + ")"; render(); }
    else if ((id = t.getAttribute && t.getAttribute("data-inc"))) { cart[id]++; render(); }
    else if ((id = t.getAttribute && t.getAttribute("data-dec"))) { if (--cart[id] <= 0) delete cart[id]; render(); }
  });
  $("#cart-go").addEventListener("click", function () { $("#store-checkout").hidden = false; $("#store-checkout").scrollIntoView(); });
  $("#store-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var num = "LR-HOST-TEST-" + String(Math.floor(1000 + Math.random() * 9000));
    $("#so-num").textContent = num;
    $("#so-list").innerHTML = Object.keys(cart).map(function (id) { return "<li><span>" + byId(id).name + "</span><b>x" + cart[id] + "</b></li>"; }).join("") + "<li><span>Total</span><b>$TBD (test, not charged)</b></li>";
    cart = {}; render(); f.reset();
    $("#store-checkout").hidden = true; $("#store-done").hidden = false; $("#store-done").scrollIntoView();
  });
})();
