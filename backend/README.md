# Doha Furniture — Backend

Express + MongoDB (Mongoose) API, written in TypeScript with a NestJS-style
feature-module layout (plain Express, no Nest framework).

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys, SMTP
npm run seed:admin     # creates the one admin login from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev            # http://localhost:5000 (tsx watch, hot reload)
npm run build           # tsc -> dist/
npm start                # node dist/server.js (run build first)
```

## Structure

```
src/
  modules/
    auth/       Admin model, login/JWT logic, /api/auth
    category/   /api/categories
    product/    /api/products
    service/    Installation/Fixing/Delivery resource, /api/services
    contact/    quote-form submissions, /api/contact
    settings/   site-wide contact info singleton, /api/settings
  common/
    config/     db.ts (Mongo connection), cloudinary.ts (SDK config)
    middleware/ auth.middleware.ts (JWT guard), upload.middleware.ts
                (multer + Cloudinary via a small custom storage engine —
                see common/utils/cloudinaryStorage.ts), error.middleware.ts
                (centralized error + 404 handling)
    utils/      generateToken, sendEmail, slugify, cloudinaryStorage, httpError
    types/      express.d.ts — augments Express's Request with req.admin
  seed/         seedAdmin.ts — run once to create the single admin login
  app.ts        Express app setup, mounts every module's router
  server.ts     connects the DB, then starts the HTTP server
```

Each module follows `<name>.model.ts` / `<name>.service.ts` (business
logic, framework-agnostic) / `<name>.controller.ts` (thin Express
handlers) / `<name>.routes.ts` / `<name>.types.ts` (DTOs).

## Auth model

There's no user registration — one admin account, created by
`npm run seed:admin` from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.
`POST /api/auth/login` returns a JWT; send it as `Authorization: Bearer <token>`
on every protected route.

## API routes

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | /api/auth/login | — | returns JWT |
| GET | /api/auth/me | JWT | verify a stored token |
| GET | /api/categories | — | |
| GET | /api/categories/:slug | — | |
| POST/PUT/DELETE | /api/categories | JWT | multipart, field `image` |
| GET | /api/products?category=&unit=&minSize=&maxSize=&page=&limit= | — | |
| GET | /api/products/:slug | — | |
| GET | /api/products/admin/all | JWT | includes inactive products |
| POST/PUT/DELETE | /api/products | JWT | multipart, field `images` (up to 8) |
| GET | /api/services | — | |
| GET | /api/services/:slug | — | |
| GET | /api/services/admin/all | JWT | includes inactive services |
| POST/PUT/DELETE | /api/services | JWT | multipart, field `image` |
| POST | /api/contact | — | quote form submit |
| GET | /api/contact | JWT | list, `?unreadOnly=true` |
| PATCH | /api/contact/:id/read | JWT | |
| DELETE | /api/contact/:id | JWT | |
| GET | /api/settings | — | phone/whatsapp/email/address |
| PUT | /api/settings | JWT | |

## Images

Uploaded files go straight to Cloudinary (folder `doha-furniture`) via a
small custom multer storage engine (`src/common/utils/cloudinaryStorage.ts`)
— the official `multer-storage-cloudinary` package only supports the old
Cloudinary v1 SDK, so this avoids a version conflict.

## Next step

Point the frontend's `src/lib/api.js` and the dashboard's `src/lib/api.js`
at `NEXT_PUBLIC_API_URL=http://localhost:5000/api` and swap the mock-data
functions for real `fetch()` calls to these routes — the response shapes
already match what both were built against.
