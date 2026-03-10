# 🌐 Landing Page Template

Use this for: startup websites, product launches, app landing pages, waitlists, marketing sites.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 OR plain HTML/CSS/JS |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form |
| Email collection | Resend OR Mailchimp |
| Analytics | Plausible OR Google Analytics |
| Deploy | Vercel (instant) |

---

## 📁 Folder Structure

```
landing-page/
├── app/
│   ├── page.tsx                  ← Main landing page
│   ├── layout.tsx
│   └── api/
│       └── waitlist/
│           └── route.ts          ← Email collection
│
├── components/
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   └── CTA.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
```

---

## 🏗️ Page Section Order (proven conversion structure)

```
1. NAVBAR
   Logo | Nav Links | CTA Button

2. HERO (above the fold — most important)
   - Headline: What it does in 1 sentence
   - Subheadline: Who it's for + key benefit
   - CTA Button (primary action)
   - Social proof: "Trusted by X+ users" or logo strip
   - Hero image / screenshot / animation

3. LOGO STRIP (social proof)
   "Trusted by teams at [Company logos]"

4. PROBLEM SECTION
   "The old way is broken..."
   Paint the pain points clearly

5. FEATURES (solution)
   3 or 6 feature cards with icons
   Focus on BENEFITS not just features

6. HOW IT WORKS
   3-step process: Step 1 → Step 2 → Step 3
   Simple, clear, visual

7. SCREENSHOTS / DEMO
   Product screenshots or embedded video

8. TESTIMONIALS
   3-5 quotes with name, title, company, avatar

9. PRICING
   3 tiers: Free/Starter | Pro | Enterprise
   Highlight the recommended tier

10. FAQ
    5-8 common questions answered

11. FINAL CTA
    Strong headline + button + subtext

12. FOOTER
    Links + social + copyright
```

---

## ✍️ Copywriting Formula

### Hero Headline Formula
```
[Verb] [outcome] [faster/easier/without pain]

Examples:
"Build production apps 10x faster"
"Launch your startup without writing backend code"
"Turn customer feedback into product decisions automatically"
```

### Feature Card Format
```
[Icon]
[Short bold title]
[1-2 sentence description focusing on the benefit to the user, not the feature itself]
```

### Testimonial Format
```
"[Specific result or outcome they got, not just 'great product']"
— [Name], [Title] at [Company]
```

---

## 🎨 Design Styles to Choose From

Pick ONE and go all in:

**Option A: Dark/Gradient (popular for tech/AI)**
- Dark background (#080810)
- Purple/cyan gradient accents
- Glassmorphism cards
- Glowing CTAs

**Option B: Clean Light (popular for B2B/SaaS)**
- White background
- Subtle gray sections
- Blue or indigo primary
- Clean, minimal, trustworthy

**Option C: Bold/Colorful (popular for consumer apps)**
- Bright accent color
- Bold typography
- Illustrated elements
- Energetic and fun

---

## 💡 Conversion Optimization Rules

- CTA button must appear at least 3 times (Hero, mid-page, bottom)
- Use action words: "Get Started Free", "Start Building", not just "Sign Up"
- Show pricing — hiding it increases bounce rate
- Add a free tier or free trial — lowers signup friction
- Mobile must look perfect — 60%+ of traffic is mobile
- Page must load under 2 seconds
- Add an exit-intent popup for email capture

---

## 🌍 Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=                    ← for waitlist emails
NEXT_PUBLIC_GA_ID=                 ← Google Analytics
```

---

## 🚀 How to Use This Template

Tell your agents:
> "Use `templates/landing-page/TEMPLATE.md` as the base. Build a landing page for [your product]. The target audience is [who]. The main value prop is [what it does]."
