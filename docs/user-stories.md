# User Stories — AwaasDirect MVP

**Actors**
- **Owner** — property owner seeking to list a property for sale or rent
- **Buyer** — person looking to buy or rent a property
- **System** — automated platform behaviour

---

## Authentication & Verification

| ID | Story |
|----|-------|
| AUTH-01 | As a **visitor**, I want to register using my mobile number so that I can create an account quickly. |
| AUTH-02 | As a **new user**, I want to verify my identity using my Aadhaar OTP so that I get a "Verified" badge and can list or contact owners. |
| AUTH-03 | As a **user**, I want to log in with my mobile number + OTP so that I don't need to remember a password. |
| AUTH-04 | As a **user**, I want to see my verification status on my profile so that I know whether I can list or chat. |
| AUTH-05 | As a **visitor**, I want to browse and search properties without registering so that I can decide whether the platform is useful before signing up. |

---

## Property Listing (Owner)

| ID | Story |
|----|-------|
| LIST-01 | As an **Owner**, I want to create a new property listing by filling in type, transaction type, city, locality, BHK, area, and price so that buyers can discover my property. |
| LIST-02 | As an **Owner**, I want to upload up to 20 photos for my listing so that buyers can see the property clearly. |
| LIST-03 | As an **Owner**, I want to enter my RERA registration number so that my listing shows a "RERA Verified" badge and buyers trust it more. |
| LIST-04 | As an **Owner**, I want to edit my listing at any time so that I can update price, description, or availability. |
| LIST-05 | As an **Owner**, I want to mark my listing as "Sold" or "Rented" so that buyers no longer inquire about a closed deal. |
| LIST-06 | As an **Owner**, I want to see a dashboard showing total views and chat inquiries per listing so that I know how my listing is performing. |
| LIST-07 | As an **Owner**, I want to list a plot for sale with its length and width dimensions so that buyers can generate AI floor plans for it. |

---

## Property Search & Discovery (Buyer)

| ID | Story |
|----|-------|
| SRCH-01 | As a **Buyer**, I want to search properties by city or locality so that I find properties near my preferred area. |
| SRCH-02 | As a **Buyer**, I want to filter results by transaction type (buy/rent), property type, BHK, price range, and furnishing so that I only see properties that match my needs. |
| SRCH-03 | As a **Buyer**, I want to toggle a "Verified Only" filter so that I see only Aadhaar-verified owner listings with RERA numbers. |
| SRCH-04 | As a **Buyer**, I want to see a property detail page with all photos, specs, floor plan, and virtual tour so that I can evaluate a property without visiting. |
| SRCH-05 | As a **Buyer**, I want to save/shortlist properties so that I can compare them later. |
| SRCH-06 | As a **Buyer**, I want to see a "Virtual Tour Available" badge on listings so that I can prioritise properties I can virtually walk through. |

---

## AI Virtual Tour

| ID | Story |
|----|-------|
| TOUR-01 | As an **Owner**, I want to trigger AI virtual tour generation from my uploaded photos so that buyers can explore my property in 3D without a physical visit. |
| TOUR-02 | As an **Owner**, I want to see the processing status of my virtual tour (Processing / Ready) on my dashboard so that I know when it's live. |
| TOUR-03 | As a **Buyer**, I want to interact with the 3D virtual tour directly on the listing page so that I can navigate through rooms as if I were physically there. |

---

## AI Floor Plan Generator

| ID | Story |
|----|-------|
| PLAN-01 | As a **Buyer** viewing a plot listing, I want to enter plot dimensions and my room preferences so that the AI generates a suggested floor plan for me. |
| PLAN-02 | As a **Buyer**, I want to download the AI-generated floor plan as a PNG or PDF so that I can share it with an architect or family member. |
| PLAN-03 | As a **Buyer**, I want to regenerate the floor plan with different inputs so that I can explore multiple layouts (up to 3 times per session). |
| PLAN-04 | As a **System**, when a plot listing has dimensions, I want to auto-prompt the buyer to generate a floor plan so that the feature is discoverable. |

---

## Direct Owner–Buyer Chat

| ID | Story |
|----|-------|
| CHAT-01 | As a **Buyer**, I want to click "Chat with Owner" on a listing so that I can send a message directly to the owner without a broker. |
| CHAT-02 | As an **Owner**, I want to receive an email notification when a buyer sends me a message so that I respond promptly. |
| CHAT-03 | As an **Owner**, I want my phone number to be hidden by default and share it only when I choose so that my privacy is protected. |
| CHAT-04 | As a **Buyer**, I want all my chats listed in one inbox so that I can manage conversations across multiple properties easily. |
| CHAT-05 | As a **User**, I want to report or block another user from within a chat so that I feel safe from fraud or harassment. |
| CHAT-06 | As a **System**, I want to block unverified users from initiating chats so that only Aadhaar-verified buyers can contact owners and spam is minimised. |

---

## Trust & Safety

| ID | Story |
|----|-------|
| SAFE-01 | As a **Buyer**, I want to see an "Aadhaar Verified" badge on owner profiles so that I know the owner is a real, identified person. |
| SAFE-02 | As a **Buyer**, I want to see a "RERA Verified" badge on listings so that I know the property has a valid RERA registration. |
| SAFE-03 | As a **User**, I want to report a fraudulent listing so that the platform admin can review and remove it. |
| SAFE-04 | As a **System**, I want to deactivate a listing that has been reported more than three times pending admin review so that buyers are protected from scams. |
