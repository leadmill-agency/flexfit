# FlexFit HTX — Sample Website

Single-file high-fidelity prototype built to the spec in `Readme/flexfit_sample_website_prd.md`. Use this for founder review and as the visual direction for a production build.

## Contents

- `index.html` — the entire site in one self-contained HTML file (CSS + JS embedded)
- `photos/` — the 16 architectural renderings, renamed descriptively

## How to view locally

Just double-click `index.html` and it opens in your default browser. No build step, no server needed.

If you want a local server (some browsers restrict `file://` for some features):

```bash
cd "Flex Fit/Content/website"
python3 -m http.server 8000
# then open http://localhost:8000
```

## How to share with founders

**Option A — share the folder.** Zip the `website/` folder and AirDrop / email it. They double-click `index.html` to view.

**Option B — deploy to a free public URL (recommended).** Drag the `website/` folder onto [netlify.com/drop](https://app.netlify.com/drop). You get a public URL in ~30 seconds. No account required for the temporary URL.

**Option C — Vercel** (if you have a Vercel account):
```bash
cd "Flex Fit/Content/website"
npx vercel
```

## What's in it

11 sections per the PRD:

1. **Header** — sticky, transparent over hero, switches to light over the FAQ section, mobile hamburger
2. **Hero** — full-bleed lobby rendering, H1, sub, two CTAs
3. **Ritual 2×2 grid** — Move / Sweat / Reset / Belong with photo backgrounds
4. **Studio First Look** — 4-tile editorial grid (lobby, sauna, reformer, hallway-with-wordmark)
5. **Pilates** — split-screen, Salem background, reformer photo
6. **Sauna** — split-screen (reversed), Lisbon background, sauna photo
7. **Founding 250** — Quell background with treatment-room photo, full signup form (all PRD fields, mock submission)
8. **Community / Events** — Mushroom background, 3 event cards
9. **Founder Note** — treatment-room background with Fakiha's quote in the dark negative space
10. **FAQ** — Figueroa background, 12 questions in accordion
11. **Final CTA** — hallway-with-wordmark background (the dramatic close)
12. **Footer** — dark, 4-column layout with brand, studio links, membership, contact

Plus a **mobile sticky CTA** that appears after the hero and hides near the form.

## Built per the locked brand direction

- Portola palette (Figueroa cream, Mushroom, Lisbon, Salem, Quell)
- Cormorant Garamond + Inter (Google Fonts)
- Photo-led throughout — the 16 architectural renderings carry the brand
- Warm-dark chiaroscuro register on most sections
- Italic + roman serif mix for headlines (e.g. "Your weekly *reset* ritual.")
- Wordmark placeholder set in Inter weight 200, letterspaced 0.46em (replace once Bilal sends the vector)

## SEO

- Meta title + description per PRD
- JSON-LD schema for LocalBusiness, FAQPage, Organization
- One H1 per page ("Reformer Pilates + Infrared Sauna in Sugar Land")
- H2s aligned to target keywords
- All images have descriptive alt text

## Analytics

Placeholders only — `console.log` events fire for:
- `founding_cta_click`
- `founding_form_submit`
- `instagram_click`
- `faq_open`
- `mobile_sticky_cta_click`

Hook these to GA4 / Meta Pixel / GTM when you're ready for a real deployment.

## What's NOT in this prototype (per PRD non-goals)

No booking engine, no payment, no CMS, no blog, no real form backend, no class scheduler. The form pretends to submit and shows the success message inline.

## What to update when the brand evolves

- **Wordmark** — replace the `.wordmark` CSS class everywhere with the actual font when Bilal sends it
- **Real photos** — drop into `photos/`, swap the references in `index.html`. The folder is named so it's obvious which file goes where
- **Founder quote** — `.founder-block .quote` and `.body` (currently uses the placeholder "I wanted this for Sugar Land")
- **Address + phone** — footer `.col` for Contact + JSON-LD `@type: PostalAddress`
- **Form submission** — replace the `handleSubmit` function with a real POST to Tally / Typeform / HubSpot / GoHighLevel / your backend
