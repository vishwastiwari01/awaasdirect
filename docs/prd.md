# Product Requirements Document

## Product Name
**AwaasDirect** — India's first AI-powered, broker-free real estate platform

## One-Line Description
AwaasDirect connects verified property owners directly with verified buyers and renters in India, eliminating broker fees using AI-powered tools including virtual 3D tours, AI floor plan generation, and direct in-app chat.

---

## Problem Statement

Finding a home in India — whether to buy or rent — almost always requires going through a broker who charges 1–2 months' rent (rental) or 1–2% of property value (sale) as commission. There is no trusted, scalable, AI-enabled platform that cuts out the middleman and gives buyers/tenants direct access to real, verified property owners.

**Who has this problem?**
- **Buyers & Renters**: Pay large broker fees, deal with fake/duplicate listings, lack tools to evaluate properties remotely, and have no safe way to verify ownership.
- **Property Owners**: Pay listing fees or commissions to brokers, lack analytics on listing views, and have no way to screen buyers directly.

---

## Target Users

| Type | Description |
|------|-------------|
| **Primary — Buyers/Renters** | Urban Indians (Tier 1 & Tier 2 cities) looking to buy/rent residential property directly from owners. Age 24–50, smartphone-first, trust-sensitive. |
| **Primary — Property Owners** | Individual homeowners and plot owners who want to list property for sale/rent without paying broker commission. |
| **Secondary — NRI Buyers** | Non-Resident Indians looking to buy property remotely; need virtual tours and AI floor plans. |

---

## Core Value Proposition

- **Zero broker fees** — owners list free, buyers contact directly
- **Trust via verification** — Aadhaar KYC for users, RERA number validation for properties
- **AI tools no competitor offers** — AI-powered 3D virtual tours from photos, AI floor plan generation for plots
- **Direct chat** — secure in-app messaging between owner & buyer, no third-party middleman

---

## Success Metrics (MVP — First 90 Days)

| Metric | Target |
|--------|--------|
| Property listings (live) | 500+ |
| Registered & Aadhaar-verified users | 2,000+ |
| Buyer-to-owner direct chats initiated | 1,000+ |
| AI virtual tours generated | 300+ |
| AI floor plans generated for plots | 100+ |
| RERA-verified property listings | ≥ 60% of all listings |

---

## Scope — Version 1.0 (MVP)

The MVP focuses on **5 core capabilities**:

1. **Property Listing** — Owners list residential properties (flat/house/plot) for sale or rent with photos, price, location, and RERA number.
2. **Search & Filter** — Buyers search by city, area, type (buy/rent), BHK, price range, and verified status.
3. **AI Virtual Tours** — Platform generates a navigable 3D virtual tour from owner-uploaded photos (powered by a third-party AI engine).
4. **AI Floor Plan Generator** — For vacant plots listed for sale, buyers can generate AI-suggested floor plans based on plot dimensions.
5. **Direct Chat** — Verified buyers contact verified owners via in-app chat; no phone numbers exposed until both parties consent.

**Verification Gates:**
- Users: Aadhaar OTP-based KYC (via DigiLocker / Aadhaar API)
- Properties: RERA registration number field; system performs format validation and links to state RERA portal data where available.

---

## Out of Scope (v1)

- Payment/escrow or token booking through the platform
- Legal document upload, e-stamping, or sale agreement generation
- Loan / home finance integration
- Agent/broker accounts (no broker onboarding in MVP)
- Commercial property listings
- Ratings and reviews for owners
- Mobile native app (iOS/Android) — web-first MVP
- Multilingual UI (English-first, Hindi v1.1)
- Push notification system
- AI property price prediction / valuation

---

## Constraints & Assumptions

- Aadhaar API access requires UIDAI sandbox / approved partner — use DigiLocker API for MVP pilot.
- RERA data availability varies by state; MVP validates RERA number format only; full API integration deferred.
- AI virtual tour generation uses a third-party service (e.g., Matterport API, Kuula, or open-source NeRF pipeline).
- AI floor plan generation uses a generative AI model (e.g., GPT-4o with structured prompts, or a fine-tuned architecture model).
- Platform language: English only for MVP.
- Hosting target: India region (AWS Mumbai / GCP Mumbai) for data residency.
