# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

pnpm db:generate  # Generate Drizzle migrations from schema changes
pnpm db:migrate   # Apply pending migrations
pnpm db:push      # Push schema directly to DB (dev only)
pnpm db:studio    # Open Drizzle Studio (database GUI)
pnpm db:seed      # Seed initial data
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET` — random secret for JWT signing
- `UPLOAD_DIR` — defaults to `./public/uploads`

## Architecture Overview

**Full-stack Next.js e-commerce** for an eyewear shop (Senegal market, FCFA currency, French UI).

### App Router Structure

Two route groups share distinct layouts:
- `src/app/(storefront)/` — Public storefront with Navbar, CartDrawer, Footer
- `src/app/admin/` — Protected admin panel (role: `admin` required)
- `src/app/api/` — API routes split between `/api/admin/*` (admin-only) and public endpoints

Middleware at `src/middleware.ts` protects `/compte/*` routes via NextAuth session check.

### Data Flow

1. **API Routes** (`src/app/api/`) call **Services** (`src/services/`) which use **Drizzle ORM** (`src/db/`) to query PostgreSQL.
2. **Client components** call API routes via custom hooks in `src/hooks/useApi.ts` (TanStack React Query).
3. **Cart state** is client-only, managed by Zustand in `src/lib/store.ts`, persisted to `localStorage` under key `bichri-cart`.

### Database

Schema defined in `src/db/schema.ts` using Drizzle ORM. Key tables: `users`, `products`, `productVariants`, `categories`, `brands`, `orders`, `orderItems`, `likes`, `comments`, `coupons`, `banners`.

TypeScript types are inferred directly from the schema — see `src/types/index.ts`.

### Authentication

NextAuth.js with credentials provider (`src/lib/auth.ts`). JWT strategy (30-day sessions). User role (`customer` | `admin`) is stored in the JWT and extended on the session type via `src/types/next-auth.d.ts`. Admin access is checked in `src/lib/admin-auth.ts`.

### Styling

Tailwind CSS v4 with HeroUI component library. Custom Bichri purple theme (`#7c1aff`) configured in `tailwind.config.ts`. Utility helpers use `clsx` + `tailwind-merge` via `src/lib/utils.ts`.

### Key Conventions

- Path alias `@/*` maps to `src/*`
- French route names: `/boutique`, `/panier`, `/commande`, `/compte`, etc.
- Product variants (size/color/style) are tracked independently in the cart with their own quantities
- Order statuses flow: `en_attente` → `confirmée` → `en_préparation` → `expédiée` → `livrée`
- Image uploads served from `public/uploads/`, handled by `src/app/api/uploads/`
