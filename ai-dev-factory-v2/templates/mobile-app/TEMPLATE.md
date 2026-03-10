# 📱 Mobile App Template

Use this for: iOS + Android apps built from one codebase. Social apps, fitness trackers, food delivery, marketplace, utility apps.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Flutter 3.x (iOS + Android) |
| Language | Dart |
| State | Riverpod 2.0 |
| Navigation | GoRouter |
| Backend | Firebase (quick) OR Node.js API (custom) |
| Database | Cloud Firestore OR PostgreSQL |
| Auth | Firebase Auth (Google, Apple, Email) |
| Push Notifications | Firebase Cloud Messaging |
| Analytics | Firebase Analytics |
| Crashes | Firebase Crashlytics |
| Payments | RevenueCat (in-app purchases) |
| Local Storage | Hive or SharedPreferences |

---

## 📁 Folder Structure

```
mobile-app/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart              ← MaterialApp + theme
│   │   ├── router.dart           ← GoRouter config
│   │   └── theme/
│   │       ├── colors.dart
│   │       ├── typography.dart
│   │       └── spacing.dart
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/             ← Firebase/API calls
│   │   │   ├── domain/           ← Business logic
│   │   │   ├── presentation/     ← Screens + widgets
│   │   │   └── providers/        ← Riverpod providers
│   │   │
│   │   ├── home/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   ├── presentation/
│   │   │   └── providers/
│   │   │
│   │   └── profile/
│   │       ├── data/
│   │       ├── domain/
│   │       ├── presentation/
│   │       └── providers/
│   │
│   ├── shared/
│   │   ├── widgets/              ← Reusable UI components
│   │   │   ├── app_button.dart
│   │   │   ├── app_text_field.dart
│   │   │   ├── loading_overlay.dart
│   │   │   └── error_view.dart
│   │   ├── services/
│   │   │   ├── api_service.dart
│   │   │   ├── auth_service.dart
│   │   │   └── storage_service.dart
│   │   ├── models/
│   │   └── utils/
│   │       ├── validators.dart
│   │       └── extensions.dart
│   │
│   └── core/
│       ├── constants.dart
│       ├── exceptions.dart
│       └── config.dart
│
├── android/
├── ios/
├── assets/
│   ├── images/
│   ├── icons/
│   └── animations/              ← Lottie files
│
├── pubspec.yaml
└── .env
```

---

## 📦 pubspec.yaml Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State management
  flutter_riverpod: ^2.4.0
  riverpod_annotation: ^2.3.0

  # Navigation
  go_router: ^13.0.0

  # Firebase
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.0
  firebase_messaging: ^14.7.0
  firebase_analytics: ^10.7.0
  firebase_crashlytics: ^3.4.0

  # Network
  dio: ^5.4.0
  retrofit: ^4.0.3

  # Local storage
  hive_flutter: ^1.1.0
  shared_preferences: ^2.2.2

  # UI
  cached_network_image: ^3.3.0
  lottie: ^3.0.0
  shimmer: ^3.0.0
  flutter_svg: ^2.0.9

  # Utils
  intl: ^0.19.0
  uuid: ^4.3.0
  logger: ^2.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.7
  riverpod_generator: ^2.3.9
  retrofit_generator: ^8.0.6
```

---

## 📱 Screens to Build

### Onboarding (first launch only)
- Slide 1: App value proposition
- Slide 2: Key feature highlight
- Slide 3: Get started CTA

### Auth Screens
- Welcome screen (Login / Register options)
- Email + Password login
- Register with name, email, password
- Forgot password
- Verify email

### Main App Screens
- Home / Feed
- Detail / Single item view
- Search / Explore
- Create / Add new item
- Profile / My account
- Settings
- Notifications

### Common Overlays
- Loading overlay
- Error bottom sheet
- Confirmation dialog
- Success animation screen

---

## 🎨 Design Standards

```dart
// Colors - define in colors.dart
static const primary = Color(0xFF6366F1);      // Indigo
static const primaryDark = Color(0xFF4F46E5);
static const surface = Color(0xFF1E1E2E);      // Dark surface
static const background = Color(0xFF13131F);   // Dark bg
static const text = Color(0xFFE2E8F0);
static const textMuted = Color(0xFF64748B);
static const success = Color(0xFF10B981);
static const error = Color(0xFFEF4444);

// Typography
// Display: 32sp bold
// Heading: 24sp semibold
// Body: 16sp regular
// Caption: 12sp regular

// Spacing: 4, 8, 12, 16, 24, 32, 48, 64
// Border radius: 8 (small), 12 (medium), 16 (large), 999 (pill)
```

---

## 🔔 Push Notification Topics

```
user_{userId}           ← personal notifications
all_users               ← broadcast announcements
promo                   ← promotional offers
```

---

## 🌍 Environment Config

```dart
// lib/core/config.dart
class AppConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:4000', // Android emulator localhost
  );
}
```

---

## 🚀 How to Use This Template

Tell your agents:
> "Use `templates/mobile-app/TEMPLATE.md` as the base. Build a [your idea] Flutter mobile app."
