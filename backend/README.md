# Auth Backend — Node.js + Express + MySQL + JWT (Email & SMS OTP)

Production-ready authentication backend with signup, login, JWT (access + refresh), forgot-password OTP delivered via **real Email (Nodemailer/SMTP)** and **SMS (Twilio)**, protected routes, input validation, centralized error handling, and in-memory rate limiting.

## Tech Stack

- Node.js + Express
- MySQL via Sequelize ORM
- In-memory (OTP storage, refresh-token whitelist, rate limiting, OTP cooldown) — note: not suitable for multi-instance deployments
- JWT (access + refresh)
- bcrypt password hashing
- express-validator
- **Nodemailer** for transactional email (Gmail / SendGrid / Mailgun / Brevo / SES SMTP)
- **Twilio** for SMS OTP
- helmet, cors, morgan

## Setup

### 1. Prerequisites
- Node.js 18+, MySQL 8+
- Either a working SMTP account (e.g. Gmail App Password, SendGrid SMTP key) **or** a Twilio account — or both

### 2. Install
```bash
npm install
cp .env.example .env
# fill in DB, JWT, SMTP, and/or Twilio settings
```

### 3. Database
```bash
npm run db:sync          # uses Sequelize sync (recommended)
# OR
mysql -u root -p < scripts/schema.sql
```

### 4. Run
```bash
npm run dev
# server starts on http://localhost:5000
```

On boot you'll see ✅ MySQL / ✅ SMTP. Twilio is verified lazily on first SMS send.

---

## Configuring Real OTP Delivery

### Email (Nodemailer SMTP)

Set these in `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false              # true for port 465, false for 587/STARTTLS
SMTP_USER=you@example.com
SMTP_PASSWORD=your_app_password_or_smtp_key
EMAIL_FROM="Auth App <no-reply@yourdomain.com>"
```

Common providers:
| Provider  | Host                        | Port | Secure | Notes |
|-----------|-----------------------------|------|--------|-------|
| Gmail     | `smtp.gmail.com`            | 587  | false  | Use a [Google App Password](https://myaccount.google.com/apppasswords) — not your Gmail login |
| SendGrid  | `smtp.sendgrid.net`         | 587  | false  | `SMTP_USER=apikey`, `SMTP_PASSWORD=<your API key>` |
| Mailgun   | `smtp.mailgun.org`          | 587  | false  | Use Mailgun SMTP credentials (not the API key) |
| Brevo     | `smtp-relay.brevo.com`      | 587  | false  | Use SMTP key from Brevo dashboard |
| AWS SES   | `email-smtp.<region>.amazonaws.com` | 587 | false | Use SES SMTP credentials |

If SMTP is unset or fails, the OTP is logged to the server console so you can keep developing.

### SMS (Twilio)

1. Create a Twilio account → buy/choose a sender number → grab Account SID & Auth Token
2. Set in `.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+15555555555
```
3. Phone numbers MUST be in E.164 format (e.g. `+14155552671`)

> **Anti-fraud tip**: enable Twilio's *SMS Pumping Protection* and lock down *SMS Geo Permissions* to the countries you actually serve before going to production.

If Twilio creds are missing, OTPs sent over SMS are logged to the console.

---

## API Endpoints

All under `/api`.

| Method | Path                       | Auth | Body                                                                                  |
|--------|----------------------------|------|---------------------------------------------------------------------------------------|
| POST   | `/auth/signup`             | —    | `{ name, email, password, phone? }` (phone in E.164)                                  |
| POST   | `/auth/login`              | —    | `{ email, password }`                                                                 |
| POST   | `/auth/refresh`            | —    | `{ refreshToken }`                                                                    |
| POST   | `/auth/forgot-password`    | —    | `{ email }` or `{ phone }` (+ optional `channel: "email"\|"sms"`)                     |
| POST   | `/auth/verify-otp`         | —    | `{ email\|phone, otp, channel? }`                                                     |
| POST   | `/auth/reset-password`     | —    | `{ email\|phone, newPassword, channel? }` (after `verify-otp`)                        |
| GET    | `/user/profile`            | JWT  | —                                                                                     |

### Channel selection
- If `channel` is provided, it wins.
- Otherwise: presence of `phone` → `sms`, presence of `email` → `email`.

### Example flow — Email OTP
```bash
curl -X POST https://api.windowsutils.com/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com"}'
# → Email arrives in Jane's inbox with a 6-digit code

curl -X POST https://api.windowsutils.com/api/auth/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","otp":"482917"}'

curl -X POST https://api.windowsutils.com/api/auth/reset-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","newPassword":"NewPassw0rd!"}'
```

### Example flow — SMS OTP
```bash
curl -X POST https://api.windowsutils.com/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"phone":"+14155552671","channel":"sms"}'

curl -X POST https://api.windowsutils.com/api/auth/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{"phone":"+14155552671","otp":"482917","channel":"sms"}'

curl -X POST https://api.windowsutils.com/api/auth/reset-password \
  -H 'Content-Type: application/json' \
  -d '{"phone":"+14155552671","newPassword":"NewPassw0rd!","channel":"sms"}'
```

---

## Security Notes

- Passwords hashed with bcrypt (cost 12).
- OTPs stored in single-use, expire after `OTP_TTL_SECONDS` (default 600s).
- **OTP resend cooldown** of 60 seconds per (channel, identifier) prevents spam → returns `429`.
- Forgot-password endpoint always returns 200 to avoid user enumeration (except cooldown 429s).
- Refresh tokens whitelisted in memory with `jti` so they can be rotated and revoked.
- Password reset revokes all refresh tokens for that user.
- in-memory rate limits: general 100/15min, auth 20/15min, OTP 5/15min.
- helmet sets secure HTTP headers; CORS enabled.
- Phone numbers validated as E.164.

## Project Structure
```
.
├── config/         # db, mailer (SMTP), twilio
├── controllers/    # auth, user
├── middleware/     # auth, validate, error, rateLimit
├── models/         # User (with phone)
├── routes/         # /api/auth, /api/user
├── services/       # otpService, emailService (Nodemailer), smsService (Twilio), tokenService
├── scripts/        # sync.js, schema.sql
├── utils/          # jwt, otp, ApiError
├── app.js
├── server.js
├── .env.example
└── package.json
```

## License
MIT
