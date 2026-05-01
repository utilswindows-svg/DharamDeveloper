# Auth Backend V2

Production-ready auth service: signup, login, JWT access+refresh (with rotation),
email/SMS OTP (verify, login, password reset), role-based access, rate limiting.

**Stack:** Node.js · Express · MySQL (Sequelize) · Redis · JWT · Nodemailer · Twilio

## Folder Structure

```
backend/auth-v2/
├── src/
│   ├── config/         db.js, redis.js
│   ├── models/         User.js
│   ├── services/       otpService.js, emailService.js, smsService.js, tokenService.js
│   ├── controllers/    authController.js
│   ├── routes/         authRoutes.js
│   ├── validators/     authValidator.js
│   ├── middlewares/    auth.js, validate.js, errorHandler.js
│   ├── app.js
│   └── server.js
├── sql/schema.sql
├── .env.example
└── package.json
```

## Setup

```bash
cd backend/auth-v2
cp .env.example .env     # edit DB / SMTP / Twilio / JWT secrets
npm install
npm run dev              # starts on PORT (default 5001)
```

Redis is optional in dev (falls back to in-memory). Use Redis in production.

## Endpoints (all under `/api/auth`)

| Method | Path                | Auth   | Description                                  |
|--------|---------------------|--------|----------------------------------------------|
| POST   | `/signup`           | Public | Create account + send email verification OTP |
| POST   | `/login`            | Public | Email + password → access & refresh tokens   |
| POST   | `/otp/request`      | Public | Send OTP via `email` or `sms`                |
| POST   | `/otp/verify`       | Public | Verify OTP (`verify` / `login` / `reset`)    |
| POST   | `/password/reset`   | Public | OTP + new password → updates password        |
| POST   | `/refresh`          | Public | Rotate refresh token → new access+refresh    |
| POST   | `/logout`           | Public | Revoke refresh token                         |
| GET    | `/me`               | JWT    | Current user                                 |

### OTP request body
```json
{ "identifier": "user@example.com", "channel": "email", "purpose": "reset" }
```
`purpose` ∈ `verify` | `reset` | `login` · `channel` ∈ `email` | `sms`

### Password reset flow
1. `POST /otp/request` with `purpose: "reset"`
2. `POST /password/reset` with `{ identifier, code, newPassword }`

## Security

- Passwords hashed with bcrypt (cost 12)
- OTPs hashed in Redis, max 5 attempts, configurable TTL
- JWT access (15m) + refresh (7d) with **rotation** and server-side revocation
- Helmet, CORS, per-route rate limiting (stricter on OTP)
- Reset endpoint avoids account enumeration
- Role-based middleware (`requireRole('admin')`)

## Notes

- Runs independently from the Feedback API — different `PORT` and DB.
- For production SMS: enable Twilio **SMS Pumping Protection** & **Geo Permissions**.