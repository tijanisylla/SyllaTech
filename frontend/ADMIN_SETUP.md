# Admin Page Setup

The admin page lets you view all form submissions (newsletter, bookings, contact) in one place.

## Access

Go to **`/admin`** on your site (e.g. `http://localhost:3000/admin`).

## Login

1. Set `ADMIN_SECRET_KEY` in `backend/.env` to a strong password.
2. On the admin page, enter that key and click Login.

## Requirements

- Backend must be running (PostgreSQL + FastAPI)
- Frontend must point to the backend (`REACT_APP_BACKEND_URL` in `frontend/.env`)

## Flow

1. Forms submit to your backend → stored in PostgreSQL
2. Admin page fetches from your backend (requires the secret key)
