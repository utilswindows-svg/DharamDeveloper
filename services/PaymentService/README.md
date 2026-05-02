# PaymentService

A lightweight payment service for customer payment requests.

## Available endpoints

- `POST /api/payments/create` - create a new payment request
- `GET /api/payments/status/:paymentId` - fetch payment status
- `POST /api/payments/webhook` - update payment status from webhook events

## Run locally

1. Copy the example env file:
   ```sh
   cp .env.example .env
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the app:
   ```sh
   npm run dev
   ```

The service will listen on `http://localhost:5001` by default.
