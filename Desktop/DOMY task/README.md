# DOMY MERN Mini App

Backend: `backend` — Express + Mongoose + scraper
Frontend: `frontend` — React (Parcel bundler)

Environment variables (backend):
- `MONGODB_URI` (default shown in .env.example)
- `JWT_SECRET`
- `PORT` (5000)

Setup

1. Backend

```bash
cd backend
npm install
# copy .env.example to .env and set values
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm start
```

API highlights
- `POST /api/auth/register` — register {username,password}
- `POST /api/auth/login` — login {username,password}
- `GET /api/auth/me` — get user and bookmarks (requires Authorization header)
- `GET /api/stories` — get stories
- `POST /api/stories/:id/bookmark` — toggle bookmark (requires auth)
- `POST /api/scrape` — trigger scrape

Notes
- Scraper runs on server start and upserts top 10 HN stories.
- Use `Authorization: Bearer <token>` when calling protected endpoints.
