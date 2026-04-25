# Portfolio Backend

Express.js API for the portfolio system.

## Local Setup

```bash
npm install
cp .env.example .env   # then edit .env with your values
npm run dev
```

Runs on: http://localhost:5000

## Supabase Setup (Required for persistent admin edits)

1. Create a Supabase project.
2. In SQL Editor, run:

```sql
create table if not exists public.portfolio_data (
   id integer primary key,
   data jsonb not null,
   updated_at timestamptz default now()
);
```

3. In backend environment variables, set:
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE_KEY
    - SUPABASE_TABLE (optional, default: portfolio_data)

Important: Use the service role key only in backend/server environments. Never expose it in frontend code.

## Deploy to Vercel

1. Push this folder to a GitHub repo (e.g. `portfolio-backend`)
2. Import the repo on https://vercel.com
3. Add these Environment Variables in Vercel dashboard:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_TABLE` (optional)
4. Deploy — Vercel auto-detects `vercel.json`

## Frontend Connection

Set the frontend environment variable `VITE_API_URL` to the deployed backend project URL, for example:

```bash
VITE_API_URL=https://YOUR-BACKEND-PROJECT.vercel.app/api
```

Do not point the frontend at the frontend deployment domain itself.

## Environment Variables

| Variable        | Description                        |
|-----------------|------------------------------------|
| PORT            | Server port (default: 5000)        |
| ADMIN_EMAIL     | Login email for admin panel        |
| ADMIN_PASSWORD  | Login password for admin panel     |
| JWT_SECRET      | Secret key for JWT tokens          |
| SUPABASE_URL    | Supabase project URL               |
| SUPABASE_SERVICE_ROLE_KEY | Backend-only service role key |
| SUPABASE_TABLE  | JSON storage table name (optional) |

## API Endpoints

### Public
```
GET  /api/public/portfolio     All portfolio data
GET  /api/public/:section      Specific section
```

### Auth
```
POST /api/auth/login           Login → returns JWT token
```

### Admin (JWT required)
```
GET    /api/admin/data
PUT    /api/admin/profile
PUT    /api/admin/hero
PUT    /api/admin/skills
GET    /api/admin/works
POST   /api/admin/works
PUT    /api/admin/works/:id
DELETE /api/admin/works/:id
PUT    /api/admin/contact
```
