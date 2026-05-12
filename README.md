# Solace Candidate Assignment

A take-home assignment for Solace, built in 2 hours. The task was to audit and improve an existing Next.js application that allows patients to search for and match with health advocates.

## What Was Done

- Fixed bugs and anti-patterns in the original codebase
- Improved UI/UX for the advocate search and filtering experience
- Added frontend and backend performance improvements (search optimized for large datasets)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL via Docker, Drizzle ORM
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

Install dependencies:

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Database Setup

The app returns a default list of advocates out of the box — no database required to run locally.

To use a real database:

1. Start PostgreSQL via Docker:
   ```bash
   docker compose up -d
   ```
2. Create a `solaceassignment` database
3. Push the schema:
   ```bash
   npx drizzle-kit push
   ```
4. Seed the database:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```
