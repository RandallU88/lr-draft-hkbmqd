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

## Photo credits (v7)
Self-hosted in assets/img/photos, compressed under 300 KB. Stock samples, not Liberty sites.
- hero-forest-camp, site-primitive, campfire, tent-sunset: Unsplash (Unsplash License), photo IDs 1487730116645-74489c95b41b, 1504280390367-361c6d9f38f4, 1478131143081-80f7f84ca84d, 1510312305653-8ed496efae75
- site-glamping: Li Yang on Unsplash (photo-1632367294096-4e77d53c4ae9)
- site-cabin: Gabriele Merlino on Unsplash (photo-1733643313174-c0085209f3a6)
- site-waterfront: Unsplash, "Fall in Lac La Belle" (photo-1634006372581-f66e57880f82)
- flag: Andrew Patrick Photo on Pexels (photo 12514745, Pexels License)
