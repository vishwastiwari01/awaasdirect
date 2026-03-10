# 🎨 UI/UX Master Skill

## Design Philosophy
Every UI must feel premium, intentional, and modern. No generic AI slop. Every screen should look like it was designed by a world-class product designer.

## Default Design System

### Colors (Dark Mode Default)
```css
--bg:        #080810   /* page background */
--surface:   #0f0f1a   /* elevated surfaces */
--card:      #13131f   /* cards */
--border:    #1e1e30   /* borders */
--primary:   #6366f1   /* indigo — primary actions */
--accent:    #06b6d4   /* cyan — highlights */
--success:   #10b981
--warning:   #f59e0b
--error:     #ef4444
--text:      #e2e8f0
--muted:     #64748b
```

### Typography
- Display: `Syne 800` — hero headlines
- Heading: `Syne 700` — section titles
- Body: `Inter 400` — paragraph text
- Code: `Space Mono` — code, labels, badges

### Component Patterns
```tsx
// Glass Card
className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"

// Primary Button
className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all"

// Input Field
className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

// Gradient Text
className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"

// Subtle Badge
className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-mono"
```

### Animation (Framer Motion)
```tsx
// Page load
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}

// Card hover
whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}

// Stagger list
variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
```

## Every Screen Must Have
- Loading skeleton (not spinner alone)
- Empty state (icon + message + CTA button)
- Error state (icon + message + retry)
- Mobile layout (375px minimum)
- Dark mode
