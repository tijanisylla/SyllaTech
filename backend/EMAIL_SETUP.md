# Email Campaigns Setup

The admin dashboard can send HTML emails to your subscribers. Configure SMTP in `backend/.env`:

```env
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# For unsubscribe links in campaign emails (e.g. https://yoursite.com or http://localhost:3000)
SITE_URL=http://localhost:3000
```

## Automatic emails

When SMTP is configured, these emails are sent automatically:

1. **Newsletter welcome** — When someone subscribes, they receive a "Thanks for subscribing!" HTML email with benefits and an unsubscribe link.
2. **Booking confirmation** — When someone books a consultation, they receive an HTML email with their **actual date and time**.
3. **Owner notification** — You receive a reminder email with full booking details (name, email, phone, date, time, business, message). Set `OWNER_NOTIFICATION_EMAIL` in `.env` to control where these go (defaults to `EMAIL_FROM`).

## Unsubscribe

- Campaign emails include an **Unsubscribe** link in the footer
- Recipients can also go to `/unsubscribe` and enter their email
- Unsubscribed emails are excluded from future campaign sends

## Gmail

1. Enable 2FA on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Use that password for `SMTP_PASSWORD`

## Other providers

- **Mailgun**: Use `smtp.mailgun.org` with your Mailgun SMTP credentials
- **SendGrid**: Use `smtp.sendgrid.net`
- **Outlook**: Use `smtp.office365.com`

## Admin usage

1. Go to `/admin` and log in
2. Click **Email Campaigns**
3. Select audience (Newsletter, Bookings, Contact, or All)
4. Choose email type (Offer, News, etc.)
5. Enter subject and HTML body
6. Click Send
