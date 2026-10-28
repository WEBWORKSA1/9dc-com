# 9DC.com — Competitive research (October 2026)

40 world-class sites in the DC-power niche (EV fast charging, solar PV, DC batteries) were reviewed. Findings were paraphrased and used to shape features, forms, content and calculator assumptions.

## Sites reviewed
| # | Site | Standout feature adopted / learned from |
|---|---|---|
| 1 | PlugShare | Crowd-sourced charger map, 1–10 station score, filters by plug/speed/network |
| 2 | ChargePoint | Audience split (drivers / business / fleet); repeated "talk to an expert" CTAs |
| 3 | Electrify America | Membership pricing, maintenance transparency page, glossary |
| 4 | EVgo | "Host a site / suggest a site" lead form; incentives page |
| 5 | IONNA | Big-number hero, "keep me posted" alerts |
| 6 | Tesla Supercharger | Stat-callout hero, 4-step how-it-works, trip planner |
| 7 | Open Charge Map | Open data, light/dark theme |
| 8 | AFDC (US DOE) | Station locator, route mapping, free data, authoritative charging-level figures |
| 9 | fueleconomy.gov | EV efficiency / battery explainers, 84–93% charge efficiency |
| 10 | EV Database | ~30 filters, sort by charge power / 1-stop range |
| 11 | A Better Routeplanner | SoC + charger-speed trip planning inputs |
| 12 | Zapmap | Guides & tools hub, premium tier, embeddable widgets |
| 13 | ChargeHub | Bilingual EN/FR, large port map |
| 14 | InsideEVs | EV 101 hub, sponsored sections, ad-free subscription |
| 15 | Electrek | Deals roundups, newsletter, display ads |
| 16 | CleanTechnica | Ads + affiliate + reader donations; topic series pages |
| 17 | Green Car Reports | Awards, RSS |
| 18 | Edmunds EV | Real-world range tests; ZIP-first home-charger install quote |
| 19 | Recurrent | Battery health data; cold-weather range figures |
| 20 | EnergySage | ZIP-first quote marketplace; heavy trust signals |
| 21 | SolarReviews | Result shown before contact details; "how we rank" page |
| 22 | NREL PVWatts | Production model and loss/inverter defaults |
| 23 | Google Solar API | Building insights / flux maps |
| 24 | Battery University | Numbered knowledge library; single-sponsor model |
| 25 | Victron Energy | MPPT calculator, system diagrams, dealer finder |
| 26 | Renogy | Power-needs calculator; email-signup discount; affiliates |
| 27 | EcoFlow | "Help me choose" quiz; financing; referral and affiliate |
| 28 | Jackery | Product comparison; guarantee/warranty trust signals |
| 29 | Bluetti | Sizing guides; incentive banners |
| 30 | DIY Solar Power Forum | Community categories (LiFePO4, BMS, safety); marketplace |
| 31 | Unbound Solar (absorbed Wholesale Solar) | 8+ calculators incl. wire size / voltage drop; sun-hours map |
| 32 | altE Store | Shop-by-project; paid tech-support session; quote request |
| 33 | Signature Solar | Free custom system design form; financing; BBB badge |
| 34 | Qmerit | Instant install estimate + panel photo; NPS trust signal |
| 35 | Enphase | System estimator; installer locator; homeowner vs installer paths |
| 36 | Sunrun | Clean multi-step quote form with optional TCPA consent |
| 37 | Rewiring America | Electrification planner; savings calculator |
| 38 | Sense | Impact numbers beside press logos |
| 39 | Kelley Blue Book EV | Total-cost-of-ownership, match quiz, ZIP dealer quote |
| 40 | EIA Short-Term Energy Outlook | Electricity price data source |

## Features implemented on 9DC.com
- **9 calculators** (the "9" in 9DC): DC fast-charge time with taper curve, charging cost vs gas, road-trip stops, solar sizer, solar payback, battery bank, power-station runtime, DC wire gauge & voltage drop, Ohm's law & DC power.
- **Result-first lead gen**: every calculator shows its answer before asking for anything, then offers a pre-filled "get quotes" link carrying the result into a 4-step quote form (project → property → details → contact), with optional consent, privacy line and "what happens next".
- **Hub structure**: Tools / Guides / Videos / Glossary / Resources, sticky header CTA, sticky mobile CTA, light/dark toggle, skip link, filter chips and search.
- **Content**: long-form original guides, glossary, curated video library (click-to-load YouTube facades), resource directory linking to authoritative public sources.
- **Monetisation**: Google AdSense (auto ads), lead generation, donations/memberships, sponsorship & advertising packages, contest sponsorship, newsletter.

## Calculator assumptions (sources)
| Figure | Value used | Source |
|---|---|---|
| Level 1 / Level 2 / DC fast | ~1.9 kW / up to 19.2 kW / up to 500 kW | AFDC (afdc.energy.gov) |
| DC fast tiers modelled | 50 / 150 / 350 kW presets | AFDC, network sites |
| Charging taper | Plateau to ~50% SoC, taper to ~55% of peak at 80%, steep after | ChargePoint, Tesla guidance (generic model) |
| Wall-to-battery efficiency | 88% home AC, 93% DC fast | fueleconomy.gov (84–93%) |
| Cold-weather range | ~78% at 32 °F | Recurrent |
| US residential electricity | 17.3¢/kWh (2025), 18.2¢ forecast 2026 → default $0.17–0.18 | EIA STEO, Oct 2026 |
| Peak sun hours presets | AZ 6.5, CA 5.6, TX/FL 5.3, IL 4.3, NY 4.0, WA 3.8 | Unbound Solar (NREL-based) |
| System losses | 14% default | NREL PVWatts |
| Solar installed cost | ~$2.60/W before incentives | EnergySage |
| LiFePO4 | 12.8 V nominal (4S), usable DoD default 90% | Battery University; DoD shown as editable assumption |
| Inverter efficiency | 85–96% selectable | NREL PVWatts / off-grid practice |
