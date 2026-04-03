# Finance Data Processing and Access Control Backend

Node.js + Express + TypeScript + PostgreSQL backend for the assignment. It implements role-based access control, financial records CRUD, and dashboard analytics APIs.

Detailed endpoint documentation is available in `API_DOCUMENTATION.md`.

## Tech Stack
- Node.js (TypeScript)
- Express
- PostgreSQL
- Prisma ORM
- JWT authentication
- Zod request validation

## Project Structure

```txt
src/
  app.ts
  server.ts
  config/
  controllers/
  middleware/
  routes/
  services/
  validators/
  lib/
  utils/
prisma/
  schema.prisma
  seed.ts
```

## Role Model
- `VIEWER`: can access dashboard summary only.
- `ANALYST`: can read records + dashboard summary.
- `ADMIN`: full access (users + records + dashboard).

## Data Model
- `User`
  - id, name, email, passwordHash, role, status (`ACTIVE`/`INACTIVE`), timestamps
- `FinancialRecord`
  - id, amount, type (`INCOME`/`EXPENSE`), category, recordDate, notes, createdById, timestamps

## API Overview
Base URL: `http://localhost:4000`

### Health
- `GET /health`

### Auth
- `POST /api/auth/login`
  - body: `{ "email": "...", "password": "..." }`
  - returns JWT token

### Users (Admin only except `/me`)
- `GET /api/users/me` (authenticated)
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`

### Financial Records
- `GET /api/records` (`ANALYST`, `ADMIN`)
  - query: `page, limit, type, category, startDate, endDate, sortBy, sortOrder`
- `GET /api/records/:id` (`ANALYST`, `ADMIN`)
- `POST /api/records` (`ADMIN`)
- `PATCH /api/records/:id` (`ADMIN`)
- `DELETE /api/records/:id` (`ADMIN`)

### Dashboard
- `GET /api/dashboard/summary` (`VIEWER`, `ANALYST`, `ADMIN`)
  - query: `startDate, endDate, months, recentLimit`
  - returns:
    - totals: income, expenses, netBalance
    - categoryTotals
    - recentActivity
    - monthlyTrend

## Validation and Error Handling
- Input validation is done with Zod in middleware.
- Uniform error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {}
}
```

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` and `JWT_SECRET`
3. Run database migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Seed sample data:
   ```bash
   npm run prisma:seed
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

## Seeded Users
- Admin: `admin@finance.local / Admin@123`
- Analyst: `analyst@finance.local / Analyst@123`
- Viewer: `viewer@finance.local / Viewer@123`

## Assignment Assumptions
- Only authenticated users can access protected routes.
- Inactive users are blocked at auth middleware.
- Viewer access is intentionally limited to dashboard analytics.
- Analyst is read-only for records.
- Admin performs all mutating actions.

## Scripts
- `npm run dev` - start dev server
- `npm run build` - compile TypeScript
- `npm run start` - run compiled app
- `npm run typecheck` - TypeScript checks
- `npm run prisma:migrate` - run migrations
- `npm run prisma:seed` - seed database

## Notes
- This implementation prioritizes maintainability and clarity for assessment.
- Optional enhancements like tests/rate-limiting/API docs can be added next if needed.
