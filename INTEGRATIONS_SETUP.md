# ARIA-X Data Integrations Setup

This guide explains how to set up Gmail, Google Calendar, and CSV invoice uploads for ARIA-X.

---

## 1. GMAIL INTEGRATION

### What It Does
- Reads your recent emails (last 7-14 days)
- Detects unread emails (potential leads)
- Finds conversations with no recent reply (dormant leads)
- Generates findings: "Missed follow-up opportunity"

### Setup Steps

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project (name: "ARIA-X")
   - Enable Gmail API
   - Create OAuth 2.0 credentials (Web application)
   - Add redirect URI: `https://your-vercel-domain/api/auth/google/callback`
   - Copy Client ID and Client Secret

2. **Add to Vercel Environment:**
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=https://your-vercel-domain/api/auth/google/callback
   ```

3. **In ARIA-X:**
   - Go to Integrations page
   - Click "Connect Gmail"
   - Authorize ARIA-X to access your Gmail
   - Done! ARIA-X will now analyze your emails

---

## 2. GOOGLE CALENDAR INTEGRATION

### What It Does
- Reads your calendar events (next 30 days)
- Detects empty time slots (potential for sales calls)
- Finds overlapping events (scheduling conflicts)
- Generates findings: "Unused availability"

### Setup Steps

1. **Use Same Google OAuth Credentials**
   - The Gmail setup above includes Calendar API access
   - Just enable Google Calendar API in Google Cloud Console

2. **In ARIA-X:**
   - Go to Integrations page
   - Click "Connect Calendar"
   - Authorize ARIA-X to access your calendar
   - Done! ARIA-X will now analyze your schedule

---

## 3. INVOICE CSV UPLOAD

### What It Does
- Reads your invoice data from CSV
- Detects overdue invoices
- Finds invoices due soon
- Identifies high-value invoices
- Generates findings: "Overdue invoice", "Invoice due soon"

### CSV Format

Create a CSV file with these columns:

```
name,amount,due_date
Acme Corp,5000,2024-03-15
Tech Inc,2500,2024-03-20
Global Solutions,8200,2024-03-10
```

**Column Requirements:**
- `name` (or `customer`, `company`) - Client name
- `amount` (or `total`) - Invoice amount
- `due_date` (or `dueDate`, `date`) - Due date (YYYY-MM-DD format)

### Setup Steps

1. **Prepare Your CSV:**
   - Export invoices from your accounting software
   - Ensure columns match format above
   - Save as `invoices.csv`

2. **In ARIA-X:**
   - Go to Integrations page
   - Click "Upload CSV"
   - Select your `invoices.csv` file
   - Click "Upload"
   - Done! ARIA-X will analyze your invoices

---

## FINDINGS GENERATED

### From Gmail
- **Unread emails** - Potential leads waiting for response
- **Dormant conversations** - Customers not replied to in 3+ days

### From Calendar
- **Empty time slots** - Available hours for sales calls
- **Scheduling conflicts** - Overlapping events

### From Invoices
- **Overdue invoices** - Past due date
- **Invoices due soon** - Due within 7 days
- **High-value invoices** - Invoices > $5000

---

## REVENUE POTENTIAL CALCULATION

ARIA-X estimates revenue potential based on:

| Finding Type | Estimated Value |
|---|---|
| Unread email | $500 |
| Dormant conversation | $1,000 |
| Empty time slot (per hour) | $200 |
| Scheduling conflict | $500 |
| Overdue invoice | 100% of amount |
| Invoice due soon | 100% of amount |
| High-value invoice | 100% of amount |

These are conservative estimates. Your actual recovery may be higher.

---

## TROUBLESHOOTING

**"Gmail connection failed"**
- Verify Google OAuth credentials are correct
- Check that Gmail API is enabled in Google Cloud Console
- Ensure redirect URI matches exactly

**"Calendar not showing events"**
- Verify calendar is shared with your Google account
- Check that Google Calendar API is enabled
- Ensure you authorized ARIA-X to access calendar

**"CSV upload failed"**
- Verify CSV format matches requirements
- Check that all required columns are present
- Ensure dates are in YYYY-MM-DD format
- Try with a smaller file first

**"No findings generated"**
- Ensure you have at least some data (emails, events, invoices)
- Check that integrations are properly connected
- Wait a few moments for analysis to complete

---

## NEXT STEPS

1. Connect all three integrations
2. Let ARIA-X analyze your data
3. Review findings on the dashboard
4. Approve findings to execute recovery actions
5. Track revenue recovered

---

## SUPPORT

For issues or questions:
- Check the troubleshooting section above
- Review your integration settings
- Ensure all credentials are correct
- Contact support if problems persist
