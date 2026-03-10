# AwaasDirect — Database Diagram

> **Stack**: PostgreSQL 15 · Prisma 5 · Generated: March 2026

---

## Entity Relationship Diagram

```mermaid
erDiagram

    User {
        String id PK
        String email UK
        String name
        String phone UK
        String phoneHash UK
        String passwordHash
        String image
        Role role
        Boolean isActive
        Boolean aadhaarVerified
        String aadhaarHash UK
        DateTime lastLoginAt
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt
    }

    Property {
        String id PK
        String title
        String description
        PropertyType type
        TransactionType transactionType
        PropertyStatus status
        String city
        String locality
        String address
        Float latitude
        Float longitude
        Int bhk
        Float sqft
        Float plotLength
        Float plotWidth
        Int floors
        String facing
        FurnishingStatus furnishing
        DateTime availableFrom
        Float price
        Boolean priceNegotiable
        Float maintenanceCharge
        Float deposit
        Int viewCount
        String ownerId FK
        DateTime createdAt
        DateTime updatedAt
        DateTime deletedAt
    }

    PropertyPhoto {
        String id PK
        String url
        String s3Key UK
        Boolean isCover
        Int sortOrder
        String propertyId FK
        DateTime createdAt
        DateTime updatedAt
    }

    PropertyVerification {
        String id PK
        String reraNumber
        String reraState
        VerificationStatus reraStatus
        DateTime reraVerifiedAt
        Boolean aadhaarLinked
        DateTime aadhaarLinkedAt
        String reviewedById
        String reviewNotes
        String propertyId FK_UK
        DateTime createdAt
        DateTime updatedAt
    }

    VirtualTour {
        String id PK
        VirtualTourStatus status
        String embedUrl
        String kuulaJobId
        DateTime triggeredAt
        DateTime completedAt
        String failureReason
        String propertyId FK_UK
        DateTime createdAt
        DateTime updatedAt
    }

    SavedProperty {
        String id PK
        String userId FK
        String propertyId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Conversation {
        String id PK
        String buyerId FK
        String propertyId FK
        Boolean phoneSharedByOwner
        DateTime phoneSharedAt
        DateTime buyerLastReadAt
        DateTime ownerLastReadAt
        DateTime deletedAt
        DateTime createdAt
        DateTime updatedAt
    }

    Message {
        String id PK
        String content
        MessageType type
        DateTime readAt
        String conversationId FK
        String senderId FK
        DateTime createdAt
        DateTime updatedAt
    }

    AIPlanRequest {
        String id PK
        FloorPlanStatus status
        Float plotLength
        Float plotWidth
        Int floors
        Json roomPrefs
        String stylePrefs
        Json layoutJson
        String floorPlanUrl
        String s3Key
        String errorMessage
        Int generationMs
        String requesterId FK
        String propertyId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Report {
        String id PK
        String reason
        String notes
        Boolean resolved
        DateTime resolvedAt
        String resolvedById
        String reporterId FK
        String targetPropertyId FK
        String targetUserId FK
        DateTime createdAt
        DateTime updatedAt
    }

    %% ─── Relationships ────────────────────────────────────
    User ||--o{ Property          : "owns"
    User ||--o{ SavedProperty     : "saves"
    User ||--o{ Conversation       : "initiates as buyer"
    User ||--o{ Message           : "sends"
    User ||--o{ AIPlanRequest     : "requests"
    User ||--o{ Report            : "files"
    User ||--o{ Report            : "is reported in"

    Property ||--o{ PropertyPhoto       : "has photos"
    Property ||--o|  PropertyVerification : "has verification"
    Property ||--o|  VirtualTour         : "has virtual tour"
    Property ||--o{ SavedProperty        : "is saved by"
    Property ||--o{ Conversation         : "has conversations"
    Property ||--o{ AIPlanRequest        : "has floor plan requests"
    Property ||--o{ Report               : "is reported in"

    Conversation ||--o{ Message : "contains"
```

---

