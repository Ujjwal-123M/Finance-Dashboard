# Form Fill Content

## Live Demo or API Documentation URL
Use this URL after pushing your repo:

`https://github.com/<your-username>/<your-repo-name>/blob/main/API_DOCUMENTATION.md`

If they ask for one URL only, paste the above. It directly opens API docs.

## Primary Framework or Library Used
`Node.js (Express, Fastify, etc.)`

## Features Implemented
- User and Role Management
- Financial Records CRUD
- Record Filtering (by date, category, type)
- Dashboard Summary APIs (totals, trends)
- Role Based Access Control
- Input Validation and Error Handling
- Data Persistence (Database)

## Technical Decisions and Trade-offs
I implemented the backend using Node.js with Express and TypeScript, with a layered architecture (`routes -> controllers -> services -> middleware -> validators`) to keep responsibilities clear and maintainable.

For persistence, I used PostgreSQL with Prisma ORM. This made schema modeling, migrations, and data access reliable and readable for this assignment. The schema includes core entities for user management and financial records, with enums for role/status/type.

Authentication is JWT-based (`POST /api/auth/login`) and role-based access control is enforced through middleware. Access behavior is:
- VIEWER: dashboard summary access
- ANALYST: read records + dashboard summary
- ADMIN: full management access (users + records)

Input validation is handled using Zod. Validation is applied at route level and malformed input returns structured 400 responses. A centralized error middleware ensures consistent error payloads and status codes across auth, validation, access control, and not-found scenarios.

Dashboard endpoints include aggregation logic (income, expenses, net balance, category totals, recent activity, monthly trend), not just CRUD, to match the assignment’s analytical requirement.

Trade-offs:
- I prioritized correctness, structure, and documentation over production hardening.
- I did not deploy the API; instead I prepared complete API documentation and setup instructions for local verification.
- I did not add automated tests/rate limiting/refresh token flow due to assignment scope and timeline.

## Additional Notes
- API is documented in `API_DOCUMENTATION.md` and `README.md`.
- Setup prerequisites: Node.js, npm, PostgreSQL, valid `.env` values (`DATABASE_URL`, `JWT_SECRET`).
- Seed data is provided for quick evaluation (`npm run prisma:seed`) including Admin/Analyst/Viewer users.
- The project is submission-focused and intentionally kept clean and maintainable.
- Suggested future enhancements: Swagger/OpenAPI spec, integration tests, rate limiting, refresh tokens, CI pipeline.
