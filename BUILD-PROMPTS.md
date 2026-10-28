# 9DC.com — Phase-wise build prompts

**Concept:** 9DC = "Direct Current, Decoded". *9* = nine free calculators; *DC* = direct current — the shared physics of EV fast charging, solar PV and batteries. Revenue: Google AdSense on high-intent, high-CPC energy traffic (solar, EV charging, batteries) + pay-per-lead quote requests (solar, battery, EV-charger installs, commercial DC fast) + sponsorships + donations/memberships + contest sponsorship.

**Why this idea wins for "9DC":** "DC" alone is ambiguous and crowded with trademarks (comics, Washington DC, data centers). Using the generic engineering meaning (direct current) is trademark-safe, and the niche has (a) evergreen calculator search demand, (b) premium advertisers (solar installers, EV-charger makers, battery brands), and (c) a natural lead product (installer quotes). Calculators earn links and repeat visits; guides earn search traffic; quotes convert intent into revenue.

Run each phase as its own prompt. Each phase ends with something testable.

---

## Phase 1 — Foundation, layout and compliance
> Build a static Jekyll site for GitHub Pages (free plan, no build step beyond GitHub's native Jekyll). Domain 9dc.com (CNAME). Create `_config.yml` (url https://9dc.com, baseurl ""), `_layouts/default.html` and `assets/css/style.css`.
> - Head: title/description/canonical/OG/Twitter tags from front matter, WebSite JSON-LD, optional per-page `schema`, Google Fonts (Archivo + IBM Plex Mono), and the AdSense script exactly: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`.
> - Top of every page: a bar reading "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linked to https://web.works/contact.
> - Sticky header (logo badge "9DC", nav: 9 Tools, Guides, Videos, Glossary, Contest, Support, CTA "Free Quotes"), theme toggle (dark default, light via prefers-color-scheme and toggle), mobile burger, skip link, sticky mobile CTA bar, cookie notice.
> - Footer: newsletter form, link groups (Tools, Learn, Get involved, Company/Legal), trademark & copyright disclosure stating "DC" means direct current and no affiliation with DC Comics, the District of Columbia, data-center operators or any similarly named entity.
> - Add `ads.txt` (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`), `robots.txt`, `sitemap.xml`, `site.webmanifest`, SVG favicon and OG image.
> - Design: electric "volt yellow + cyan on near-black" system, CSS variables, a separate accessible accent text colour for light mode, 16px gutters, no horizontal scroll at 375px, reduced-motion support.

## Phase 2 — Private form routing (single hidden inbox)
> Write `assets/js/main.js` (no dependencies). All forms (`form.js-form`) POST JSON via fetch to `https://formsubmit.co/ajax/<inbox>`, where the inbox address is assembled at runtime from an XOR-encoded, reversed char-code array so it never appears in any HTML, JS string or repo file. Include honeypot `_honey`, `_subject` from `data-subject`, `_template=table`, `_captcha=false`, page path, success/error messages, and `[data-mail]` links that open `mailto:` with the decoded address only on click. The only inbox used site-wide is the owner's single private address. After first deploy, submit one form and click FormSubmit's activation email.

## Phase 3 — The nine calculators (`tools.html`)
> Tabbed tool page with deep links (`#t-fast` etc.), live results, visible assumptions, a verdict line and a contextual "get quotes" CTA that carries the result into the quote form (`/get-quote.html?type=…&ctx=…`).
> 1. **DC fast-charge time** — pack kWh, start/target SoC sliders, charger kW (50–400), car max kW, battery temperature; integrate a taper curve (ramp <10%, plateau to 50%, taper to 55% at 80%, steep to ~10% at 100%); output minutes, kWh in/out (93% DC efficiency), average kW, range added, SVG curve with the charged segment shaded, and an 80% warning.
> 2. **Charging cost vs gas** — miles/month, mi/kWh, home and DC rates (88%/93% efficiency), DC share slider, session fees, gas price and mpg → monthly EV vs gas, yearly savings, ¢/mile.
> 3. **Road-trip stops** — distance, highway efficiency, pack, start %, arrival buffer, charge-to %, charger kW, speed → stops, charging time (+6 min/stop), driving and total time.
> 4. **Solar sizer** — kWh/month, offset %, peak-sun-hour region presets (AZ 6.5 … PNW 3.8), losses 14%, panel W, $2.60/W → kW DC, panels, roof area, annual kWh, cost.
> 5. **Solar payback** — price, rebates %, year-1 kWh, rate, escalation, degradation, export value %, O&M → payback years, 25-year gain, ROI, lifetime ¢/kWh. Do not hard-code tax credits; user enters what applies.
> 6. **Battery bank** — daily Wh, autonomy days, 12/24/48 V, chemistry DoD (LiFePO4 90%, NMC 80%, lead-acid 50%), inverter efficiency, cold derate, peak load → kWh, Ah, 100 Ah-equivalents, battery current with a voltage recommendation.
> 7. **Power-station runtime** — Wh, usable %, AC/DC efficiency, inverter rating, running watts with quick-add appliance buttons, solar input → hours, days, recharge time, overload warning.
> 8. **DC wire gauge & voltage drop** — V, A, one-way length, max drop %, copper/aluminium; CM = 2·K·I·L/Vd (K 12.9 Cu / 21.2 Al) plus 125% ampacity check across AWG 18–4/0 → AWG, mm², actual drop, heat loss, fuse size.
> 9. **Ohm's law & DC power** — any two of V, I, R, P → the rest, plus Wh and Ah over a run time.
> Homepage hero: an animated simulated 180 kW charging session driven by the same curve function.

