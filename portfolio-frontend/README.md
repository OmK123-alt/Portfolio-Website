# Portfolio Frontend

Contains two React apps:
- `frontend/` — Public portfolio website
- `admin/` — Admin panel for managing content

## Local Setup

### 1. Frontend (Portfolio Website)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:5173
```

### 2. Admin Panel
```bash
cd admin
npm install
cp .env.example .env
npm run dev
# → http://localhost:5174
```

Make sure the backend is running on http://localhost:5000 first.

## Deploy to Vercel

Each app deploys as a separate Vercel project.

### Deploy Frontend
1. Go to https://vercel.com → New Project
2. Import this repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api`
5. Deploy

### Deploy Admin
1. Go to https://vercel.com → New Project
2. Import this same repo
3. Set **Root Directory** to `admin`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api`
5. Deploy

## Environment Variables

Both `frontend` and `admin` use the same variable:

| Variable       | Local value                     | Production value                       |
|----------------|---------------------------------|----------------------------------------|
| VITE_API_URL   | http://localhost:5000/api       | https://your-backend.vercel.app/api    |

## After Deployment — Update Backend CORS

In your backend `server.js`, update CORS to allow your Vercel domains:

```js
app.use(cors({
  origin: [
    'https://your-portfolio.vercel.app',
    'https://your-admin.vercel.app'
  ]
}));
```
