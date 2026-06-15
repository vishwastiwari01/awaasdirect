# Product Requirements Document (PRD)
# My Awaas — India's Direct Property Marketplace

**Version:** 1.0  
**Date:** June 2026  
**Status:** MVP Active  

---

## 1. Product Overview

**My Awaas** is an Indian real-estate marketplace that connects property **owners** directly with **buyers and renters**, eliminating middlemen (brokers). The platform operates on a zero-commission model and focuses on trust, RERA compliance, and Aadhaar-based verification.

### 1.1 Mission
> "Every Indian deserves to find their home directly — without paying lakhs in brokerage."

### 1.2 Target Users
| Persona | Description |
|---|---|
| **Buyer/Renter** | Individuals searching for a home to buy or rent in Indian cities |
| **Owner** | Property owners wanting to list and sell/rent their homes without brokers |
| **Admin** | Internal team managing RERA verification and content moderation |

---

## 2. MVP Scope (v1.0)

### 2.1 In Scope ✅
- **Authentication:** Phone + Password login & registration (OTP planned for v1.1)
- **Property Listings:** Create, view, edit, delete listings (OWNER role)
- **Property Search:** Filter by city, type (Buy/Rent), BHK, price range
- **Property Detail Page:** Photo gallery, specs, owner contact via chat
- **Direct Chat:** Buyer ↔ Owner in-app messaging (real-time via Socket.io)
- **Saved Properties:** Wishlist / bookmarking for buyers
- **Owner Dashboard:** Manage active listings and view inquiries
- **Mobile Responsive:** Full functionality on mobile browsers
- **Security:** Rate limiting, JWT auth, Helmet, CORS, input validation

### 2.2 Out of Scope (Future)
- OTP / Aadhaar KYC
- AI Floor Plan Generator
- 3D Virtual Tours
- Mobile App (React Native — planned)
- EMI Calculator
- Price Trend Analytics
- Push Notifications

---

## 3. Feature Requirements

### 3.1 Authentication
- User registers with: Name, Phone (10-digit), Password, Role (BUYER or OWNER)
- Phone number is hashed (SHA-256) before storage — never stored plain
- JWT Access Token (15 min) + Refresh Token (7 days)
- All auth endpoints protected by strict rate limiter (5 req / 15 min per IP)
- Passwords hashed with bcrypt (10 rounds)

### 3.2 Property Listings
- Fields: Title, Description, Type (Apartment/Villa/House/Plot/PG/Commercial), Transaction (Sale/Rent), City, Locality, BHK, Sqft, Price, Furnishing, Facing, Available From
- Up to 10 photos per listing (S3 storage)
- Status: ACTIVE, UNDER_REVIEW, SOLD, RENTED, DEACTIVATED
- Full-text search via PostgreSQL tsvector

### 3.3 Search & Filters
- Transaction Type: Buy / Rent
- City (text search)
- Property Type
- BHK
- Price range (min / max)
- Keyword / locality search
- Sort by: Newest, Price (asc/desc)

### 3.4 Chat
- One conversation thread per buyer-property pair
- Real-time messages via Socket.io WebSocket
- Owner can choose to share phone number in chat
- Unread message tracking

### 3.5 Security
- Helmet.js (HTTP security headers)
- CORS locked to frontend domain only
- Global rate limit: 100 req / 15 min per IP
- Auth rate limit: 5 req / 15 min per IP
- Zod input validation on all API endpoints
- JWT with strong secrets (32+ characters)
- SQL injection impossible via Prisma ORM parameterized queries

---

## 4. Success Metrics (MVP)
| Metric | Target |
|---|---|
| Properties listed | 50+ in first month |
| Registered users | 100+ |
| Daily active users | 20+ |
| Avg. page load time | < 2 seconds |
| Uptime | 99%+ |

---

## 5. Platforms
- **Web:** Next.js 14 (Vercel) — primary
- **Mobile App:** Planned (React Native — v2.0)

---

## 6. Non-Functional Requirements
- GDPR/DPDP Act compliant (no plain personal data stored)
- RERA badge displayed on verified properties
- Zero broker commission model
- All passwords and phones hashed at rest
