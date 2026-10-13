# Liberty Retreats site: private draft

Not published. Do not upload until Randall signs off. Every page has `noindex`.

## Preview
    cd liberty-site && python3 -m http.server 8765
    open http://localhost:8765/

## One place to change settings: assets/js/config.js
- SHOW_PRICES: true shows $80/night, +$20 smokeless fire ring, +$15 lantern (Book page, and "From $80/night" on the home sample listing). false hides every price.
- PRICES: the three numbers.
- CALENDLY_URL: empty. Paste the Calendly link when it exists; the Book page embeds it automatically.
- WAITLIST_FORM_ENDPOINT / HOST_FORM_ENDPOINT: empty. Add Formspree, Netlify, or GoDaddy form endpoint. Look for "FORM HANDLER GOES HERE" in assets/js/site.js.
- CONTACT_EMAIL: placeholder (email-tbd@example.com).
- HOST_PASSWORD: "password". NOT REAL SECURITY. Gated copy is in the page source. Replace with real gating before launch.
- SHOW_DRAFT_BANNER: the red "Private draft" strip.

## Notes
- Host handout download is a cleaned copy (downloads/liberty-host-structures-one-pager.pdf). The original PDF names a county, local offices, and phone numbers, so it is not included.
- play/ is a local copy of the Trail Runner game. The home page loads it only when tapped.
- Fonts: Zilla Slab (SIL OFL), bundled in assets/fonts. No outside requests.
- Product art is placeholder SVG.
