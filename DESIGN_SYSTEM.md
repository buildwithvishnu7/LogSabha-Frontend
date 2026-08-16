# LogSabha Design System

Extracted from the **homepage** (`src/components/sections/*.tsx`, 15 files, 331 KB), which
is the agreed visual benchmark. Every other page must be built from these tokens.

Method: frequency analysis over the homepage source — whatever the homepage does *most*
is treated as canonical, not what appears once.

---

## 1. Colour

### Brand tokens (already defined in `src/styles/globals.css`)

| Token | Value | Role |
|---|---|---|
| `--color-brand` | `#F59E0B` | primary brand (amber-500) |
| `--color-brand-light` | `#FBBF24` | hover / highlight (amber-400) |
| `--color-brand-dark` | `#D97706` | pressed / deep accent (amber-600) |
| `--color-brand-glow` | `rgba(245,158,11,0.3)` | glow + focus rings |
| `--color-foreground` | `#0A0A0A` | primary ink |
| `--color-muted-foreground` | `#737373` | secondary ink |
| `--color-border` | `#E5E5E5` | hairlines |
| `--color-background` | `#FFFFFF` | page ground |

### Most-used raw values

| Hex | Count | Meaning |
|---|---|---|
| `#F97316` | 20 | orange-500 — the hottest accent |
| `#F59E0B` | 12 | amber-500 — brand |
| `#FFFFFF` | 12 | surfaces |
| `#E5E7EB` | 11 | gray-200 hairline |
| `#FBBF24` | 10 | amber-400 |
| `#0B1120` / `#0C0C1D` | 10 | near-black grounds for dark sections |
| `#6B7280` / `#9CA3AF` | 11 | gray-500 / gray-400 body + muted |

### Palette class usage

`amber` **167** · `gray` **98** · `orange` **52** · `red` 24 · `emerald` 11 · `blue` 10

**Rule:** amber/orange is the accent system; gray is the neutral system. Any other hue is
semantic only (red = alert, emerald = positive delta) and must not be introduced decoratively.

---

## 2. Typography

Family: `--font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif`

| Role | Class | Uses |
|---|---|---|
| Micro-label / eyebrow | `text-[10px]` / `text-[11px]` | 43 |
| Caption | `text-xs` | 46 |
| Body | `text-sm` | 64 |
| Lead body | `text-base` | 25 |
| Sub-heading | `text-2xl` | 28 |
| Section heading | `text-3xl` → `text-4xl` | 42 |

Weights: `font-semibold` 36 · `font-bold` 36 · `font-extrabold` 29 · `font-medium` 12
Tracking: `tracking-wide` on eyebrows (21 uses); `[0.2em]` for the widest caps labels.

**Rule:** the homepage runs a *small* type scale — body is 14px, headings top out around
36px. Eyebrows are tiny (10–11px) and wide-tracked. That contrast (tiny label above a
large heading) is a signature of the look.

---

## 3. Spacing, radii, containers, elevation

| Aspect | Canonical | Notes |
|---|---|---|
| Container | `max-w-[1440px]` (12 uses) | widest tier; inner content narrows per section |
| Gaps | `gap-2` / `gap-3` / `gap-4` | tight rhythm; `gap-10`/`gap-12` between blocks |
| Radii | **`rounded-full` 97 · `rounded-xl` 40 · `rounded-2xl` 33** | the homepage is **soft**, pill-heavy |
| Shadows | `shadow-lg` 22 · `shadow-sm` 16 · `shadow-md` 8 | plus amber glow: `0 0 20px rgba(245,158,11,0.5)` |

---

## 4. Motion vocabulary

| Aspect | Canonical value | Uses |
|---|---|---|
| **Primary easing** | `cubic-bezier(0.16, 1, 0.3, 1)` | **41** |
| Secondary easing | `cubic-bezier(0.25, 1, 0.5, 1)` | 7 |
| UI durations | `0.3` · `0.4` · `0.5` · `0.6` · `0.7` · `0.8` s | 78 combined |
| Ambient loop durations | `2` · `2.5` · `3` · `4` s | 60 combined |
| Scroll thresholds | `amount: 0.2` / `0.3` / `0.5` | 23 |
| Stagger step | `i * 0.08` · `i * 0.1` · `i * 0.15` | 15 |
| Spring | `stiffness: 300–400` | 8 |
| Replay | **`once: false` × 29, `once: true` × 0** | — |

