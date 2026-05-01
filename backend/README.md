# Feedback API

Production-ready REST API for the **Send Feedback** form.

**Stack:** Node.js · Express · MySQL (Sequelize) · JWT · express-validator · Helmet · Rate-limiting

## Folder Structure

```
backend/
├── src/
│   ├── config/db.js              # Sequelize connection
│   ├── models/Feedback.js        # Feedback model
│   ├── controllers/feedbackController.js
│   ├── routes/feedbackRoutes.js
│   ├── validators/feedbackValidator.js
│   ├── middlewares/
│   │   ├── auth.js               # JWT + admin guard
│   │   ├── validate.js           # express-validator handler
│   │   └── errorHandler.js
│   ├── app.js
│   └── server.js
├── sql/schema.sql
├── .env.example
└── package.json
```

## Setup

```bash
cd backend
cp .env.example .env       # then edit DB + JWT values
npm install
# Option A: let Sequelize auto-create tables
npm run dev
# Option B: run schema manually
mysql -u root -p < sql/schema.sql
```

## Endpoints

| Method | Path                          | Auth        | Description                    |
|--------|-------------------------------|-------------|--------------------------------|
| POST   | `/api/feedback`               | Public      | Submit feedback (rate-limited) |
| GET    | `/api/feedback`               | Admin (JWT) | List with pagination & filters |
| GET    | `/api/feedback/stats`         | Admin (JWT) | Counts + average rating        |
| GET    | `/api/feedback/:id`           | Admin (JWT) | Get one                        |
| PATCH  | `/api/feedback/:id/status`    | Admin (JWT) | Approve / reject / pending     |
| DELETE | `/api/feedback/:id`           | Admin (JWT) | Delete                         |
| GET    | `/health`                     | Public      | Health check                   |

### Submit feedback

```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rohit Sharma",
    "email": "rohit@example.com",
    "product": "Windows Cleaner Pro",
    "rating": 5,
    "message": "Excellent product!"
  }'
```

### Admin list

```bash
curl http://localhost:5000/api/feedback?status=pending&page=1&limit=20 \
  -H "Authorization: Bearer <ADMIN_JWT>"
```

## Validation Rules

- `name`        required, ≤ 100 chars
- `email`       required, valid email, ≤ 255 chars
- `product`     optional, ≤ 150 chars
- `rating`      optional, integer 1–5 (defaults to 5)
- `message`     required, 3–1000 chars

## Security

- Helmet for HTTP headers
- CORS configurable via `CORS_ORIGIN`
- `express-rate-limit` on the public POST endpoint (default 20 req / 15 min / IP)
- JWT-protected admin routes with role check (`role === 'admin'`)
- All inputs validated via `express-validator`
- IP address stored for abuse tracking

## Frontend integration

Replace the `handleFeedbackSubmit` in `src/components/HeroSection.tsx`:

```ts
await fetch("http://localhost:5000/api/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(feedbackForm),
});
```