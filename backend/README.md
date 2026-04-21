# Portfolio Backend

Express.js API for the portfolio system.

## Local Setup

```bash
npm install
cp .env.example .env   # then edit .env with your values
npm run dev
```

Runs on: http://localhost:5000

## Deploy to Vercel

1. Push this folder to a GitHub repo (e.g. `portfolio-backend`)
2. Import the repo on https://vercel.com
3. Add these Environment Variables in Vercel dashboard:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
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
