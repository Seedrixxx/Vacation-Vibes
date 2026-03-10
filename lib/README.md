# Lib — Architecture

Services, repositories, and types live under `lib/` (e.g. `lib/services/`, `lib/repositories/`, `lib/types/`). API routes validate input, call a service, and return the response.

- **Repositories** (`lib/repositories/`): Data access only. Use Prisma or Supabase client. Expose `findMany`, `findBySlug`, `create`, etc. No business logic.
- **Services** (`lib/services/`): Business logic. Call repositories and domain helpers (e.g. invoice, generator). Used by API routes.
- **API routes**: Validate request (Zod), call one service method, return JSON response.
- **Validators** (`lib/validators/`): Zod schemas for API body/query validation.
- **Types** (`lib/types/`): Shared DTOs and API types (e.g. `PublicPackage`).
