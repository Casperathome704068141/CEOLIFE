# Engineering Guidelines

_Last updated: 2025-11-12_

## 1. Architecture overview
- **Framework**: [Next.js 15](../package.json) with the App Router. All application routes live under `src/app`.
- **State management**: Client-side state relies on [React Query](../src/components/providers/app-providers.tsx) for data fetching and caching, and [Zustand](../store) for UI controls.
- **Design system**: UI primitives are sourced from `src/components/ui` and follow the Tailwind configuration defined in [`tailwind.config.ts`](../tailwind.config.ts).
- **Firebase integration**: Initialization happens once inside [`src/firebase/index.ts`](../src/firebase/index.ts) and is exposed through context hooks.
- **Feature domains**: Core verticals live under `src/app/(app)`, grouped by feature (finance, schedule, vault, etc.). Shared logic for these domains lives in `src/lib`.

## 2. Firebase usage rules
- Always access Firebase instances through the exported hooks (`useAuth`, `useFirestore`, `useFirebaseApp`) from `@/firebase`.
- Use the provided collection helpers (`useCollection`, `useDoc`) and pass `skip: true` when authentication is not yet resolved to avoid unauthorized listeners.
- Firestore queries must be scoped by `ownerId` or other tenant identifiers before subscribing.
- Handle permission issues via the shared `errorEmitter`; the [`FirebaseErrorListener`](../src/components/FirebaseErrorListener.tsx) centralizes toasts and logging.
- Authentication must use `signInWithEmailAndPassword`; anonymous access is disabled.

## 3. UI and layout conventions
- Wrap authenticated application content inside the [`AuthGate`](../src/components/auth/auth-gate.tsx) to guard against unauthenticated access.
- Primary page content should sit inside a max width container (`max-w-7xl`) as established in [`src/app/(app)/layout.tsx`](../src/app/(app)/layout.tsx).
- Navigation lives in the sidebar and should register new routes by extending [`SidebarNav`](../src/components/layout/sidebar-nav.tsx) with the proper section heading and icon.
- Re-use shared components (e.g., `PageHeader`, `StatTile`, `Card`) to maintain consistent styling.
- Favor Tailwind utility classes over inline styles; reserve custom CSS for cross-cutting concerns in `globals.css`.

## 4. Data and domain modelling
- Schemas for Firestore documents are declared in [`src/lib/schemas.ts`](../src/lib/schemas.ts) using Zod. Validate input data against these schemas before writes.
- Background simulations and automation logic live under `src/lib/services`; co-locate new domain services there.
- When adding store slices, place them under `src/store` and document expected shape and actions.

## 5. Testing and quality gates
- Run `npm run lint` for ESLint checks and `npm run typecheck` for TypeScript validity prior to committing.
- Use component-level tests when adding complex UI logic; colocate them near the component using the `.test.tsx` suffix.
- Prefer mocking Firebase clients in tests; do not hit live services.

## 6. Security and compliance
- Never commit plaintext secrets. Firebase configuration belongs in environment variables (`.env.local`) for production deployments.
- Enforce Firestore security rules stored in [`firestore.rules`](../firestore.rules); update them when creating new collections.
- All new routes that expose user data must be gated behind `AuthGate` and validate ownership before rendering.

## 7. Deployment readiness checklist
- Ensure `npm run build` succeeds with no warnings.
- Confirm that authenticated flows work end-to-end with production Firebase credentials.
- Review analytics and logging integrations before release.
- Update this guide with any new process or tooling changes.

