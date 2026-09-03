# E-Commerce Platform — Phase 1

A production-ready e-commerce platform with a full admin dashboard, built in
phases. **This delivery is Phase 1**: project setup, database, and
authentication (customer + admin, role-based access control). Everything
here is real, working, and backed by a database — nothing is mocked.

Theme: clean **white/light** UI, mobile-first and fully responsive
(tested down to ~375px width, scales up to desktop).

---

## 1. Tech stack

| Layer          | Choice                                   |
|----------------|-------------------------------------------|
| Frontend       | Next.js 14 (App Router), React, TypeScript |
| Styling        | Tailwind CSS                              |
| Backend        | Next.js Route Handlers (REST-style API)   |
| Database       | PostgreSQL via Prisma ORM                 |
| Auth           | NextAuth (JWT sessions), bcrypt password hashing |
| Validation     | Zod (server-side, never trusts client input) |

## 2. What's included in Phase 1

- PostgreSQL schema for `users` (customers), `admin_users`, `roles`,
  `permissions`, and an `audit_logs` table for login attempts.
- Two **separate** login flows/tables — customer accounts can never
  authenticate into `/admin`, and vice versa.
- Role-based access control: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, seeded with
  sensible default permissions per role.
- Middleware that blocks any `/admin/*` or `/account/*` route unless the
  session is valid **and** the correct account type — enforced on the
  server, not just hidden in the UI.
- Password hashing with bcrypt (12 rounds), strong password policy
  enforced server-side.
- Pages: Home, Login, Register, Forgot Password (UI only — full email flow
  ships with the notifications module), Customer Account placeholder,
  Admin Login, Admin Dashboard shell, Terms, Privacy, custom 404.
- Fully responsive, white-theme UI with a mobile drawer nav for the admin
  console and 44px-minimum tap targets throughout.

## 3. Getting started

### Prerequisites
- Node.js 18.18+
- A PostgreSQL database (local, Docker, or a hosted provider like Supabase/Neon/Railway)

### Install
```bash
npm install
```

### Configure environment variables
```bash
cp .env.example .env
```
Fill in `DATABASE_URL` and generate a `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Set up the database
```bash
npm run db:push      # create tables from prisma/schema.prisma
npm run db:seed      # create roles, permissions, and demo accounts
```

### Run locally
```bash
npm run dev
```
Visit `http://localhost:3000`.

### Build for production
```bash
npm run build
npm run start
```

## 4. Demo credentials (seeded)

⚠️ **Change or delete these before deploying to production.**

| Portal          | URL             | Email                  | Password       |
|-----------------|-----------------|-------------------------|-----------------|
| Admin console   | `/admin/login`  | `admin@example.com`     | `ChangeMe123!`  |
| Customer login  | `/login`        | `customer@example.com`  | `ChangeMe123!`  |

## 5. Deployment

- **Frontend/app**: Vercel (recommended) — set the environment variables
  from `.env.example` in the Vercel project settings.
- **Database**: any managed PostgreSQL provider (Supabase, Neon, Railway,
  RDS). Run `npx prisma migrate deploy` as part of your deploy step once
  you switch from `db:push` to versioned migrations.
- Set `NEXTAUTH_URL` to your production domain.

## 6. Project structure

```
prisma/
  schema.prisma       # database models
  seed.ts             # demo data
src/
  app/
    (customer)/       # login, register, forgot-password, account
    (admin)/admin/     # admin login + dashboard
    (legal)/           # terms, privacy
    api/auth/          # NextAuth + registration route
  components/
    auth/              # shared auth UI shell
    admin/             # admin shell (sidebar/topbar/drawer)
  lib/                 # prisma client, password hashing, next-auth config
  lib/validation/      # zod schemas (server-side source of truth)
  middleware.ts        # route-level RBAC enforcement
  styles/globals.css   # design tokens / white theme
```

## 7. Roadmap (remaining phases)

This project is built in phases so each stage can be tested before the
next begins, per the original build plan:

1. ✅ Project setup + database + authentication
2. ⏳ Admin dashboard (live stats, charts)
3. ⏳ Product / category / brand management
4. ⏳ Inventory management
5. ⏳ Customer-facing storefront (home, shop, product, search)
6. ⏳ Cart + checkout + orders
7. ⏳ Coupon system
8. ⏳ Website customization (colors, logo, homepage content — no-code)
9. ⏳ SEO + performance
10. ⏳ Security hardening + deployment prep

## 8. How to add a new feature

1. Add/extend models in `prisma/schema.prisma`, then `npm run db:push`
   (or a proper migration once in production).
2. Add a Zod schema in `src/lib/validation/`.
3. Add a Route Handler under `src/app/api/...` — validate input, check
   auth/role via `getServerSession(authOptions)`, never trust client-sent
   prices/stock/totals.
4. Add UI under `src/app/(customer)/...` or `src/app/(admin)/admin/...`,
   reusing the design tokens in `tailwind.config.ts` / `globals.css`.
5. If it's an admin feature, gate it by role/permission, not just by page.

## 9. Design decisions (ambiguities resolved)

- Admin and customer auth use two separate credential tables and NextAuth
  providers rather than one shared `users` table with a role flag — safer
  separation for the higher-privilege account type.
- Roles carry granular `permissions` (many-to-many) rather than a fixed
  enum, so a Manager's access can be tuned later without a schema change.
- Password reset UI exists now; the email-sending part is deferred to the
  Notifications phase (Section 22 of the spec) so it isn't built on a
  placeholder email provider.