## Phase 4 — Lead generation (`get-quote.html`)
> Result-first, four-step form with progress bar: (1) project choice cards — solar, battery backup, home EV charger, off-grid/RV/van, business DC fast, other (auto-advance); (2) country, ZIP/postal code, property type, ownership, timeline; (3) optional bill range, panel amps, vehicle, budget, notes; (4) name, email, phone, preferred channel, explicit consent to share with up to three providers, optional newsletter. Prefill project and attach calculator context from URL params. Side panel: "what happens next" timeline, questions to ask installers, installer-network recruitment CTA. Trust line: encrypted, never sold to data brokers, free, no obligation. Link quote CTAs from every calculator, guide sidebar and the homepage.

## Phase 5 — Content for traffic and AdSense approval
> Write original, sourced, long-form guides (`/guides/`): DC fast charging explained; NACS/J3400, CCS1/2, CHAdeMO; EV battery health; DC- vs AC-coupled solar + storage; LiFePO4 buyer's guide; 12 V vs 24 V vs 48 V; DC wiring, fuses and safety. Each with breadcrumb, Article JSON-LD, table of contents, tables, callouts, safety notes and calculator/quote CTAs. Add a guides hub with search and category chips, a 50+ term searchable glossary, a resources directory of authoritative public sources (AFDC, NREL PVWatts, PVGIS, EIA, IEA, DSIRE, SAE, IEC, UL), and a video library using click-to-load YouTube facades (youtube-nocookie) with verified video IDs only (check each with YouTube oEmbed).

## Phase 6 — Community, donations, talent, advertising
> - `support.html`: one-time/monthly pledge form (amount chips + custom, purpose: operations, contest prizes, hiring talent, promotion & marketing, new calculator; payment preference card/PayPal/UPI/bank), tiers Spark $3 / Current $9 / Grid $29, "we send a secure payment link — never card numbers in a form".
> - `contest.html`: monthly "DC Build of the Month" with live countdown to month-end, three prize categories, weighted judging (safety 30%), rules (18+, free entry, void where prohibited), entry form with photo link.
> - `careers.html`: six freelance/part-time roles + application form.
> - `advertise.html`: tool sponsor, category partner, contest sponsor, newsletter packages; installer network, manufacturer and charging-network partnerships; inquiry form including "buying the website or domain".

## Phase 7 — Trust, legal and AdSense readiness
> About (editorial standards, funding), Contact (form + click-to-email + web.works link), Privacy (AdSense cookie language, opt-out links, consent for EEA/UK/CH, form processor, quote sharing, GDPR/CCPA/PIPEDA/Law 25/DPDP rights), Terms (incl. contest and donation terms), Disclaimer (estimates + safety + ads/referral disclosure), Cookie Policy, Trademark & Copyright page, branded 404. AdSense checklist: original content on every indexable page, clear navigation, no ads on empty pages, privacy policy with Google cookie disclosure, ads.txt, contact page, no misleading CTAs near ads, no copyrighted media beyond standard YouTube embeds. In AdSense, enable a certified CMP (Privacy & messaging) for EEA/UK.

## Phase 8 — QA, deploy and grow
> QA: render every page, zero JS errors, no horizontal overflow at 375px, all calculators return finite results, multistep form validates per step and posts all fields, confirm the inbox address never appears in the repo. Push to `webworksa1/9dc-com` (main), enable GitHub Pages (branch main, root), custom domain 9dc.com with HTTPS. DNS: apex A records 185.199.108.153 / .109.153 / .110.153 / .111.153 and `www` CNAME `webworksa1.github.io`. Then: submit sitemap in Google Search Console, apply for AdSense, add a guide per week (cost guides, incentives by country, EV-specific charging curves), build calculators 10–20 (Level 2 install cost, panel-upgrade check, V2H backup hours, generator vs battery), and sell lead territories to installers once volume exists.
