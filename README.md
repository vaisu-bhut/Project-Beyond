# Project Beyond

A visual, interactive companion to the ML & LLM Builder's Roadmap — covering 7 phases (foundations → biopharma) plus 3 bonus tracks. Each subsection is its own JSX file you can grow into a rich, interactive walkthrough.

Built with Next.js 16 (App Router, React 19, Turbopack), Tailwind CSS 4, KaTeX for math, Framer Motion, and lucide-react.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/
    page.tsx                     # Home — hero, roadmap table, phase cards
    [slug]/
      layout.tsx                 # Phase header + tabs wrapper
      page.tsx                   # Phase overview (3 section cards)
      theory/page.tsx            # → renders content/<slug>/TheoryMap.tsx
      builds/page.tsx            # → renders content/<slug>/BuildBlock.tsx
      exit/page.tsx              # → renders content/<slug>/ExitCriteria.tsx
    concepts/page.tsx            # Concept-to-phase map
    appendix/page.tsx            # Per-company interview emphasis
  components/
    ui/                          # FormulaCard · BuildCard · Callout · ConceptTag · NotesSection · ...
    hero/NeuralWeb.tsx           # Hero SVG animation
    layout/                      # Navbar · Footer
  content/
    phase-1..7/                  # TheoryMap.tsx · BuildBlock.tsx · ExitCriteria.tsx
    bonus-a..c/                  # same shape
    registry.ts                  # Maps slugs → section components
  data/
    roadmap.ts                   # Phase metadata (accent, duration, goal, ...)
    concepts.ts                  # 30+ concepts mapped to phases
  lib/
    utils.ts                     # cn() helper
```

## Adding content to a section

Each subsection is a self-contained React component. To grow one (e.g. `src/content/phase-1/TheoryMap.tsx`):

1. Import any of the theme-matched primitives:
   - `FormulaCard` — KaTeX rendering of an equation
   - `BuildCard` — numbered build with checklist
   - `Callout` — `info | warning | success | build | awareness` variants
   - `ConceptTag` — small pill for vocabulary
   - `SubHeading` — section heading with accent stripe
   - `NotesSection` — your personal-notes block
2. For interactive widgets (sliders, simulations, SVG plots), create a child component with `"use client"` at the top.
3. Inline accents use the phase's `--accent-pN` (or `--accent-bX` for bonus tracks). See `src/app/globals.css`.

## Phase accent tokens

| Phase | Token | Color |
|---|---|---|
| Phase 1 — Foundations | `--accent-p1` | violet |
| Phase 2 — LLM Apps | `--accent-p2` | blue |
| Phase 3 — Inside the Model | `--accent-p3` | cyan |
| Phase 4 — Distributed / MLOps | `--accent-p4` | emerald |
| Phase 5 — Post-Training | `--accent-p5` | amber |
| Phase 6 — Alignment | `--accent-p6` | rose |
| Phase 7 — Biopharma | `--accent-p7` | teal |
| Bonus A — Graphs | `--accent-bA` | indigo |
| Bonus B — Multimodal | `--accent-bB` | fuchsia |
| Bonus C — Recsys | `--accent-bC` | yellow |

## CI

Every push and PR runs:

- `tsc --noEmit` (typecheck)
- `eslint` (lint)
- `next build` (Turbopack production build)

CodeQL runs on push, PR, and weekly.

## Deploy

Wired for **Vercel** auto-deploys via the connected GitHub repo. `vercel.json` pins the framework and install command. Push to `main` → production. Push to any branch / open a PR → preview deployment.

## Adapted from

The ML & LLM Builder's Roadmap (top-down: theory upfront, builds as the bulk; 14–18 months at 12–15 hrs/week sustained for Phases 1–6).
