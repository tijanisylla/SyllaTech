from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, BackgroundTasks, Request
from fastapi.responses import HTMLResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import io
import csv
import json
import logging
import smtplib
import requests
from urllib.parse import quote
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid as uuid_module
from datetime import datetime, timezone
import asyncpg

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# PostgreSQL connection
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'postgresql://localhost:5432/syllatech'
)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pool will be set on startup
pool: Optional[asyncpg.Pool] = None


async def get_db():
    return pool


async def _get_admin_secret():
    """Get admin secret: DB overrides env."""
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT value FROM admin_settings WHERE key = 'admin_secret'")
        if row and (row["value"] or "").strip():
            return (row["value"] or "").strip()
    return (os.environ.get("ADMIN_SECRET_KEY") or "").strip()


async def require_admin(x_api_key: Optional[str] = Header(None, alias="x-api-key")):
    secret = await _get_admin_secret()
    key = (x_api_key or "").strip()
    if not secret or key != secret:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return key


# Pydantic models
class StatusCheck(BaseModel):
    id: str
    client_name: str
    timestamp: datetime


class StatusCheckCreate(BaseModel):
    client_name: str


class NewsletterSubmit(BaseModel):
    email: str


class BookingSubmit(BaseModel):
    date: Optional[str] = None
    date_iso: Optional[str] = None  # YYYY-MM-DD for availability queries
    time: Optional[str] = None
    name: str
    email: str
    phone: Optional[str] = None
    business: Optional[str] = None
    message: Optional[str] = None


class ContactSubmit(BaseModel):
    name: str
    email: str
    business: Optional[str] = None
    message: str


