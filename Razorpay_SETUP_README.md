# Pulse & Pause — Full Setup (Frontend + Backend + Razorpay + MongoDB)

This project has been fixed and wired end‑to‑end.

## Prerequisites
- Node 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)
- Razorpay test keys from dashboard

## 1) Backend (server/)
Create `server/.env` from `server/.env.example`:
```
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/seminar_registrations
RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
```

Install & run:
```
cd server
npm i
npm run dev   # or: npm start
```

Endpoints:
- `POST /api/register` — save form fields, returns `{ data: { id } }`
- `POST /api/create-order` — body `{ amount, registrationId }`, returns `order { id, amount, currency }`
- `POST /api/verify-payment` — body `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId }`

## 2) Frontend
Create `.env` from `.env.example`:
```
VITE_API_URL=          # leave empty to use vite proxy
VITE_ENABLE_PAYMENT=true
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXX
```

Install & run:
```
npm i
npm run dev
```

Notes:
- Razorpay SDK script is included in `index.html` (`<head>`).
- Vite dev server proxies `/api` to `http://localhost:5000` (see `vite.config.ts`).

## 3) End‑to‑End Flow
1. Submit the form → `POST /api/register` (DB document `paymentStatus: 'pending'`).
2. Backend creates order → `POST /api/create-order` (₹99 => `9900` paise).
3. Razorpay opens with `order_id`.
4. On success, frontend calls `POST /api/verify-payment`.
5. Backend verifies signature & updates `paymentStatus: 'success'`.

## 4) Troubleshooting
- **Payment popup not opening**: confirm the SDK script tag exists in `index.html`.
- **Payment failed**: ensure amount sent to backend is in **paise**; confirm keys in `server/.env` and `VITE_RAZORPAY_KEY_ID` in frontend `.env`.
- **CORS issues**: dev mode should use proxy; otherwise set `VITE_API_URL` to `http://localhost:5000` and ensure `FRONTEND_ORIGIN` in server `.env` matches your frontend origin.