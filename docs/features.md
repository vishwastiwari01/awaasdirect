# Feature List — AwaasDirect

---

## Must Have (MVP — v1.0)

### AUTH & IDENTITY
- **Aadhaar OTP Verification**: Users verify identity via Aadhaar OTP (DigiLocker API). Unverified users can browse but cannot list or contact owners.
- **Phone + OTP Registration**: Quick sign-up using mobile number; full Aadhaar KYC required before listing or chatting.
- **User Profile**: Display name, verified badge, city, and number of active listings.

### PROPERTY LISTING (OWNER)
- **Create Listing**: Owner fills in — property type (flat/house/plot), transaction type (sale/rent), city, locality, floor, BHK, area (sq ft), price/rent, furnishing status, availability date, description, and RERA number.
- **Photo Upload**: Upload up to 20 photos per listing (min 3 required); automatically compressed and stored.
- **RERA Number Entry & Format Validation**: Owner enters RERA registration number; system validates format against state-specific RERA number patterns and displays "RERA Verified" badge if valid.
- **Edit / Deactivate Listing**: Owner can update listing details or mark as "Sold / Rented" to remove from search.
- **Owner Dashboard**: View listing status, total views, total chat inquiries per listing.

### PROPERTY SEARCH & DISCOVERY (BUYER)
- **Keyword + City Search**: Full-text search by locality, landmark, or city.
- **Filter Panel**: Filter by — transaction type (buy/rent), property type (flat/house/plot), BHK (1/2/3/4+), price range (slider), area range, furnishing (furnished/semi/unfurnished), availability, verified only toggle.
- **Search Results Grid**: Tile view with photo, price, BHK, locality, area, verified badge, and "Virtual Tour" badge where available.
- **Property Detail Page**: Full gallery, all listing details, floor plan (if AI-generated), virtual tour embed, owner verified badge, and "Chat with Owner" CTA.
- **Save / Shortlist**: Buyers can bookmark properties into a private saved list.

### AI VIRTUAL TOUR
- **3D Tour Generation**: After listing is created, owner can trigger AI virtual tour generation from uploaded photos. System sends photos to AI pipeline (third-party API); renders an embeddable navigable 3D tour within 10–20 minutes.
- **Tour Embed on Listing**: Completed tours appear as an interactive iframe on the property detail page.
- **Generation Status Indicator**: Owner dashboard shows "Processing" / "Ready" status for virtual tour.

### AI FLOOR PLAN GENERATOR (PLOTS ONLY)
- **Plot Floor Plan Request**: On the detail page of a plot listing, buyers can enter plot dimensions (length × width in feet), number of floors desired, and preferred room count/type.
- **AI-Generated Floor Plan**: System sends structured prompt to generative AI model; returns a 2D floor plan image (SVG or PNG) with labeled rooms and dimensions.
- **Download Floor Plan**: Buyer can download the generated floor plan as PDF/PNG.
- **Regenerate**: Buyer can modify inputs and regenerate up to 3 times per plot per session.

### DIRECT OWNER–BUYER CHAT
- **Initiate Chat**: Verified buyers click "Chat with Owner" on any listing; creates a private chat thread.
- **Real-Time Messaging**: In-app chat with text messages; timestamps shown.
- **Phone Number Gating**: Owner phone number is hidden by default; owner can choose to share number within chat.
- **Chat Notifications**: Email notification (and in-app badge) when a new message arrives.
- **Report / Block**: Either party can report or block the other within the chat.

---

## Should Have (v1.1)

- **Hindi Language UI**: Full UI translation to Hindi; language toggle in header.
- **Saved Search + Email Alerts**: Buyers save a search query; get email when new matching listings are added.
- **RERA API Integration**: Live lookup against state RERA portals (starting with Maharashtra MahaRERA, then Karnataka, Delhi NCR) to auto-confirm RERA status.
- **Owner Response Rate Badge**: Show average response time for each owner (calculated from chat data).
- **Listing Boost (Paid)**: Owners pay a small fee to feature their listing at the top of search results.
- **Video Upload**: Owners upload property walkthrough video (up to 3 min, max 500 MB) as supplement to AI tour.
- **Map View**: Search results overlaid on Google Maps / MapMyIndia; cluster pins by locality.
- **Multiple Contact Methods**: In addition to chat, allow buyers to schedule a visit (calendar invite) directly from the listing.
- **Basic Analytics for Owners**: Listing view count, unique visitor count, chat conversion rate.

---

## Nice to Have (v2.0 / Future)

- **Native iOS & Android Apps**: React Native or Flutter mobile app.
- **AI Price Estimator**: AI-predicted fair market value for a property based on location, size, and comps.
- **Virtual Staging**: AI furnishes empty-room photos to show potential interior styles.
- **Home Loan Partner Integration**: Show EMI calculator with partner NBFC/bank loan options.
- **Legal Document Assistant**: AI-assisted draft of sale agreement / rent agreement; e-stamp via partner.
- **Broker Accounts (Managed)**: Allow verified brokers to list under a "broker" badge — separate from owner listings, with broker-only fee; community-voted feature.
- **Society / Apartment Community Portal**: Resident association listings, maintenance, and visitor management.
- **NRI-Specific Dashboard**: Currency converter, NRO/NRE investment guidance, legal NRI property buying checklist.
- **AI Chatbot (WhatsApp)**: Allow owners and buyers to manage listings and chats via WhatsApp Business API.
- **Review & Rating System**: Post-transaction ratings for owners and buyers.
