# Crumb — Design System
*Based on "The Editorial Table" by Google Stitch — adapted for Crumb*

---

## 1. Overview & Creative North Star

**The Creative North Star: "The Digital Gastronomy Journal"**

This design system moves away from the rigid, boxed-in layouts of standard social media apps. Instead, it adopts the soul of a high-end independent food magazine. We treat every user entry not as a "post," but as a "story."

The aesthetic is **Warm Minimalism**. We achieve sophistication through high-contrast typography scales, intentional asymmetry, and "breathing" white space. By rejecting standard borders and heavy shadows, we allow food photography to take center stage, framed by a tactile, paper-like UI that feels both premium and deeply personal.

---

## 2. Crumb Terminology

| Screen Label | Crumb Term |
|---|---|
| A single check-in entry | Crumb |
| The act of checking in | Drop a Crumb |
| Collection of check-ins | Crumbs |
| Curated restaurant lists | Trails |
| Individual trail entries | Stops |
| Notifications screen | Activity |
| Personal journal view | Journal |

---

## 3. Colors & Tonal Depth

Our palette is a culinary journey: creams for the "linen," terracottas for the "earth," and a rich tomato red (`primary`) for the "flavor."

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. Use `surface-container-low` sections against a `surface` background to define regions.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers — like stacked sheets of fine parchment.

| Token | Hex | Usage |
|---|---|---|
| `surface` | #fbf9f4 | Primary canvas — the base of everything |
| `surface-container-low` | #f5f3ee | Secondary content areas, feed backgrounds |
| `surface-container-highest` | #e4e2dd | Interactive elements that need to pop |
| `surface-container-lowest` | #ffffff | Cards — creates a subtle lift against warm background |
| `primary` | #9e2016 | Tomato red — CTAs, accents, active states |
| `primary-container` | #c0392b | CTA gradient end, hover states |
| `on-surface` | #1b1c19 | All text — never pure black |
| `tertiary` | Sage Green | Active chip state, freshness signal |

### The Glass & Gradient Rule
To prevent the UI from feeling flat, use **Glassmorphism** for navigation bars and floating action buttons.
- **Implementation:** Use `surface` at 80% opacity with `backdrop-filter: blur(20px)`
- **Signature Textures:** Apply a subtle linear gradient from `primary` (#9e2016) to `primary-container` (#c0392b) on main CTAs

> ⚠️ React Native note: Use `@react-native-community/blur` for the glassmorphism nav bar effect.

---

## 4. Typography: The Storytelling Pair

We use a high-contrast pairing to balance "The Journal" (Serif) with "The Tool" (Sans-Serif).

| Font | Role | Usage |
|---|---|---|
| **Newsreader** (Serif) | The Voice | `display` and `headline` levels. Trail titles, restaurant names, hero text |
| **Manrope** (Sans-Serif) | The Engine | `title`, `body`, `labels`. Ratings, timestamps, UI instructions, data |

**Key Rule:** Maintain wide letter-spacing (tracking) on `label-sm` elements. Use uppercase sparingly to maintain a "quiet" UI.

---

## 5. Elevation & Depth

We reject heavy drop-shadows. Depth is achieved through **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The delta in luminance creates a soft, natural edge.
- **Ambient Shadows:** For floating modals only — Blur: 32–64px, Opacity: 4–6%, Color: tint of `on-surface` (#1b1c19)
- **The "Ghost Border" Fallback:** For accessibility/high-contrast modes only — use `outline-variant` at 15% opacity. **Never 100% opaque borders.**

---

## 6. Components

### Cards & Lists
- **No divider lines** — ever. Use vertical white space (Token `8` or `10`) or background shift to `surface-container-low`
- Cards use `xl` (1.5rem) corner radius
- Food photos bleed to the top and sides of the card

### Buttons
| Type | Style |
|---|---|
| **Primary** | Tomato gradient (`primary` → `primary-container`). Radius: `full`. No shadow. |
| **Secondary** | `surface-container-highest` background with `on-surface` text. Integrated feel. |
| **Tertiary** | Text-only in `primary` color, bolded. |

### Input Fields
- No bounding box — minimalist
- Only a `surface-variant` bottom bar (2px) that transforms to `primary` on focus
- Labels: `label-md` in `on-surface-variant`

### The "Ingredient Chip" (Dish Tags)
- Background: `surface-container-high`, radius: `md` (0.75rem)
- Active/selected state: transitions to `tertiary` (Sage Green)
- Used for dish tags on check-ins and Trail entries

---

## 7. Navigation

**Bottom Nav:** Journal · Explore · Check-in (+) · Trails · Activity

- The Check-in button is the prominent center CTA — always elevated
- Profile lives in the **top-right avatar** on every screen
- Nav bar uses Glassmorphism (80% opacity + blur)

---

## 8. Screen Inventory (MVP)

| Screen | Description |
|---|---|
| **Journal** | Personal feed of your Crumbs — photo grid or list |
| **Explore** | Discover trending Trails, local spots, suggested users |
| **Check-in** | Drop a Crumb — restaurant search, photos, dish, rating, story, private reflection |
| **Trails** | Your curated restaurant lists |
| **Activity** | Notifications — likes, comments, follows, Trail saves |
| **Restaurant Detail** | My History + Friends' Crumbs + Trails this place appears in |
| **Trail Detail** | Ranked cards — photo or quote, expand for full details |
| **Profile** | Accessed via top-right avatar — your stats, Crumbs, Trails |

---

## 9. Do's and Don'ts

### Do
- **Embrace Asymmetry** — editorial layouts with intentional imbalance
- **Use High-Quality Food Photography** — the surface palette is built to complement warm food tones
- **Layer Surfaces** — use `surface-container` tiers to create hierarchy without clutter
- **Use `on-surface` (#1b1c19) for all text** — never pure black

### Don't
- **Don't use dividers** — increase spacing instead
- **Don't use pure black** — always `on-surface`
- **Don't over-round** — `lg` and `xl` for containers, `full` only for buttons and chips
- **Don't use 1px solid borders** — use background color shifts for structure

---

*Crumb — Confidential. Warm Minimalism. Every meal, a story.*