# Init database tables
async def init_db(conn):
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS status_checks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_name VARCHAR(255) NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            date VARCHAR(100),
            date_iso VARCHAR(10),
            time VARCHAR(50),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            business VARCHAR(100),
            message TEXT,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    try:
        await conn.execute("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS date_iso VARCHAR(10)")
        rows = await conn.fetch("SELECT id, date FROM bookings WHERE date_iso IS NULL AND date IS NOT NULL")
        for r in rows:
            try:
                parsed = datetime.strptime(r["date"], "%A, %B %d, %Y")
                date_iso_val = parsed.strftime("%Y-%m-%d")
                await conn.execute("UPDATE bookings SET date_iso = $1 WHERE id = $2", date_iso_val, r["id"])
            except (ValueError, TypeError):
                pass
    except Exception:
        pass
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            business VARCHAR(100),
            message TEXT NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS unsubscribed_emails (
            email VARCHAR(255) PRIMARY KEY,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS visits (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            path VARCHAR(500),
            country VARCHAR(100),
            region VARCHAR(200),
            city VARCHAR(200),
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_visits_timestamp ON visits(timestamp)")
    await conn.execute("CREATE INDEX IF NOT EXISTS idx_visits_country ON visits(country)")
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS booking_config (
            key VARCHAR(50) PRIMARY KEY,
            value JSONB NOT NULL
        )
    """)
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS admin_settings (
            key VARCHAR(50) PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    # Seed admin secret from env if not in DB
    admin_row = await conn.fetchrow("SELECT 1 FROM admin_settings WHERE key = 'admin_secret'")
    if not admin_row:
        env_secret = (os.environ.get('ADMIN_SECRET_KEY') or '').strip()
        if env_secret:
            await conn.execute(
                "INSERT INTO admin_settings (key, value) VALUES ('admin_secret', $1)",
                env_secret,
            )

    # Seed default time slots if empty
    row = await conn.fetchrow("SELECT 1 FROM booking_config WHERE key = 'time_slots'")
    if not row:
        default_slots = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ]
        await conn.execute(
            "INSERT INTO booking_config (key, value) VALUES ('time_slots', $1::jsonb)",
            json.dumps(default_slots),
        )


@app.on_event("startup")
async def startup():
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
    async with pool.acquire() as conn:
        await init_db(conn)


@app.on_event("shutdown")
async def shutdown():
    global pool
    if pool:
        await pool.close()


# Routes
class TrackVisitBody(BaseModel):
    path: Optional[str] = None


def _get_client_ip(request: Request) -> str:
    """Get client IP, considering X-Forwarded-For when behind proxy."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else ""


def _fetch_geo(ip: str) -> tuple[str, str, str]:
    """Fetch country, region, city from IP. Returns (country, region, city)."""
    if not ip or ip in ("127.0.0.1", "localhost", "::1"):
        return ("Local", "Local", "")
    try:
        r = requests.get(
            f"http://ip-api.com/json/{ip}?fields=status,country,regionName,city",
            timeout=2,
        )
        if r.status_code == 200:
            d = r.json()
            if d.get("status") == "success":
                return (
                    d.get("country") or "Unknown",
                    d.get("regionName") or "",
                    d.get("city") or "",
                )
    except Exception:
        pass
    return ("Unknown", "", "")


async def _save_visit_task(ip: str, path: str):
    """Background task to fetch geo and save visit."""
    import asyncio
    try:
        country, region, city = await asyncio.to_thread(_fetch_geo, ip)
        async with pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO visits (path, country, region, city) VALUES ($1, $2, $3, $4)",
                path,
                country,
                region or None,
                city or None,
            )
    except Exception as e:
        logger.exception("Failed to save visit: %s", e)


@api_router.post("/track")
async def track_visit(data: TrackVisitBody, request: Request, background_tasks: BackgroundTasks):
    """Record a page visit. Called by frontend on page load."""
    ip = _get_client_ip(request)
    path = (data.path or "/").strip()[:500]
    background_tasks.add_task(_save_visit_task, ip, path)
    return {"status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO status_checks (id, client_name, timestamp)
            VALUES ($1, $2, $3)
            RETURNING id, client_name, timestamp
            """,
            str(uuid_module.uuid4()),
            input.client_name,
            datetime.now(timezone.utc),
        )
    return StatusCheck(id=str(row['id']), client_name=row['client_name'], timestamp=row['timestamp'])


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, client_name, timestamp FROM status_checks ORDER BY timestamp DESC LIMIT 1000"
        )
    return [
        StatusCheck(id=str(r['id']), client_name=r['client_name'], timestamp=r['timestamp'])
        for r in rows
    ]


@api_router.post("/submissions/newsletter")
async def submit_newsletter(data: NewsletterSubmit, background_tasks: BackgroundTasks):
    email_clean = (data.email or "").strip()
    if not email_clean:
        raise HTTPException(status_code=400, detail="Email is required")
    async with pool.acquire() as conn:
        existing = await conn.fetchrow(
            "SELECT 1 FROM newsletter_subscribers WHERE LOWER(email) = LOWER($1)",
            email_clean,
        )
        if existing:
            raise HTTPException(status_code=409, detail="This email is already subscribed.")
        await conn.execute(
            "INSERT INTO newsletter_subscribers (email) VALUES ($1)",
            email_clean,
        )

    # Send welcome email (thank you for subscribing)
    from_email = (os.environ.get("EMAIL_FROM") or "").strip() or "noreply@example.com"
    smtp_host = (os.environ.get("SMTP_HOST") or "").strip()
    if smtp_host:
        smtp_config = {
            "host": smtp_host,
            "port": int(os.environ.get("SMTP_PORT") or "587"),
            "user": (os.environ.get("SMTP_USER") or "").strip() or None,
            "password": (os.environ.get("SMTP_PASSWORD") or "").strip() or None,
            "tls": True,
        }
        html = _newsletter_welcome_html()
        subject = "Welcome to SyllaTech — You're In!"
        background_tasks.add_task(
            _send_email_sync,
            email_clean,
            subject,
            html,
            from_email,
            smtp_config,
            append_unsubscribe=True,
        )

    return {"status": "ok"}


DEFAULT_TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
]


@api_router.get("/booking/config")
async def get_booking_config():
    """Public: Get available time slots and booking rules for the booking form."""
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'time_slots'")
        time_slots = json.loads(row["value"]) if row and row["value"] else DEFAULT_TIME_SLOTS
        blocked = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'blocked_dates'")
        blocked_dates = json.loads(blocked["value"]) if blocked and blocked["value"] else []
        weekdays = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'available_weekdays'")
        available_weekdays = json.loads(weekdays["value"]) if weekdays and weekdays["value"] else [1, 2, 3, 4, 5]
    return {"timeSlots": time_slots, "blockedDates": blocked_dates, "availableWeekdays": available_weekdays}


@api_router.get("/availability")
async def get_availability(date: str):
    """Get taken time slots for a date. Query param: date=YYYY-MM-DD"""
    async with pool.acquire() as conn:
        blocked = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'blocked_dates'")
        blocked_dates = json.loads(blocked["value"]) if blocked and blocked["value"] else []
        if date in blocked_dates:
            row = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'time_slots'")
            all_slots = json.loads(row["value"]) if row and row["value"] else DEFAULT_TIME_SLOTS
            return {"taken": all_slots}
        rows = await conn.fetch(
            "SELECT time FROM bookings WHERE date_iso = $1",
            date,
        )
    taken = [r["time"] for r in rows if r["time"]]
    return {"taken": taken}


LOGO_BASE64 = "PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjgiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNMTYgMTBDMTIuNSAxMCAxMCAxMiAxMCAxNC41QzEwIDE3IDEyIDE4LjUgMTYgMTkuNUMyMCAyMC41IDIyIDIyIDIyIDI0LjVDMjIgMjcgMTkuNSAyOSAxNiAyOUMxMi41IDI5IDEwIDI3LjUgMTAgMjUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIyMiIgY3k9IjEzIiByPSIyIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+PHRleHQgeD0iNDIiIHk9IjI4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2Y4ZmFmYyI+PHRzcGFuIGZpbGw9InVybCgjZykiPlN5bGxhPC90c3Bhbj48dHNwYW4gZmlsbD0iI2Y4ZmFmYyI+VGVjaDwvdHNwYW4+PC90ZXh0Pjwvc3ZnPg=="


def _booking_confirmation_html(name: str, date: str, time: str) -> str:
    """Build HTML email for booking confirmation with actual date and time."""
    date_display = date or "your chosen date"
    time_display = time or ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - SyllaTech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #030712; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="data:image/svg+xml;base64,{LOGO_BASE64}" alt="SyllaTech" width="180" height="36" style="display: block; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 48px 40px;">
              <span style="display: inline-block; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.3); border-radius: 9999px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #22d3ee; margin-bottom: 24px;">Booking Confirmed</span>
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.3;">Hi {_escape_html(name)}!</h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #94a3b8; line-height: 1.6;">Your free consultation is confirmed.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #1e293b; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Date</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">{_escape_html(date_display)}</p>
                    <p style="margin: 16px 0 8px; font-size: 13px; color: #64748b;">Time</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">{_escape_html(time_display)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">We'll send a calendar invite shortly. If you need to reschedule, reply to this email or contact us.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">SyllaTech — Premium Websites & Full-Stack Apps</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _escape_html(s: str) -> str:
    if not s:
        return ""
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def _owner_booking_notification_html(name: str, email: str, date: str, time: str, phone: str, business: str, message: str) -> str:
    """Build HTML email for owner: new booking notification & reminder."""
    phone_display = _escape_html(phone or "—")
    business_display = _escape_html(business or "—")
    message_display = _escape_html(message or "—")
    date_display = _escape_html(date or "—")
    time_display = _escape_html(time or "—")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking - SyllaTech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #030712; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <img src="data:image/svg+xml;base64,{LOGO_BASE64}" alt="SyllaTech" width="180" height="36" style="display: block; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 40px;">
              <span style="display: inline-block; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 9999px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #22c55e; margin-bottom: 24px;">📅 New Booking</span>
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #ffffff;">Consultation Scheduled</h1>
              <p style="margin: 0 0 24px; font-size: 15px; color: #94a3b8;">A visitor just booked a consultation. Reminder details below.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #1e293b; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Date</span></td></tr>
                      <tr><td style="padding: 0 0 12px;"><span style="color: #fff; font-size: 16px; font-weight: 600;">{date_display}</span></td></tr>
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Time</span></td></tr>
                      <tr><td style="padding: 0 0 12px;"><span style="color: #fff; font-size: 16px; font-weight: 600;">{time_display}</span></td></tr>
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Name</span></td></tr>
                      <tr><td style="padding: 0 0 12px;"><span style="color: #fff; font-size: 16px;">{_escape_html(name)}</span></td></tr>
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Email</span></td></tr>
                      <tr><td style="padding: 0 0 12px;"><a href="mailto:{_escape_html(email)}" style="color: #22d3ee; font-size: 16px; text-decoration: none;">{_escape_html(email)}</a></td></tr>
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Phone</span></td></tr>
                      <tr><td style="padding: 0 0 12px;"><span style="color: #fff; font-size: 16px;">{phone_display}</span></td></tr>
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Business</span></td></tr>
                      <tr><td style="padding: 0 0 12px;"><span style="color: #fff; font-size: 16px;">{business_display}</span></td></tr>
                      <tr><td style="padding: 6px 0;"><span style="color: #64748b; font-size: 13px;">Message</span></td></tr>
                      <tr><td style="padding: 0 0 0;"><span style="color: #cbd5e1; font-size: 15px; white-space: pre-wrap;">{message_display}</span></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 13px; color: #64748b;">Check your admin dashboard for full details.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">SyllaTech Admin Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _newsletter_welcome_html() -> str:
    """Build HTML email for newsletter welcome (thank you for subscribing)."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SyllaTech</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #030712; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="data:image/svg+xml;base64,{LOGO_BASE64}" alt="SyllaTech" width="180" height="36" style="display: block; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 48px 40px;">
              <span style="display: inline-block; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); border-radius: 9999px; padding: 8px 16px; font-size: 13px; font-weight: 600; color: #a78bfa; margin-bottom: 24px;">✨ You're In!</span>
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.3;">Thanks for subscribing!</h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #94a3b8; line-height: 1.6;">You're now part of the SyllaTech community. We'll send you web development tips, exclusive offers, and free resources — no spam, ever.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 8px 0;"><span style="color: #22d3ee;">✓</span> <span style="color: #cbd5e1; font-size: 15px;">Web development tips & trends</span></td></tr>
                <tr><td style="padding: 8px 0;"><span style="color: #22d3ee;">✓</span> <span style="color: #cbd5e1; font-size: 15px;">Exclusive early-bird discounts</span></td></tr>
                <tr><td style="padding: 8px 0;"><span style="color: #22d3ee;">✓</span> <span style="color: #cbd5e1; font-size: 15px;">Free resources & templates</span></td></tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://syllatech.com/#services" style="display: inline-block; background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px;">Explore our services →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">SyllaTech — Premium Websites & Full-Stack Apps</p>
              <p style="margin: 12px 0 0; font-size: 12px; color: #64748b;"><a href="{{{{UNSUBSCRIBE_URL}}}}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> from these emails</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


@api_router.post("/submissions/bookings")
async def submit_booking(data: BookingSubmit, background_tasks: BackgroundTasks):
    async with pool.acquire() as conn:
        if data.date_iso and data.time:
            existing = await conn.fetchrow(
                "SELECT 1 FROM bookings WHERE date_iso = $1 AND time = $2",
                data.date_iso,
                data.time,
            )
            if existing:
                raise HTTPException(status_code=409, detail="This time slot is no longer available. Please choose another.")
        await conn.execute(
            """
            INSERT INTO bookings (date, date_iso, time, name, email, phone, business, message)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
            data.date,
            data.date_iso,
            data.time,
            data.name,
            data.email,
            data.phone,
            data.business,
            data.message,
        )

    # Send booking confirmation email (with actual date/time)
    from_email = (os.environ.get("EMAIL_FROM") or "").strip() or "noreply@example.com"
    smtp_host = (os.environ.get("SMTP_HOST") or "").strip()
    if smtp_host:
        smtp_config = {
            "host": smtp_host,
            "port": int(os.environ.get("SMTP_PORT") or "587"),
            "user": (os.environ.get("SMTP_USER") or "").strip() or None,
            "password": (os.environ.get("SMTP_PASSWORD") or "").strip() or None,
            "tls": True,
        }
        html = _booking_confirmation_html(
            name=data.name,
            date=data.date or (data.date_iso or ""),
            time=data.time or "",
        )
        subject = "Your SyllaTech consultation is confirmed"
        background_tasks.add_task(
            _send_email_sync,
            data.email,
            subject,
            html,
            from_email,
            smtp_config,
        )
        # Send owner notification & reminder
        owner_email = (os.environ.get("OWNER_NOTIFICATION_EMAIL") or "").strip() or from_email
        if owner_email:
            owner_html = _owner_booking_notification_html(
                name=data.name,
                email=data.email,
                date=data.date or (data.date_iso or ""),
                time=data.time or "",
                phone=data.phone or "",
                business=data.business or "",
                message=data.message or "",
            )
            owner_subject = f"New booking: {data.name} — {data.date or data.date_iso or ''} at {data.time or ''}"
            background_tasks.add_task(
                _send_email_sync,
                owner_email,
                owner_subject,
                owner_html,
                from_email,
                smtp_config,
            )

    return {"status": "ok"}


@api_router.post("/submissions/contact")
async def submit_contact(data: ContactSubmit):
    async with pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO contact_submissions (name, email, business, message)
            VALUES ($1, $2, $3, $4)
            """,
            data.name,
            data.email,
            data.business,
            data.message,
        )
    return {"status": "ok"}


# CSV Export
def _to_csv(rows: list, fieldnames: list) -> str:
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for r in rows:
        writer.writerow({k: (r.get(k) or "") for k in fieldnames})
    return output.getvalue()


@api_router.get("/admin/export/newsletter")
async def export_newsletter_csv(_: str = Depends(require_admin)):
    """Export newsletter subscribers as CSV."""
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT email, timestamp FROM newsletter_subscribers ORDER BY timestamp DESC"
        )
    data = [{"email": r["email"], "timestamp": (r["timestamp"].isoformat() if r["timestamp"] else "")} for r in rows]
    csv_content = _to_csv(data, ["email", "timestamp"])
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=newsletter-subscribers.csv"},
    )


