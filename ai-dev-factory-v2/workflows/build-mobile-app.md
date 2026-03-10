# 📱 Workflow: Build Mobile App

Use this workflow when building Flutter iOS + Android apps.

---

## Trigger Prompt

```
Use the skill at agents/orchestrator/SKILL.md

I want to build a mobile app: [DESCRIBE YOUR IDEA]

Follow this workflow: workflows/build-mobile-app.md
Use this template: templates/mobile-app/TEMPLATE.md

Start with the product-manager agent.
```

---

## Agent Execution Order

### Step 1 — Product Manager
Produce: `docs/prd.md`, `docs/features.md`, screen list
**→ USER APPROVES**

### Step 2 — Architect
Read: prd.md + mobile-app template
Produce: architecture (Flutter + Firebase/Node.js), folder structure

### Step 3 — Designer
Produce: Material 3 design system, all screen wireframes, navigation flow diagram

### Step 4 — Database
Firebase Firestore schema OR PostgreSQL + Prisma (if custom backend)

### Step 5 — Backend
Firebase setup OR custom Node.js API (based on architecture)

### Step 6 — Frontend (Flutter)
Build all screens following design wireframes
Use Riverpod + GoRouter

### Step 7 — Integrations
FCM push notifications, Firebase Auth, RevenueCat (payments), Analytics

### Step 8 — Security
Auth flow audit, API key security, data validation

### Step 9 — QA
Test on Android emulator + iOS simulator
Test all screen sizes + orientations
Test offline behavior

### Step 10 — Performance
App startup time < 2s
Smooth 60fps animations
APK size < 50MB

### Step 11 — DevOps
GitHub Actions: lint → test → build APK + IPA
App Store + Play Store submission checklist

### Step 12 — Reflection
Final review + README

---

## Mobile-Specific Checklist
- [ ] Works offline (basic functionality)
- [ ] Handles no internet gracefully
- [ ] Back button behavior correct (Android)
- [ ] Safe area insets (iPhone notch)
- [ ] Both portrait and landscape tested
- [ ] Dark mode implemented
- [ ] Push notifications working
- [ ] App icon and splash screen done
- [ ] Privacy policy URL added (required for stores)
