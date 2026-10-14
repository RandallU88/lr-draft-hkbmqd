/* Liberty Retreats shared script (private draft). No outside calls. */
(function () {
  "use strict";
  var C = window.LIBERTY || {};

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* Draft strip */
  if (C.SHOW_DRAFT_BANNER) {
    var strip = document.createElement("div");
    strip.className = "draft-strip";
    strip.textContent = "Private draft. Not published.";
    document.body.insertBefore(strip, document.body.firstChild);
  }

  /* Header turns solid after scrolling */
  var head = document.querySelector(".site-head");
  function onScroll() { if (head) head.classList.toggle("solid", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile nav */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("open", !open);
    });
  }

  /* Prices: single flag in config.js */
  var showPrices = !!C.SHOW_PRICES;
  var P = C.PRICES || {};
  $$("[data-price]").forEach(function (el) {
    var v = P[el.getAttribute("data-price")];
    if (typeof v === "number") el.textContent = "$" + v;
  });
  $$(".price-only").forEach(function (el) { el.hidden = !showPrices; });
  $$(".price-off").forEach(function (el) { el.hidden = showPrices; });

  /* Contact placeholders */
  $$("[data-contact-email]").forEach(function (el) {
    el.textContent = C.CONTACT_EMAIL || "Email coming soon";
    if (el.tagName === "A" && C.CONTACT_EMAIL) el.href = "mailto:" + C.CONTACT_EMAIL;
  });
  $$("[data-x-link]").forEach(function (el) { if (C.X_URL) el.href = C.X_URL; });
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Calendly slot. Locked tool. Stays empty until CALENDLY_URL is set. */
  var slot = $("#calendly-slot");
  if (slot) {
    var url = (C.CALENDLY_URL || "").trim();
    if (/^https:\/\/calendly\.com\//.test(url)) {
      slot.innerHTML = "";
      var f = document.createElement("iframe");
      f.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "hide_gdpr_banner=1";
      f.title = "Book a stay with Liberty Retreats";
      f.loading = "lazy";
      f.className = "calendly-frame";
      slot.appendChild(f);
      slot.classList.add("live");
    }
  }

  /* Game: loads only when tapped */
  var gameBtn = $("#load-game");
  if (gameBtn) {
    gameBtn.addEventListener("click", function () {
      var box = $("#game-box");
      var f = document.createElement("iframe");
      f.src = "play/index.html";
      f.title = "Liberty Retreats trail runner game";
      f.className = "game-frame";
      box.innerHTML = "";
      box.appendChild(f);
    });
  }

  /* Forms: client-side validation + confirmation */
  function fieldError(input, msg) {
    var wrap = input.closest(".field") || input.parentNode;
    var err = wrap.querySelector(".field-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "field-error";
      err.id = (input.id || input.name) + "-err";
      wrap.appendChild(err);
    }
    err.textContent = msg || "";
    if (msg) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", err.id); }
    else { input.removeAttribute("aria-invalid"); }
  }

  function messageFor(input) {
    var v = input.validity;
    if (v.valueMissing) {
      if (input.type === "radio") return "Pick one.";
      if (input.type === "checkbox") return "Please check this box.";
      return "This one is required.";
    }
    if (v.typeMismatch && input.type === "email") return "Enter a real email address.";
    if (v.patternMismatch) return input.getAttribute("data-pattern-msg") || "Check the format.";
    if (v.rangeUnderflow || v.rangeOverflow) return "Enter a number in range.";
    if (v.tooLong) return "That is a bit long.";
    return "Check this field.";
  }

  $$("form[data-lr-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    var inputs = $$("input, select, textarea", form);
    inputs.forEach(function (i) {
      i.addEventListener("blur", function () { if (i.type !== "radio") fieldError(i, i.checkValidity() ? "" : messageFor(i)); });
      function clearIfValid() {
        if (i.type === "radio") { $$("input[name='" + i.name + "']", form).forEach(function (r) { fieldError(r, ""); }); return; }
        if (i.getAttribute("aria-invalid") === "true" && i.checkValidity()) fieldError(i, "");
      }
      i.addEventListener("input", clearIfValid);
      i.addEventListener("change", clearIfValid);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      var seenRadio = {};
      inputs.forEach(function (i) {
        if (i.type === "radio") {
          if (seenRadio[i.name]) return;
          seenRadio[i.name] = true;
          var group = $$("input[name='" + i.name + "']", form);
          var ok = group.some(function (r) { return r.checkValidity(); });
          fieldError(group[0], ok ? "" : messageFor(group[0]));
          if (!ok && !firstBad) firstBad = group[0];
          return;
        }
        if (i.type === "file") {
          var maxFiles = parseInt(i.getAttribute("data-max-files") || "0", 10);
          if (maxFiles && i.files && i.files.length > maxFiles) {
            fieldError(i, "Up to " + maxFiles + " photos for now.");
            if (!firstBad) firstBad = i;
            return;
          }
        }
        var ok2 = i.checkValidity();
        fieldError(i, ok2 ? "" : messageFor(i));
        if (!ok2 && !firstBad) firstBad = i;
      });
      if (firstBad) { firstBad.focus(); return; }

      var kind = form.getAttribute("data-lr-form");
      var endpoint = kind === "host" ? C.HOST_FORM_ENDPOINT : C.WAITLIST_FORM_ENDPOINT;

      /* ======================================================
         FORM HANDLER GOES HERE.
         When an endpoint is set in config.js (Formspree,
         Netlify Forms, GoDaddy form, etc.), this posts the
         form. Photo uploads need a handler that accepts files.
         Until then nothing leaves the browser.
         ====================================================== */
      if (endpoint) {
        fetch(endpoint, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error("bad"); done(form, true); })
          .catch(function () { done(form, false); });
      } else {
        done(form, true);
      }
    });
  });

  function done(form, ok) {
    var conf = document.getElementById(form.getAttribute("data-confirm"));
    if (!conf) return;
    if (!ok) {
      conf.querySelector("[data-confirm-msg]").textContent = "That did not go through. Try again in a bit.";
    }
    form.hidden = true;
    conf.hidden = false;
    conf.setAttribute("tabindex", "-1");
    conf.focus();
  }

  /* Landowner gate. NOT REAL SECURITY. See config.js. */
  var gate = $("#host-gate");
  if (gate) {
    var gated = $("[data-gated]");
    var KEY = "lr_host_ok";
    function unlock() {
      gate.hidden = true;
      gated.hidden = false;
      document.body.classList.add("unlocked");
      $$(".host-only-nav").forEach(function (el) { el.hidden = false; });
    }
    var stored = null;
    try { stored = sessionStorage.getItem(KEY); } catch (err) { stored = null; }
    if (stored === "1") unlock();
    var gf = $("form", gate);
    gf.addEventListener("submit", function (e) {
      e.preventDefault();
      var pw = $("#host-pass", gate);
      var msg = $("#gate-msg", gate);
      if (pw.value.trim() === String(C.HOST_PASSWORD || "")) {
        try { sessionStorage.setItem(KEY, "1"); } catch (err) {}
        msg.textContent = "";
        unlock();
        window.scrollTo(0, 0);
      } else {
        msg.textContent = pw.value ? "That password is not right." : "Enter the landowner password.";
        pw.setAttribute("aria-invalid", "true");
        pw.focus();
      }
    });
    var lock = $("#host-lock");
    if (lock) lock.addEventListener("click", function () {
      try { sessionStorage.removeItem(KEY); } catch (err) {}
      window.location.reload();
    });
  }
})();
