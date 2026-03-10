# 🛒 E-Commerce Store Template

Use this for: online shops, marketplaces, digital product stores, subscription boxes, dropshipping stores.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript |
| Styling | Tailwind CSS + ShadCN |
| Backend | Next.js API routes (simple) OR Node.js (complex) |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| Payments | Stripe (one-time + subscriptions) |
| Images | Cloudinary (product photos) |
| Search | Algolia OR pg full-text search |
| Email | Resend (order confirmations) |
| Deploy | Vercel |

---

## 📁 Folder Structure

```
ecommerce/
├── app/
│   ├── (store)/
│   │   ├── page.tsx              ← Homepage / featured products
│   │   ├── products/
│   │   │   ├── page.tsx          ← Product listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx      ← Product detail
│   │   ├── categories/
│   │   │   └── [category]/
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── order-confirmation/
│   │
│   ├── (account)/
│   │   ├── account/
│   │   │   ├── page.tsx          ← Profile
│   │   │   └── orders/
│   │   │       └── page.tsx      ← Order history
│   │   └── wishlist/
│   │
│   └── api/
│       ├── products/
│       ├── cart/
│       ├── orders/
│       └── stripe/
│           └── webhook/
│
├── components/
│   ├── store/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImages.tsx     ← Image gallery
│   │   ├── ProductVariants.tsx   ← Size/color selector
│   │   ├── AddToCartButton.tsx
│   │   ├── CartDrawer.tsx        ← Slide-out cart
│   │   ├── CartItem.tsx
│   │   └── CheckoutForm.tsx
│   └── layout/
│       ├── StoreNavbar.tsx
│       └── Footer.tsx
│
└── lib/
    ├── cart.ts                   ← Cart state (Zustand)
    ├── stripe.ts
    └── cloudinary.ts
```

---

## 🗄️ Database Schema

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  price       Int      ← store in cents (e.g., 2999 = $29.99)
  compareAt   Int?     ← original price for sale display
  images      String[]
  category    String
  tags        String[]
  inStock     Boolean  @default(true)
  inventory   Int      @default(0)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  variants    ProductVariant[]
  orderItems  OrderItem[]
}

model ProductVariant {
  id        String  @id @default(cuid())
  productId String
  name      String  ← e.g., "Size", "Color"
  value     String  ← e.g., "L", "Red"
  price     Int?    ← override price if different
  inventory Int     @default(0)

  product   Product @relation(fields: [productId], references: [id])
}

model Order {
  id              String      @id @default(cuid())
  userId          String?
  email           String
  status          OrderStatus @default(PENDING)
  total           Int         ← in cents
  stripePaymentId String?
  shippingAddress Json
  createdAt       DateTime    @default(now())

  user            User?       @relation(fields: [userId], references: [id])
  items           OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  name      String  ← snapshot at time of purchase
  price     Int
  quantity  Int
  image     String?

  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

enum OrderStatus { PENDING PAID SHIPPED DELIVERED CANCELLED REFUNDED }
```

---

## 🛒 Cart (Zustand — client-side)

```typescript
// lib/cart.ts
interface CartItem {
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}
```

---

## 💳 Stripe Checkout Flow

```
1. User clicks "Checkout"
2. POST /api/stripe/create-checkout-session
   → Create Stripe session with line items
   → Return session URL
3. Redirect to Stripe hosted checkout
4. Stripe redirects to /order-confirmation?session_id=xxx
5. Stripe sends webhook to /api/stripe/webhook
   → payment_intent.succeeded
   → Create order in database
   → Send confirmation email
   → Update inventory
```

---

## 📧 Email Templates (Resend)

- **Order Confirmation** — order summary, items, total, delivery estimate
- **Shipping Update** — tracking link
- **Delivery Confirmation** — thank you + review request
- **Abandoned Cart** — reminder after 1 hour (optional)

---

## 🌍 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 How to Use This Template

Tell your agents:
> "Use `templates/ecommerce/TEMPLATE.md` as the base. Build an online store that sells [your products]."
