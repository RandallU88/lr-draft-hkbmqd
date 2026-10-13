/* =========================================================
   LIBERTY RETREATS SITE CONFIG (private draft)
   Every switch Randall may want to flip lives here.
   ========================================================= */
window.LIBERTY = {
  /* PRICES. One flag. true = prices show on Book page and
     the home sample listing. false = every price disappears.
     Merch, kit, and host items never show prices. */
  SHOW_PRICES: true,
  PRICES: {
    night: 80,      /* per pad, per night */
    fireRing: 20,   /* smokeless fire ring add-on */
    lantern: 15     /* lantern add-on */
  },
  /* Pad standard: American and Liberty flags on an extendable pole,
     fire ring, fire extinguisher, emergency radio. Group size TBD. */

  /* GEAR UP (camper store). Amazon affiliate for now.
     Paste Randall's Amazon Associates tag here, e.g. "liberty-20".
     Each product in assets/js/gear-shop.js has mode 'affiliate' or 'own'.
     Switch an item to 'own' later to sell and ship it yourself. */
  AFFILIATE_TAG: "",  /* empty until Randall has a real Amazon Associates tag */

  /* BOOKING. Calendly is the locked booking tool.
     No link exists yet. Paste the Calendly scheduling URL
     between the quotes when it is ready, e.g.
     "https://calendly.com/YOUR-HANDLE/stay"
     While empty, the page shows "Booking opens soon". */
  CALENDLY_URL: "",

  /* FORMS. No backend yet. When a form handler is chosen
     (Formspree, Netlify Forms, GoDaddy form, etc.), put the
     POST endpoint here. While empty, forms only show an
     on-screen confirmation and nothing is sent anywhere. */
  WAITLIST_FORM_ENDPOINT: "",
  HOST_FORM_ENDPOINT: "",

  /* CONTACT. Placeholder only. No public email chosen yet. */
  CONTACT_EMAIL: "email-tbd@example.com",
  X_URL: "https://x.com/libertyretreats",

  /* LANDOWNER GATE. NOT REAL SECURITY.
     This is a client-side check for the private draft only.
     Anyone who views the page source can read the password
     and the gated copy. Real gating is TBD (host login,
     server-side password, or a private page on the host). */
  HOST_PASSWORD: "password",

  /* Shows the thin "private draft" strip at the top. */
  SHOW_DRAFT_BANNER: true
};