@api_router.get("/admin/export/bookings")
async def export_bookings_csv(_: str = Depends(require_admin)):
    """Export bookings as CSV."""
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT date, date_iso, time, name, email, phone, business, message, timestamp
               FROM bookings ORDER BY timestamp DESC"""
        )
    data = [
        {
            "date": r["date"] or "",
            "date_iso": r["date_iso"] or "",
            "time": r["time"] or "",
            "name": r["name"] or "",
            "email": r["email"] or "",
            "phone": r["phone"] or "",
            "business": r["business"] or "",
            "message": (r["message"] or "").replace("\n", " "),
            "timestamp": (r["timestamp"].isoformat() if r["timestamp"] else ""),
        }
        for r in rows
    ]
    csv_content = _to_csv(
        data,
        ["date", "date_iso", "time", "name", "email", "phone", "business", "message", "timestamp"],
    )
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=bookings.csv"},
    )


@api_router.get("/admin/export/contact")
async def export_contact_csv(_: str = Depends(require_admin)):
    """Export contact submissions as CSV."""
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT name, email, business, message, timestamp FROM contact_submissions ORDER BY timestamp DESC"
        )
    data = [
        {
            "name": r["name"] or "",
            "email": r["email"] or "",
            "business": r["business"] or "",
            "message": (r["message"] or "").replace("\n", " "),
            "timestamp": (r["timestamp"].isoformat() if r["timestamp"] else ""),
        }
        for r in rows
    ]
    csv_content = _to_csv(data, ["name", "email", "business", "message", "timestamp"])
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=contact-submissions.csv"},
    )


class BookingConfigUpdate(BaseModel):
    time_slots: Optional[List[str]] = None
    blocked_dates: Optional[List[str]] = None
    available_weekdays: Optional[List[int]] = None


@api_router.get("/admin/booking/config")
async def get_admin_booking_config(_: str = Depends(require_admin)):
    """Admin: Get full booking configuration."""
    async with pool.acquire() as conn:
        slots = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'time_slots'")
        blocked = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'blocked_dates'")
        weekdays = await conn.fetchrow("SELECT value FROM booking_config WHERE key = 'available_weekdays'")
    return {
        "time_slots": json.loads(slots["value"]) if slots and slots["value"] else DEFAULT_TIME_SLOTS,
        "blocked_dates": json.loads(blocked["value"]) if blocked and blocked["value"] else [],
        "available_weekdays": json.loads(weekdays["value"]) if weekdays and weekdays["value"] else [1, 2, 3, 4, 5],
    }


@api_router.put("/admin/booking/config")
async def update_booking_config(data: BookingConfigUpdate, _: str = Depends(require_admin)):
    """Admin: Update booking configuration."""
    async with pool.acquire() as conn:
        if data.time_slots is not None:
            await conn.execute(
                "INSERT INTO booking_config (key, value) VALUES ('time_slots', $1::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
                json.dumps(data.time_slots),
            )
        if data.blocked_dates is not None:
            await conn.execute(
                "INSERT INTO booking_config (key, value) VALUES ('blocked_dates', $1::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
                json.dumps(data.blocked_dates),
            )
        if data.available_weekdays is not None:
            valid = [d for d in data.available_weekdays if 0 <= d <= 6]
            await conn.execute(
                "INSERT INTO booking_config (key, value) VALUES ('available_weekdays', $1::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
                json.dumps(valid),
            )
    return {"status": "updated"}


class ChangePasswordBody(BaseModel):
    current_password: str
    new_password: str


@api_router.put("/admin/password")
async def change_admin_password(data: ChangePasswordBody, _: str = Depends(require_admin)):
    """Admin: Change admin secret. Requires current password."""
    secret = await _get_admin_secret()
    if (data.current_password or "").strip() != secret:
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    new_val = (data.new_password or "").strip()
    if len(new_val) < 4:
        raise HTTPException(status_code=400, detail="New password must be at least 4 characters")
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO admin_settings (key, value) VALUES ('admin_secret', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            new_val,
        )
    return {"status": "updated"}


# Admin endpoints
@api_router.get("/admin/analytics")
async def get_analytics(_: str = Depends(require_admin)):
    """Return visit stats: total, today, by country, by region."""
    today_date = datetime.now(timezone.utc).date()
    async with pool.acquire() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM visits")
        today_count = await conn.fetchval(
            "SELECT COUNT(*) FROM visits WHERE timestamp::date = $1", today_date
        )
        by_country = await conn.fetch(
            """
            SELECT country, COUNT(*) as count
            FROM visits
            WHERE country IS NOT NULL AND country != ''
            GROUP BY country
            ORDER BY count DESC
            LIMIT 15
            """
        )
        by_region = await conn.fetch(
            """
            SELECT country, region, COUNT(*) as count
            FROM visits
            WHERE country IS NOT NULL AND (region IS NOT NULL AND region != '')
            GROUP BY country, region
            ORDER BY count DESC
            LIMIT 15
            """
        )
        recent = await conn.fetch(
            """
            SELECT path, country, region, city, timestamp
            FROM visits
            ORDER BY timestamp DESC
            LIMIT 20
            """
        )
        visits_by_date = await conn.fetch(
            """
            SELECT timestamp::date as date, COUNT(*) as count
            FROM visits
            WHERE timestamp >= (CURRENT_DATE - INTERVAL '14 days')
            GROUP BY timestamp::date
            ORDER BY date ASC
            """
        )
    return {
        "total_visits": total or 0,
        "visits_today": today_count or 0,
        "by_country": [{"country": r["country"], "count": r["count"]} for r in by_country],
        "by_region": [
            {"country": r["country"], "region": r["region"], "count": r["count"]}
            for r in by_region
        ],
        "visits_by_date": [
            {"date": str(r["date"]), "count": r["count"]} for r in visits_by_date
        ],
        "recent": [
            {
                "path": r["path"],
                "country": r["country"],
                "region": r["region"],
                "city": r["city"],
                "timestamp": r["timestamp"].isoformat() if r["timestamp"] else None,
            }
            for r in recent
        ],
    }


@api_router.get("/admin/submissions")
async def get_submissions(
    type: str,  # query param; use different name to avoid shadowing builtin
    _: str = Depends(require_admin),
):
    submission_type = type
    if submission_type == "newsletter":
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT id, email, timestamp FROM newsletter_subscribers ORDER BY timestamp DESC LIMIT 1000"
            )
    elif submission_type == "bookings":
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """SELECT id, date, date_iso, time, name, email, phone, business, message, timestamp
                   FROM bookings ORDER BY timestamp DESC LIMIT 1000"""
            )
    elif submission_type == "contact":
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """SELECT id, name, email, business, message, timestamp
                   FROM contact_submissions ORDER BY timestamp DESC LIMIT 1000"""
            )
    elif submission_type == "unsubscribed":
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT email as id, email, timestamp FROM unsubscribed_emails ORDER BY timestamp DESC LIMIT 1000"
            )
    else:
        raise HTTPException(status_code=400, detail="Invalid type")

    items = []
    for r in rows:
        d = dict(r)
        for k, v in d.items():
            if hasattr(v, 'isoformat'):
                d[k] = v.isoformat() if v else None
            elif isinstance(v, uuid_module.UUID):
                d[k] = str(v)
        items.append(d)

    return {"items": items}


@api_router.delete("/admin/submissions/unsubscribed/{email}")
async def delete_unsubscribed(email: str, _: str = Depends(require_admin)):
    """Remove email from unsubscribed list (re-subscribe)."""
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM unsubscribed_emails WHERE email = $1", email
        )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "deleted"}


@api_router.delete("/admin/submissions/newsletter/{item_id}")
async def delete_newsletter(item_id: str, _: str = Depends(require_admin)):
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM newsletter_subscribers WHERE id = $1", item_id
        )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "deleted"}


@api_router.put("/admin/submissions/newsletter/{item_id}")
async def update_newsletter(item_id: str, data: NewsletterSubmit, _: str = Depends(require_admin)):
    async with pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE newsletter_subscribers SET email = $1 WHERE id = $2",
            data.email,
            item_id,
        )
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "updated"}


@api_router.delete("/admin/submissions/bookings/{item_id}")
async def delete_booking(item_id: str, _: str = Depends(require_admin)):
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM bookings WHERE id = $1", item_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "deleted"}


class BookingUpdate(BaseModel):
    date: Optional[str] = None
    date_iso: Optional[str] = None
    time: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    business: Optional[str] = None
    message: Optional[str] = None


@api_router.put("/admin/submissions/bookings/{item_id}")
async def update_booking(
    item_id: str, data: BookingUpdate, _: str = Depends(require_admin)
):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM bookings WHERE id = $1", item_id)
        if not row:
            raise HTTPException(status_code=404, detail="Not found")
        updates = dict(row)
        for k, v in data.model_dump(exclude_unset=True).items():
            updates[k] = v
        if not (updates.get("name") or "").strip() or not (updates.get("email") or "").strip():
            raise HTTPException(status_code=400, detail="Name and email are required")
        await conn.execute(
            """
            UPDATE bookings SET date=$1, date_iso=$2, time=$3, name=$4, email=$5,
                phone=$6, business=$7, message=$8 WHERE id=$9
            """,
            updates.get("date"),
            updates.get("date_iso"),
            updates.get("time"),
            updates.get("name"),
            updates.get("email"),
            updates.get("phone"),
            updates.get("business"),
            updates.get("message"),
            item_id,
        )
    return {"status": "updated"}


@api_router.delete("/admin/submissions/contact/{item_id}")
async def delete_contact(item_id: str, _: str = Depends(require_admin)):
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM contact_submissions WHERE id = $1", item_id
        )
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "deleted"}


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    business: Optional[str] = None
    message: Optional[str] = None


@api_router.put("/admin/submissions/contact/{item_id}")
async def update_contact(
    item_id: str, data: ContactUpdate, _: str = Depends(require_admin)
):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT name, email, business, message FROM contact_submissions WHERE id = $1",
            item_id,
        )
        if not row:
            raise HTTPException(status_code=404, detail="Not found")
        merged = dict(row)
        for k, v in data.model_dump(exclude_unset=True).items():
            if v is not None:
                merged[k] = v
        if not (merged.get("name") or "").strip() or not (merged.get("email") or "").strip():
            raise HTTPException(status_code=400, detail="Name and email are required")
        if not (merged.get("message") or "").strip():
            raise HTTPException(status_code=400, detail="Message is required")
        await conn.execute(
            """
            UPDATE contact_submissions
            SET name = $1, email = $2, business = $3, message = $4 WHERE id = $5
            """,
            merged["name"],
            merged["email"],
            merged["business"],
            merged["message"],
            item_id,
        )
    return {"status": "updated"}


# Email campaign models
class EmailCampaign(BaseModel):
    audience: str  # newsletter | bookings | contact | all
    email_type: str  # offer | news | announcement | update
    subject: str
    html_body: str
    recipients: Optional[List[str]] = None  # if set, send only to these emails


class ReplyEmailBody(BaseModel):
    to: str
    subject: str
    html_body: str


@api_router.get("/unsubscribe", response_class=HTMLResponse)
async def unsubscribe_get(email: str):
    """One-click unsubscribe from email link. Adds email to unsubscribed list."""
    email_clean = (email or "").strip().lower()
    if not email_clean or "@" not in email_clean:
        return HTMLResponse(
            content="<html><body style='font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;'><h2>Invalid request</h2><p>Please use the unsubscribe link from your email.</p></body></html>",
            status_code=400,
        )
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO unsubscribed_emails (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
            email_clean,
        )
    return HTMLResponse(
        content="<html><body style='font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;background:#030712;color:#e2e8f0;padding:40px;'><h2 style='color:#22d3ee;'>You're unsubscribed</h2><p>You won't receive marketing emails from us anymore.</p></body></html>"
    )


class UnsubscribeRequest(BaseModel):
    email: str


@api_router.post("/unsubscribe")
async def unsubscribe_post(data: UnsubscribeRequest):
    """Unsubscribe by email (for frontend form)."""
    email_clean = (data.email or "").strip().lower()
    if not email_clean or "@" not in email_clean:
        raise HTTPException(status_code=400, detail="Invalid email")
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO unsubscribed_emails (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
            email_clean,
        )
    return {"status": "unsubscribed"}


def _get_unsubscribe_url(to_email: str) -> str:
    """Build unsubscribe URL for a recipient."""
    site_url = (os.environ.get("SITE_URL") or "").strip()
    backend_url = (os.environ.get("BACKEND_PUBLIC_URL") or "").strip() or "http://localhost:8000"
    if site_url:
        return f"{site_url.rstrip('/')}/unsubscribe?email={quote(to_email)}"
    return f"{backend_url.rstrip('/')}/api/unsubscribe?email={quote(to_email)}"


def _inject_unsubscribe(html_body: str, to_email: str) -> str:
    """Replace {{UNSUBSCRIBE_URL}} placeholder or append footer to campaign email HTML."""
    url = _get_unsubscribe_url(to_email)
    if "{{UNSUBSCRIBE_URL}}" in html_body:
        return html_body.replace("{{UNSUBSCRIBE_URL}}", url)
    footer = f"""
