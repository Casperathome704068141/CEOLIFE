# BENO 1017 – Chief of Staff

Executive-grade life operating system built with Next.js 14, TypeScript, Tailwind, shadcn/ui, Zustand, and Firebase. The MVP delivers a futuristic dashboard that unifies finance, household, wellness, and automation intelligence for Beno’s household.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:9002` with the turbopack dev server.

### Environment variables

Copy `.env.sample` to `.env.local` and provide Firebase + Plaid credentials. The `FIREBASE_SERVICE_ACCOUNT` variable must contain a JSON stringified service account when running the seed script.

### Seed demo data

```bash
npm run seed
```

The script populates Firestore with a demo household, members, accounts, sample transactions, bills, and goals. It requires a Firebase service account credential via the `FIREBASE_SERVICE_ACCOUNT` environment variable.

## Project structure

- `src/app` – Next.js App Router pages. All major modules (finance, vault, schedule, household, goals, simulations, wellness, security, onboarding, assistant) are routed per blueprint.
- `src/components` – Shared executive-ops design system components (`StatTile`, `BriefingCard`, `VaultDropzone`, etc.), layout primitives, and UI wrappers from shadcn/ui.
- `src/lib` – Mock data sets, Zod schemas for Firestore collections, placeholder images, and helpers.
- `src/store` – Zustand store for UI state (command palette, notifications, profile switcher).
- `scripts` – Seed script for demo Firestore data.
- `firestore.rules`, `storage.rules`, `firestore.indexes.json` – Baseline security model and indexes for Firebase.

## Design language

- Dark glassmorphism palette (`slate-950` backgrounds, cyan/indigo neon accents).
- Animated Stat tiles, briefing cards, sparkline charts, command palette (⌘K), notification tray, and profile switcher.
- WCAG-conscious component styling with focus rings, keyboard shortcuts (⌘ + K/A/U/F/S/R/N), and responsive grid layout.

## Tooling

- **Next.js 14 App Router** with React 18.
- **Tailwind CSS** + `tailwind-merge`, `tailwindcss-animate`.
- **shadcn/ui** components for consistent surfaces.
- **Framer Motion** for micro-interactions.
- **Zustand** for UI state.
- **TanStack Query** for data fetching scaffolding (providers wired in `AppProviders`).
- **Recharts** for sparkline and chart primitives.
- **Zod** schemas for runtime validation of Firebase data models.
- **Vitest + React Testing Library** ready via Next tooling.

### Keyboard shortcuts

- `⌘ + K` / `Ctrl + K` — Command palette.
- `⌘ + N` / `Ctrl + N` — Jump to nudge workflow.
- `⌘ + A` / `Ctrl + A` — Add transaction.
- `⌘ + U` / `Ctrl + U` — Upload to vault.
- `⌘ + F` / `Ctrl + F` — Filter transactions.
- `⌘ + S` / `Ctrl + S` — Open Beno assistant.
- `⌘ + R` / `Ctrl + R` — Automations workspace.

## Feature highlights

- Executive dashboard with animated tiles, schedule timeline, Beno briefing, vault inbox, and shopping assistant.
- Full navigation skeleton per blueprint: finance suite, vault, schedule/taskboard, household manager, goals, simulations, wellness analytics, security, onboarding, and assistant chat.
- Head-of-home messaging flows with WhatsApp/SMS nudges, settlements ledger, and monthly audit scaffolding.
- Command palette (`⌘K`) with quick actions, notification tray, and profile perspective switcher.
- Firebase data model codified via Zod schemas, Firestore + Storage security rule stubs, and index configuration.
- Seed script creating demo household with members, accounts, transactions, bills, goals, docs, automations, and nudges in CAD.

## Testing & linting

```bash
npm run lint
npm run typecheck
```

Additional automation (GitHub Actions, Husky, etc.) can be layered to enforce lint/type/test before deploy.

## Deployment

Deployable to Firebase Hosting. Ensure Firestore security rules, Storage rules, and indexes are deployed alongside the Next.js build output.
