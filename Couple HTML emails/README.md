# SyllaTech HTML Email Templates

Pre-built HTML emails that match the SyllaTech website design (dark theme, cyan/blue gradients, purple accents).

## Templates

1. **01-newsletter-thank-you.html** — Thank-you email for new newsletter subscribers
2. **02-offers.html** — Promotional offer template (e.g. 20% off)
3. **03-news-events.html** — News, events, and tips digest
4. **04-booking-confirmation.html** — Sent automatically when someone books (uses {{name}}, {{date}}, {{time}}; backend fills these in)

## Logo

The logo is **embedded directly** in each email (base64) — no domain or hosting required. It works in Gmail, Apple Mail, Yahoo, and most modern clients. When you get your domain, you can optionally switch to a hosted URL like `https://yoursite.com/logo.png` for slightly smaller file size.

## Usage in Admin

1. Open the HTML file in a code editor
2. Copy the full HTML (including `<!DOCTYPE>` and all content)
3. In Admin → Email Campaigns, paste into the HTML body field
4. Edit subject and customize any placeholder text before sending
5. **Unsubscribe**: Templates include `{{UNSUBSCRIBE_URL}}` in the footer — the backend replaces this with each recipient's unique unsubscribe link when sending

## Design Notes

- Dark background (#030712) to match SyllaTech
- Cyan (#06b6d4) to blue (#3b82f6) gradients for buttons
- Purple (#8b5cf6) accents for badges
- Slate tones for text and borders
- Tables used for email client compatibility
