# FlexFit HTX — Website

The live marketing + lead-capture site for FlexFit HTX (reformer Pilates + infrared sauna, Sugar Land TX).

- **Live:** https://flexfithtx.com
- **Host:** Vercel (auto-deploys on push to `main` of `leadmill-agency/flexfit`)
- **Stack:** one self-contained `index.html` (all CSS + JS embedded) + one serverless function (`api/subscribe.js`). No build step, no framework.

> This is a real, deployed site — not a mock prototype. Every form captures live leads into beehiiv.

## Contents

| Path | What it is |
|---|---|
| `index.html` | The entire site — HTML, CSS, and JS in one file (~2,800 lines) |
| `privacy.html` | Privacy Policy (served at `/privacy`) |
| `terms.html` | Terms of Service (served at `/terms`) |
| `api/subscribe.js` | Vercel serverless function: bridges all site forms → beehiiv API (keeps the API key server-side) |
| `vercel.json` | `cleanUrls` (so `/privacy` resolves) + security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) |
| `robots.txt` | Allows all crawlers, points to the sitemap |
| `sitemap.xml` | Single-URL sitemap (update `lastmod` on meaningful content changes) |
| `photos/` | Architectural renderings used by the site (referenced in `index.html`) |
| `photos/real/` | **Gitignored** — real studio renders/photos for the *carousel* pipeline, not used by the site |
| `favicon.*`, `apple-touch-icon.png` | FF monogram favicon set on Quell |

## Lead capture — how it works

All five forms POST JSON to `/api/subscribe`, which forwards to beehiiv. The beehiiv API key stays server-side (never in `index.html`).

**Forms on the page:**
1. `founding-250` — main Founding 250 signup (name, email, phone, bring-a-friend)
2. `founding-followup` — qualifying questions shown after signup (interest, preferred time, friend). Carries the email from step 1 so answers attach to the same subscriber.
3. `schedule-notify` — "notify me when booking opens" (email)
4. `newsletter` — footer newsletter (email)
5. `exit-founding` — exit-intent overlay (name, email)

Each form has a hidden `bot-field` honeypot. Submissions are AJAX so the on-page thank-you UX stays intact; the UI shows success even if the network call fails (so a beehiiv hiccup never blocks the visitor).

### Required environment variables (Vercel → Project → Settings → Environment Variables)

| Var | Notes |
|---|---|
| `BEEHIIV_API_KEY` | **Secret.** Regenerate in beehiiv; never hardcode or paste in chat. |
| `BEEHIIV_PUBLICATION_ID` | `pub_xxxx` — not secret |

### beehiiv custom fields (optional but recommended)

Create these in beehiiv → Settings → Custom Fields so the extra data attaches to subscribers:

`First Name` · `Phone` · `Interest` · `Preferred Time` · `Bringing Friend`

If a field doesn't exist, `subscribe.js` automatically retries with just the email so the lead is never lost.

## Sections (top to bottom)

Hero · Practices overview · Ritual 2×2 grid · Studio first look · Beginners · Pilates (split) · Sauna (split) · Instructors · **Founding 250 signup** · Class schedule · Community/Events · FAQ · Final CTA · Footer — plus a mobile sticky CTA and an exit-intent overlay.

## SEO / technical

- `<title>`, meta description, single H1, canonical tag
- Open Graph + Twitter card with **absolute** image URLs (`og:image`, `og:url`, dimensions)
- JSON-LD: `LocalBusiness` (full NAP — 1531 Highway 6 Suite 225, Sugar Land TX 77478 — plus `founder`, `knowsAbout`, `areaServed`), `FAQPage`, `Organization`. No `openingDate` — timing is deliberately vague ("in 2026") per founder guidance; add a hard date only once confirmed.
- NAP shown visibly in the footer (`<address>`) so it matches the schema + Google Business Profile
- Privacy Policy + Terms of Service pages, linked in the footer
- `robots.txt` + `sitemap.xml`
- Hero LCP image preloaded (`<link rel="preload" as="image">`) since it's a CSS background
- All `<img>` have descriptive alt text and `loading="lazy"`
- Google Fonts: Cormorant Garamond + Inter (preconnected)

**Known SEO gaps** (see the audit notes / open items below) — image weight (PNGs are heavy; WebP/AVIF would cut CWV), no street address in schema yet (not public), and no privacy policy / visible contact page.

## Analytics

**GA4 is live** — gtag.js property `G-5WBH3WSS0V` in the `<head>`. Events fire via a safe `track()` helper (no-ops if gtag is blocked):

- **Conversions:** `founding_form_submit` (primary), `schedule_notify_submit`, `newsletter_signup`, `exit_signup`, `founding_followup_submit`
- **Engagement:** `founding_cta_click`, `instagram_click`, `faq_open`, `mobile_sticky_cta_click`

**Still needed in the GA4 UI:** mark the conversion events above as **Key Events** (Admin → Events), and link GA4 ↔ Search Console once GSC is set up. Verify in GA4 Realtime / DebugView after deploy. Meta Pixel not yet installed.

## Brand direction

- Portola palette (Figueroa cream, Mushroom, Lisbon, Salem, Quell)
- Cormorant Garamond + Inter, italic/roman serif headline mix
- Photo-led, warm-dark chiaroscuro register
- Wordmark is still a CSS placeholder (Inter 200, letterspaced) — **replace `.wordmark` when Bilal sends the vector**

## Open items / placeholders to confirm

- **Class schedule + "Booking opens July 1"** (schedule section) — specific days/times and the July 1 date are **unconfirmed**; verify with the founders before treating as final.
- **Phone number** — no public phone yet; add to the footer + JSON-LD `telephone` when available.
- **Legal pages** — Privacy + Terms are live and written to what the site actually does. Have counsel review before relying on them, and confirm the exact SMS program terms (frequency, keywords).
- **Wordmark vector** — swap the CSS placeholder when it arrives.
- **Founder quote** — currently Fakiha's placeholder line in the founder block.

## Resolved this session
- Address is public: **1531 Highway 6, Suite 225, Sugar Land, TX 77478** (footer + schema).
- Opening timing kept **vague** ("in 2026") per founder guidance — no hard date in copy or schema until confirmed.

## Local preview

```bash
cd "Flex Fit/Content/website"
python3 -m http.server 8000
# open http://localhost:8000
```

`file://` works for most of the page, but the form POSTs need the Vercel function (they'll no-op locally and still show the success UX).

## Deploy

Push to `main` → Vercel builds and deploys automatically. No manual step.
