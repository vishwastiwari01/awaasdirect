# UI/UX Design System
# My Awaas — Design Language

**Version:** 1.0 | June 2026

---

## 1. Brand Identity

### 1.1 Brand Name
**My Awaas** — Personal, warm, inclusive. "Awaas" is the Hindi word for "home/dwelling".

### 1.2 Brand Personality
- **Trustworthy** — Clean, professional, not flashy
- **Indian** — Designed for Indian context (rupees, Indian cities, etc.)
- **Direct** — Simple, no-nonsense UI. Zero broker = zero fluff.
- **Modern** — Contemporary design, smooth interactions

---

## 2. Color Palette

### Primary
| Name | Hex | Usage |
|---|---|---|
| Forest Green | `#1B4332` | Primary CTA buttons, nav active, brand color |
| Light Green | `#2D6A4F` | Hover state for primary |
| Mint | `#52B788` | Accent, links, highlights |
| Pale Green | `#D8F3DC` | Tag backgrounds, badges |

### Accent
| Name | Hex | Usage |
|---|---|---|
| Terracotta | `#E07B39` | Secondary CTA, logo accent, warm highlight |
| Gold | `#F0A500` | Premium / featured badges |

### Neutrals
| Name | Hex | Usage |
|---|---|---|
| Dark BG | `#0A0F1A` | Hero section background |
| Near-Black | `#1A1A1A` | Footer background |
| Gray-900 | `#111827` | Body text |
| Gray-600 | `#4B5563` | Secondary text |
| Gray-400 | `#9CA3AF` | Placeholder text |
| Gray-100 | `#F3F4F6` | Input backgrounds |
| White | `#FFFFFF` | Cards, nav background |

---

## 3. Typography

### Font Families
| Role | Font | Import |
|---|---|---|
| Display / Headings | Playfair Display | Google Fonts |
| Body / UI | DM Sans | Google Fonts |

### Scale
| Token | Size | Weight | Usage |
|---|---|---|---|
| `text-xs` | 12px | 500 | Labels, badges |
| `text-sm` | 14px | 400/600 | Body, nav links |
| `text-base` | 16px | 400 | Default body |
| `text-lg` | 18px | 600 | Section intros |
| `text-xl` | 20px | 700 | Card titles |
| `text-2xl` | 24px | 700 | Section headings |
| `clamp(42px, 8vw, 80px)` | Fluid | 700 | Hero H1 |

---

## 4. Component Patterns

### 4.1 Buttons
```
Primary CTA:
  bg-[#1B4332] text-white px-6 py-3 rounded-xl font-semibold text-sm
  hover: bg-[#2D6A4F] shadow-lg
  transition: all 200ms

Secondary / Outlined:
  border-2 border-[#1B4332] text-[#1B4332] px-6 py-3 rounded-xl
  hover: bg-[#1B4332] text-white
```

### 4.2 Input Fields
```
bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm
focus: border-[#1B4332] bg-white outline-none
placeholder: text-gray-400
transition: all 200ms
```

### 4.3 Property Cards
```
bg-white rounded-2xl overflow-hidden shadow-sm
hover: shadow-lg translateY(-2px)
transition: all 300ms

  ┌─ Cover photo (aspect-ratio: 4/3)
  │   └─ Status badge (top-left)
  │   └─ Save button (top-right, heart icon)
  ├─ Content padding: p-4
  │   ├─ Price (bold, large, green)
  │   ├─ Title
  │   ├─ Location (MapPin icon + city, locality)
  │   └─ Specs row (BHK · Sqft · Type)
```

### 4.4 Navbar
```
Fixed top, full-width
Height: 64px (h-16)
Scroll: bg-white/95 backdrop-blur shadow-sm
Default: bg-white/80 backdrop-blur

Logo: website_logo.png (h-9, w-auto, object-contain)
Nav links: text-sm font-medium text-gray-600 hover:text-[#1B4332]
CTA: Primary button + Outlined button

Mobile: Hamburger menu (Menu/X icon from lucide-react)
  → Full-width dropdown with all links + auth actions
```

### 4.5 Footer
```
bg-[#1A1A1A] text-white/60
4-column grid on desktop (lg:grid-cols-4)
2-column grid on tablet (sm:grid-cols-2)
1-column stacked on mobile

Brand column: Logo + tagline + compliance badges (RERA, AADHAAR, DPDP, ISO)
Link columns: Discover, AI Tools, Company
Bottom bar: Copyright + legal links
```

---

## 5. Responsive Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Usage |
|---|---|---|
| `sm` | 640px | Mobile landscape, small tablets |
| `md` | 768px | Tablets — nav switches to desktop |
| `lg` | 1024px | Desktop grid layouts |
| `xl` | 1280px | Wide layouts, max-w-7xl containers |

### Mobile-First Rules
- All layouts are `flex-col` by default, `md:flex-row` or `lg:grid-cols-*` on larger screens
- Navbar hamburger shows on `< md`, desktop nav shows on `md:`
- Property grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Footer: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Hero padding: `px-6` on mobile, `px-12` on desktop

---

## 6. Animation & Interaction

### Micro-animations
```css
/* Pulse for hero background orbs */
animation: pulse 8s infinite ease-in-out

/* Card hover */
transform: translateY(-2px);
box-shadow: 0 10px 40px rgba(0,0,0,0.12);

/* Button hover */
transition: all 200ms;

/* Nav color transition */
transition: background 300ms, box-shadow 300ms;
```

### Loading States
- Skeleton loaders on property cards (gray animated pulse)
- Spinner on form submissions
- Optimistic updates on save/unsave

---

## 7. Icons
**Library:** Lucide React  
**Common icons used:**
- `MapPin` — Location
- `Search` — Search bar
- `Menu` / `X` — Mobile nav
- `Heart` / `HeartFilled` — Save/unsave
- `ChevronDown` — Dropdowns
- `MessageCircle` — Chat
- `Home` — Favicon/icon fallback

---

## 8. Logo Usage

### Primary Logo
- File: `public/website_logo.png`
- Usage: Navbar, email templates
- Height: `h-9` (36px), width auto
- Do not distort or change colors

### Icon / Favicon
- File: `public/icon.png`
- Usage: Browser tab (favicon), Apple touch icon, app icon
- Configured in `app/layout.tsx` via Next.js `metadata.icons`

---

## 9. Page Layout Templates

### Standard Page
```
<Navbar />            ← fixed, 64px
<main>
  <HeroSection />     ← 100vh with search
  <Section />         ← max-w-7xl mx-auto px-6 lg:px-12
  ...
</main>
<Footer />
```

### Dashboard / Auth Pages
```
<Navbar />
<main className="min-h-screen pt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {content}
  </div>
</main>
<Footer />
```