<div style="margin-top:32px;padding-top:24px;border-top:1px solid #334155;font-size:12px;color:#64748b;text-align:center;">
  <a href="{url}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a> from these emails
</div>"""
    return html_body.rstrip() + footer


def _send_email_sync(to_email: str, subject: str, html_body: str, from_email: str, smtp_config: dict, append_unsubscribe: bool = False):
    """Sync email send via SMTP. Run in thread."""
    if append_unsubscribe:
        html_body = _inject_unsubscribe(html_body, to_email)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))
    with smtplib.SMTP(smtp_config.get("host", "localhost"), smtp_config.get("port", 587)) as smtp:
        if smtp_config.get("tls", True):
            smtp.starttls()
        if smtp_config.get("user") and smtp_config.get("password"):
            smtp.login(smtp_config["user"], smtp_config["password"])
        smtp.sendmail(from_email, to_email, msg.as_string())


@api_router.post("/admin/email/reply")
async def send_reply_email(
    data: ReplyEmailBody,
    background_tasks: BackgroundTasks,
    _: str = Depends(require_admin),
):
    """Send a direct reply email to one recipient. No unsubscribe link (1:1 conversation)."""
    to_email = (data.to or "").strip().lower()
    if not to_email or "@" not in to_email:
        raise HTTPException(status_code=400, detail="Invalid recipient email")
    from_email = (os.environ.get("EMAIL_FROM") or "").strip() or "noreply@example.com"
    smtp_host = (os.environ.get("SMTP_HOST") or "").strip()
    if not smtp_host:
        raise HTTPException(status_code=503, detail="Email not configured. Set SMTP_HOST in .env")
    smtp_config = {
        "host": smtp_host,
        "port": int(os.environ.get("SMTP_PORT") or "587"),
        "user": (os.environ.get("SMTP_USER") or "").strip(),
        "password": (os.environ.get("SMTP_PASSWORD") or "").strip(),
        "tls": True,
    }
    subject = (data.subject or "").strip() or "Message from SyllaTech"
    raw_body = (data.html_body or "").strip() or "No content."
    # If no HTML tags, treat as plain text
    if "<" not in raw_body and ">" not in raw_body:
        html_body = "<p>" + raw_body.replace("\n", "<br/>") + "</p>"
    else:
        html_body = raw_body

    def run_send():
        try:
            _send_email_sync(to_email, subject, html_body, from_email, smtp_config, append_unsubscribe=False)
        except Exception as e:
            logger.exception("Failed to send reply to %s: %s", to_email, e)
            raise

    background_tasks.add_task(run_send)
    return {"status": "sent", "to": to_email}


@api_router.get("/admin/email/recipients")
async def get_email_recipients(
    audience: str,
    _: str = Depends(require_admin),
):
    """Return list of recipients for an audience (email + optional name). Excludes unsubscribed."""
    if audience not in ("newsletter", "bookings", "contact", "all"):
        raise HTTPException(status_code=400, detail="Invalid audience")
    async with pool.acquire() as conn:
        unsub_rows = await conn.fetch("SELECT email FROM unsubscribed_emails")
        unsub_set = {r["email"].lower() for r in unsub_rows if r["email"]}
        if audience == "newsletter":
            rows = await conn.fetch("SELECT email FROM newsletter_subscribers ORDER BY timestamp DESC")
            recipients = [{"email": r["email"], "name": None} for r in rows if (r["email"] or "").strip() and (r["email"] or "").strip().lower() not in unsub_set]
        elif audience == "bookings":
            rows = await conn.fetch(
                "SELECT DISTINCT ON (email) email, name FROM bookings ORDER BY email, timestamp DESC"
            )
            recipients = [
                {"email": r["email"], "name": (r["name"] or "").strip() or None}
                for r in rows if (r["email"] or "").strip() and (r["email"] or "").strip().lower() not in unsub_set
            ]
        elif audience == "contact":
            rows = await conn.fetch(
                "SELECT email, name FROM contact_submissions ORDER BY timestamp DESC"
            )
            recipients = [
                {"email": r["email"], "name": (r["name"] or "").strip() or None}
                for r in rows if (r["email"] or "").strip() and (r["email"] or "").strip().lower() not in unsub_set
            ]
        else:
            rows = await conn.fetch(
                """
                SELECT DISTINCT email FROM (
                    SELECT email FROM newsletter_subscribers
                    UNION SELECT email FROM bookings
                    UNION SELECT email FROM contact_submissions
                ) u
                """
            )
            recipients = [{"email": r["email"], "name": None} for r in rows if (r["email"] or "").strip() and (r["email"] or "").strip().lower() not in unsub_set]
    return {"recipients": recipients}


@api_router.get("/admin/email/audiences")
async def get_email_audiences(_: str = Depends(require_admin)):
    """Return available email audiences with recipient counts."""
    async with pool.acquire() as conn:
        news_count = await conn.fetchval("SELECT COUNT(*) FROM newsletter_subscribers")
        book_count = await conn.fetchval("SELECT COUNT(*) FROM bookings")
        contact_count = await conn.fetchval("SELECT COUNT(*) FROM contact_submissions")
        # All = unique emails across newsletter + bookings + contact
        all_rows = await conn.fetch(
            """
            SELECT DISTINCT email FROM (
                SELECT email FROM newsletter_subscribers
                UNION SELECT email FROM bookings
                UNION SELECT email FROM contact_submissions
            ) u
            """
        )
        all_count = len(all_rows)
    return {
        "audiences": [
            {"id": "newsletter", "label": "Newsletter Subscribers", "count": news_count},
            {"id": "bookings", "label": "Past Bookings", "count": book_count},
            {"id": "contact", "label": "Contact Form Submissions", "count": contact_count},
            {"id": "all", "label": "All (Unique Emails)", "count": all_count},
        ]
    }


@api_router.post("/admin/email/send")
async def send_email_campaign(
    data: EmailCampaign,
    background_tasks: BackgroundTasks,
    _: str = Depends(require_admin),
):
    """Send HTML email to selected audience."""
    from_email = (os.environ.get("EMAIL_FROM") or "").strip() or "noreply@example.com"
    smtp_host = (os.environ.get("SMTP_HOST") or "").strip()
    smtp_port = int(os.environ.get("SMTP_PORT") or "587")
    smtp_user = (os.environ.get("SMTP_USER") or "").strip()
    smtp_pass = (os.environ.get("SMTP_PASSWORD") or "").strip()

    if not smtp_host:
        raise HTTPException(
            status_code=503,
            detail="Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env",
        )

    async with pool.acquire() as conn:
        unsubscribed = await conn.fetch("SELECT email FROM unsubscribed_emails")
        unsub_set = {r["email"].lower() for r in unsubscribed if r["email"]}
        if data.audience == "newsletter":
            rows = await conn.fetch("SELECT email FROM newsletter_subscribers")
        elif data.audience == "bookings":
            rows = await conn.fetch("SELECT DISTINCT email FROM bookings")
        elif data.audience == "contact":
            rows = await conn.fetch("SELECT DISTINCT email FROM contact_submissions")
        elif data.audience == "all":
            rows = await conn.fetch(
                """
                SELECT DISTINCT email FROM (
                    SELECT email FROM newsletter_subscribers
                    UNION SELECT email FROM bookings
                    UNION SELECT email FROM contact_submissions
                ) u
                """
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid audience")

    all_emails = [r["email"] for r in rows if (r["email"] or "").strip() and (r["email"] or "").strip().lower() not in unsub_set]
    if data.recipients:
        valid = set(all_emails)
        recipients = [e for e in data.recipients if (e or "").strip() in valid]
        if not recipients:
            raise HTTPException(status_code=400, detail="No valid recipients in selection")
    else:
        recipients = all_emails
    if not recipients:
        raise HTTPException(status_code=400, detail="No recipients in selected audience")

    smtp_config = {
        "host": smtp_host,
        "port": smtp_port,
        "user": smtp_user or None,
        "password": smtp_pass or None,
        "tls": True,
    }

    def run_send():
        for to_email in recipients:
            try:
                _send_email_sync(to_email, data.subject, data.html_body, from_email, smtp_config, append_unsubscribe=True)
            except Exception as e:
                logger.exception("Failed to send email to %s: %s", to_email, e)

    background_tasks.add_task(run_send)
    return {
        "status": "sending",
        "recipients": len(recipients),
        "message": f"Email queued for {len(recipients)} recipient(s)",
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
