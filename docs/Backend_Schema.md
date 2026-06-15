# Backend Schema Document
# My Awaas — Database Design

**Database:** PostgreSQL 15 (Supabase)  
**ORM:** Prisma 5  
**Version:** 1.0 | June 2026

---

## 1. Schema Overview

```
users
  ├── properties (ownerId → users.id)
  │     ├── property_photos
  │     ├── property_verifications
  │     ├── virtual_tours
  │     ├── conversations
  │     │     └── messages
  │     ├── saved_properties
  │     ├── ai_plan_requests
  │     └── reports (targetPropertyId)
  └── reports (reporterId / targetUserId)
```

---

## 2. Enums

### Role
```
BUYER   — Can search and contact owners
OWNER   — Can list and manage properties
ADMIN   — Internal moderation (future)
```

### PropertyType
```
APARTMENT | VILLA | INDEPENDENT_HOUSE | PLOT | COMMERCIAL | PG
```

### TransactionType
```
SALE | RENT
```

### FurnishingStatus
```
UNFURNISHED | SEMI_FURNISHED | FULLY_FURNISHED
```

### PropertyStatus
```
ACTIVE      — Visible on platform
SOLD        — Owner marked as sold
RENTED      — Owner marked as rented
UNDER_REVIEW — Admin reviewing
DEACTIVATED — Hidden by owner
```

### VerificationStatus
```
PENDING | VERIFIED | REJECTED
```

---

## 3. Tables

### 3.1 `users`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| email | String? | Optional, unique |
| name | String? | Display name |
| phone | String | SHA-256 hash of raw phone — UNIQUE |
| phoneHash | String | Same SHA-256 hash — UNIQUE (for lookups) |
| passwordHash | String? | bcrypt hash — null = OTP-only (future) |
| image | String? | S3 URL of profile photo |
| role | Role | BUYER / OWNER / ADMIN |
| isActive | Boolean | Soft disable account |
| lastLoginAt | DateTime? | Last login timestamp |
| aadhaarVerified | Boolean | KYC status |
| aadhaarHash | String? | SHA-256 of Aadhaar number |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |
| deletedAt | DateTime? | Soft delete |

**Indexes:** role, aadhaarVerified, isActive, deletedAt

---

### 3.2 `properties`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| title | String | Listing headline |
| description | String? | Full description |
| type | PropertyType | Apartment / Villa etc. |
| transactionType | TransactionType | SALE / RENT |
| status | PropertyStatus | Default: ACTIVE |
| city | String | e.g., "Bangalore" |
| locality | String | e.g., "Whitefield" |
| address | String? | Full address (shown after chat) |
| latitude | Float? | For map display |
| longitude | Float? | For map display |
| bhk | Int? | Bedrooms (null for plots) |
| sqft | Float | Built-up area |
| plotLength | Float? | For plots (ft) |
| plotWidth | Float? | For plots (ft) |
| floors | Int? | Number of floors |
| facing | String? | North / East / etc. |
| furnishing | FurnishingStatus | Default: UNFURNISHED |
| availableFrom | DateTime? | Move-in date |
| price | Float | Sale price or monthly rent (INR) |
| priceNegotiable | Boolean | Default: false |
| maintenanceCharge | Float? | Monthly maintenance (rent) |
| deposit | Float? | Security deposit (rent) |
| viewCount | Int | Default: 0 (incremented on each view) |
| searchVector | tsvector? | PostgreSQL FTS — managed by DB trigger |
| ownerId | String | FK → users.id |
| deletedAt | DateTime? | Soft delete |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Indexes:** ownerId, city, locality, type, transactionType, status, bhk, price, deletedAt, createdAt  
**Composite index:** (city, transactionType, type) — most common search combo  
**GIN index:** searchVector — full-text search

---

### 3.3 `property_photos`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| url | String | Public/CDN URL |
| s3Key | String | S3 object key (for deletion) — UNIQUE |
| isCover | Boolean | Default: false (cover image) |
| sortOrder | Int | Display ordering |
| propertyId | String | FK → properties.id (CASCADE delete) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

---

### 3.4 `property_verifications`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| reraNumber | String? | RERA registration number |
| reraState | String? | State of RERA registration |
| reraStatus | VerificationStatus | Default: PENDING |
| reraVerifiedAt | DateTime? | When RERA was confirmed |
| aadhaarLinked | Boolean | Owner Aadhaar linked to property |
| aadhaarLinkedAt | DateTime? | When linked |
| reviewedById | String? | Admin userId who reviewed |
| reviewNotes | String? | Admin notes |
| propertyId | String | FK → properties.id — UNIQUE (one per property) |

---

### 3.5 `conversations`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| buyerId | String | FK → users.id |
| propertyId | String | FK → properties.id |
| phoneSharedByOwner | Boolean | Owner shared phone in this thread |
| phoneSharedAt | DateTime? | When phone was shared |
| buyerLastReadAt | DateTime? | For unread tracking |
| ownerLastReadAt | DateTime? | For unread tracking |
| deletedAt | DateTime? | Soft delete |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Unique constraint:** (buyerId, propertyId) — one conversation per buyer per property

---

### 3.6 `messages`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| content | String | Message text |
| type | MessageType | TEXT / SYSTEM |
| readAt | DateTime? | When read by recipient |
| conversationId | String | FK → conversations.id (CASCADE) |
| senderId | String | FK → users.id |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Composite index:** (conversationId, createdAt) — paginated history queries

---

### 3.7 `saved_properties`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| userId | String | FK → users.id (CASCADE) |
| propertyId | String | FK → properties.id (CASCADE) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Unique constraint:** (userId, propertyId) — one save per user per property

---

### 3.8 `reports`
| Column | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| reason | String | Report reason text |
| notes | String? | Additional details |
| resolved | Boolean | Admin resolved |
| resolvedAt | DateTime? | When resolved |
| resolvedById | String? | Admin who resolved |
| reporterId | String | FK → users.id |
| targetPropertyId | String? | Polymorphic — property being reported |
| targetUserId | String? | Polymorphic — user being reported |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

---

## 4. Key Relationships Summary

```
User (OWNER) → [1:many] → Property
Property → [1:many] → PropertyPhoto
Property → [1:1]   → PropertyVerification
Property → [1:1]   → VirtualTour
Property + User(BUYER) → [1:1] → Conversation → [1:many] → Message
User → [1:many] → SavedProperty ← [many:1] → Property
User → [1:many] → Report (as reporter)
Property → [1:many] → Report (as target)
```

---

## 5. Important Design Decisions

### 5.1 Phone Privacy
Raw phone numbers are **never stored**. On registration:
1. SHA-256 hash of the phone is computed in the service layer
2. Both `phone` and `phoneHash` columns store this hash (phoneHash for explicit lookup queries)
3. This prevents data breaches exposing user phone numbers

### 5.2 Soft Deletes
`users` and `properties` use `deletedAt` for soft deletion:
- Preserves referential integrity for messages and reports
- Allows admin recovery of accidentally deleted listings
- Filter with `WHERE deletedAt IS NULL` in all queries

### 5.3 Full-Text Search
The `searchVector` column on `properties` is a PostgreSQL `tsvector` type managed by a **database trigger** (not Prisma). It is populated from title + description + city + locality and enables fast keyword search via GIN index.

### 5.4 Conversation Uniqueness
Only one conversation is allowed per (buyer, property) pair (`@@unique([buyerId, propertyId])`). If a buyer contacts the same owner about the same property again, the existing thread is reopened.