**Rules the homepage follows, which every page must inherit:**

1. One easing curve for essentially everything: `[0.16, 1, 0.3, 1]`. Never `linear` for UI.
2. UI motion lands in **300–800ms**. Anything 2s+ is an ambient loop (shimmer, float, pulse),
   never a state change.
3. **Scroll reveals always replay** (`once: false`) — scrolling back up re-animates.
4. Stagger is small: 80–150ms per item, capped so a long list doesn't cascade forever.
5. Motion is `transform` + `opacity` only.

---

## 5. Component patterns

- **Eyebrow + heading**: tiny wide-tracked caps label, then a large bold heading. The label
  usually carries a short rule (`h-px w-7`) before it.
- **Primary CTA**: solid amber, pill (`rounded-full`), with a sweeping sheen overlay and a
  `y: -2` hover lift.
- **Card**: white surface, `rounded-xl`/`2xl`, `shadow-lg`, hairline border, hover lift.
- **Counters**: numbers animate up on scroll-in and replay on return.

---

## 6. ⚠️ Conflict to resolve before any page work

The nine pages built from the designer reference are on a **different system**:

| Aspect | Homepage (benchmark) | Reference-built pages |
|---|---|---|
| Accent | amber `#F59E0B` / orange `#F97316` | saffron `#E67300` |
| Ink | near-black `#0A0A0A`, gray neutrals | navy `#14213D` / `#1B3A6B` |
| Radii | `rounded-full` / `xl` / `2xl` — **soft** | **sharp 3px** everywhere |
| Container | `max-w-[1440px]` | `max-w-6xl` (1152px) |
| Type scale | body 14px, headings ≤36px | body 15px, headings to 72px |

These are not small drifts — they read as two different products. Bringing the nine pages
onto the homepage's tokens means **re-skinning all of them**: soft radii, amber accent,
1440px container, smaller type scale. That is a much larger change than adding motion.

This document records the homepage system as extracted. Which system wins is a decision
for the project owner, not an inference.

---

## 7. Migration status

Nine pages were audited and migrated onto the tokens above. Two are deliberate
exceptions, agreed with the project owner.

| Page | Status |
|---|---|
| `/services` | ✅ migrated + verified at 5 breakpoints |
| `/political-analysis` | ✅ migrated + verified |
| `/hindu-for-justice` | ✅ migrated + verified |
| `/about` | ✅ migrated + verified |
| `/blog`, `/blog/[slug]` | ✅ migrated + verified |
| `/contact` | ✅ migrated + verified |
| `/rss` | 🔒 **exception** — keeps its saffron/navy centenary system |
| `/rss-museum` | 🔒 **exception** — keeps its aged-paper archival system |

### Why the two exceptions

The RSS pair is a self-contained sub-site about one subject across one century.
`/rss-museum` in particular runs an archival palette (aged paper `#F2E9DB`,
cream photo mats, sepia-toned images, maroon seals) that *is* the concept — put
it on amber-and-white and the museum stops reading as a museum. They are
consistent with each other, which is what matters for that pair.

### Two patterns that live outside the homepage vocabulary

`Typewriter` (heading reveal) and `SlotNumber` (slot-machine numerals) do not
appear on the homepage, but both were specifically requested and are kept on the
migrated pages. Flagged here so the inconsistency is a recorded decision rather
than drift.

### Method note

Browser measurements in the build environment must compare against the **layout
viewport** (`max(documentElement.clientWidth, innerWidth)`), not `clientWidth`
alone, and must neutralise stuck entrance transforms before reading rects.
Skipping either produced false "asymmetry", "overflow" and "clipping" findings
during this work.
