# App Flow Document
# My Awaas — User Journey Maps

**Version:** 1.0 | June 2026

---

## 1. Buyer/Renter Flow

### 1.1 Homepage → Search → Contact Owner
```
[Home Page]
   │
   ├─ Search bar (city + type + budget) → [Properties Listing Page]
   │     │
   │     ├─ Apply filters (BHK, price, type)
   │     └─ Click property card → [Property Detail Page]
   │              │
   │              ├─ View photos, specs, location
   │              ├─ "Save" → adds to wishlist (requires login)
   │              └─ "Contact Owner" button
   │                        │
   │                        ├─ NOT logged in → redirect to [Login Page]
   │                        └─ Logged in → [Messages / Chat Page]
   │                                   └─ Send message → Owner receives in real-time
   │
   ├─ Navbar: "Rent" → /properties?transactionType=RENT
   └─ Navbar: "Buy" → /properties?transactionType=SALE
```

### 1.2 Registration Flow (New Buyer)
```
[Login Page]
   │
   └─ "Don't have an account? Register"
            │
            ▼
      [Register Page]
            │
            ├─ Fill: Name, Phone, Password, Role (select BUYER)
            ├─ Submit → POST /api/auth/register
            ├─ Success → auto-login → redirect to /properties
            └─ Error (duplicate phone) → show inline error
```

---

## 2. Owner Flow

### 2.1 Owner Registration & Listing
```
[Home Page / Navbar]
   │
   └─ "List Property Free" button
            │
            ├─ NOT logged in → [Login Page] → [Register Page]
            │        └─ Role: Select "OWNER"
            │
            └─ Logged in as OWNER → [List Property Page]
                     │
                     ├─ Fill details:
                     │    ├─ Title, Description
                     │    ├─ Type (Apartment / Villa / House / Plot / PG)
                     │    ├─ Transaction (Sale / Rent)
                     │    ├─ City, Locality
                     │    ├─ BHK, Sqft, Price
                     │    ├─ Furnishing, Facing, Available From
                     │    └─ Upload Photos (up to 10)
                     │
                     ├─ Submit → POST /api/properties
                     └─ Success → redirect to /dashboard
```

### 2.2 Owner Dashboard Flow
```
[Dashboard Page] (requires OWNER login)
   │
   ├─ View all active listings (cards with status badges)
   ├─ Click listing → edit or view inquiries
   ├─ Mark as SOLD / RENTED / DEACTIVATED
   └─ [Messages] → view all buyer conversations
```

### 2.3 Owner Responds to Buyer
```
[Messages Page]
   │
   ├─ See list of all conversations (per property per buyer)
   ├─ Open conversation → real-time chat
   └─ Optionally "Share my phone number" → buyer gets owner's phone
```

---

## 3. Authentication Flow

### 3.1 Login
```
POST /api/auth/login
   │
   ├─ Validate: phone + password (Zod)
   ├─ Rate limit: max 5 attempts per 15 min per IP
   ├─ Hash phone (SHA-256) → find user in DB
   ├─ bcrypt.compare(password, passwordHash)
   ├─ Generate: accessToken (15m) + refreshToken (7d)
   └─ Return: { user, accessToken, refreshToken }
```

### 3.2 Token Refresh
```
POST /api/auth/refresh
   │
   ├─ Validate refreshToken (JWT verify)
   ├─ Generate new accessToken
   └─ Return: { accessToken }
```

### 3.3 Protected Route Guard (Frontend)
```
useAuthStore (Zustand)
   │
   ├─ accessToken stored in memory (not localStorage)
   ├─ refreshToken stored in httpOnly cookie (planned v1.1)
   ├─ Axios interceptor → auto-refresh on 401
   └─ Redirect to /login if refresh also fails
```

---

## 4. Property Search Flow

```
GET /api/properties?transactionType=RENT&city=Bangalore&bhk=2&minPrice=10000&maxPrice=30000
   │
   ├─ Zod validates query params
   ├─ Prisma query with WHERE filters
   ├─ Full-text search on searchVector (tsvector) if `q` param present
   ├─ Pagination: page + limit (default: 20 per page)
   └─ Returns: { data: Property[], total, page, totalPages }
```

---

## 5. Real-Time Chat Flow

```
Frontend connects to Socket.io on page load (if authenticated)
   │
   ├─ Emits: auth token in handshake
   ├─ Server verifies JWT → associates socket with userId
   │
   ├─ Buyer opens chat → joins room: `conversation:{id}`
   ├─ Sends message → socket.emit('send_message', { conversationId, content })
   ├─ Server saves to DB → socket.to(room).emit('new_message', message)
   └─ Owner's client receives event → updates UI in real-time
```

---

## 6. Page Route Map

| URL | Page | Auth Required |
|---|---|---|
| `/` | Home (search + hero) | No |
| `/login` | Login | No (redirect if logged in) |
| `/register` | Register | No |
| `/properties` | Search results | No |
| `/properties/:id` | Property detail | No (chat requires auth) |
| `/saved` | Saved/wishlist | Yes (BUYER) |
| `/messages` | Chat inbox | Yes |
| `/dashboard` | Owner dashboard | Yes (OWNER) |
| `/dashboard/list-property` | Create listing | Yes (OWNER) |

---

## 7. Error States

| Scenario | Behavior |
|---|---|
| Token expired | Auto-refresh silently via interceptor |
| Refresh token invalid | Logout → redirect /login |
| Rate limited | Show "Too many attempts" toast |
| Property not found | 404 page |
| Network error | Retry toast with error message |
| Unauthorized action | 403 redirect |