## Table Reference

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| `users` | Platform users (buyers, owners, admins). Stores hashed phone + Aadhaar for privacy. | `phone` (UK), `aadhaarHash` (UK), `role`, `isActive` |
| `properties` | Core listing entity. Covers all property types — apartments, villas, plots. | `ownerId`, `city`, `transactionType`, `type`, `bhk`, `price`, `status`, GIN FTS on `searchVector` |
| `property_photos` | Up to 20 S3 photos per listing. `isCover` marks the thumbnail. | `propertyId`, `(propertyId, isCover)` |
| `property_verifications` | One-to-one: RERA registration + Aadhaar linkage status for a property. | `propertyId` (UK), `reraStatus`, `aadhaarLinked` |
| `virtual_tours` | One-to-one: Kuula 360° tour job state + embed URL. | `propertyId` (UK), `status` |
| `saved_properties` | Buyer wishlist. Unique constraint prevents duplicate saves. | `userId`, `propertyId`, `(userId, propertyId)` (UK) |
| `conversations` | One thread per (buyer, property) pair. Tracks phone-share consent and read timestamps. | `buyerId`, `propertyId`, `(buyerId, propertyId)` (UK) |
| `messages` | Individual chat messages within a conversation. Indexed for paginated history. | `conversationId`, `senderId`, `(conversationId, createdAt)` |
| `ai_plan_requests` | Floor plan generation jobs (GPT-4o + DALL·E 3). Rate limit enforced via `(requesterId, propertyId, createdAt)`. | `requesterId`, `propertyId`, `status` |
| `reports` | Polymorphic reports; `targetPropertyId` **or** `targetUserId` is set (not both). | `reporterId`, `targetPropertyId`, `targetUserId`, `resolved` |

---

## Enums

| Enum | Values |
|------|--------|
| `Role` | `BUYER`, `OWNER`, `ADMIN` |
| `PropertyType` | `APARTMENT`, `VILLA`, `INDEPENDENT_HOUSE`, `PLOT`, `COMMERCIAL`, `PG` |
| `TransactionType` | `SALE`, `RENT` |
| `FurnishingStatus` | `UNFURNISHED`, `SEMI_FURNISHED`, `FULLY_FURNISHED` |
| `PropertyStatus` | `ACTIVE`, `SOLD`, `RENTED`, `UNDER_REVIEW`, `DEACTIVATED` |
| `VerificationStatus` | `PENDING`, `VERIFIED`, `REJECTED` |
| `VirtualTourStatus` | `NOT_STARTED`, `PROCESSING`, `READY`, `FAILED` |
| `FloorPlanStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `MessageType` | `TEXT`, `SYSTEM` |

---

## Design Notes

### Privacy
- `phone` column stores **SHA-256 hash** of the raw phone number — never plaintext.
- `aadhaarHash` stores **SHA-256 of Aadhaar number** — compliant with UIDAI data policy.
- Phone number can be optionally shared by an owner in a `Conversation` (`phoneSharedByOwner = true`).

### Full-Text Search
- `properties.searchVector` is a PostgreSQL `tsvector` column populated by a DB trigger covering `title`, `locality`, `city`, and `description`.
- A **GIN index** (`property_fts_idx`) is created on this column for `@@ to_tsquery(...)` queries.
- Prisma uses `$queryRaw(Prisma.sql\`...\`)` to execute FTS searches.

### Soft Deletes
- `User.deletedAt` and `Property.deletedAt` — `NULL` = active, timestamp = soft-deleted.
- `Conversation.deletedAt` — used for archiving without purging message history.

### Rate Limiting (AI Plans)
- The composite index `(requesterId, propertyId, createdAt)` on `ai_plan_requests` supports the efficient count query that enforces the **3 generations per user per property per 24 h** limit.

### Report Polymorphism
- `Report` has two nullable FK columns: `targetPropertyId` and `targetUserId`.
- Application layer ensures exactly one is set; a `CHECK` constraint can be added via Prisma migration SQL if stricter enforcement is needed.
