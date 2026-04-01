# ARIA-X Production Launch Guide

## Phase 1: Environment Setup

### Required Environment Variables

| Variable | Value | Source | Status |
|----------|-------|--------|--------|
| `VITE_APP_ID` | Manus OAuth App ID | Manus Dashboard | ✅ Pre-configured |
| `OAUTH_SERVER_URL` | https://api.manus.im | Manus Platform | ✅ Pre-configured |
| `VITE_OAUTH_PORTAL_URL` | Manus OAuth Portal | Manus Platform | ✅ Pre-configured |
| `JWT_SECRET` | Session signing secret | Manus Platform | ✅ Pre-configured |
| `DATABASE_URL` | MySQL connection string | Manus Managed | ✅ Pre-configured |
| `VITE_SUPABASE_URL` | https://vhycfkhruerfqxjqzyyh.supabase.co | Supabase | ✅ Provided |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Supabase | ✅ Provided |
| `VITE_STRIPE_PUBLISHABLE_KEY` | pk_test_... | Stripe Dashboard | ✅ Provided |
| `STRIPE_SECRET_KEY` | sk_test_... | Stripe Dashboard | ✅ Provided |
| `STRIPE_WEBHOOK_SECRET` | whsec_... | Stripe Webhooks | ⏳ Generate after setup |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console | ⏳ Create now |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Google Cloud Console | ⏳ Create now |
| `GOOGLE_REDIRECT_URI` | https://your-domain.vercel.app/api/oauth/google/callback | Your Vercel URL | ⏳ Update after deployment |

---

## Phase 2: GitHub Setup

### Step 1: Initialize Git Repository

```bash
cd /home/ubuntu/aria-x
git init
git config user.name "ARIA-X Team"
git config user.email "team@aria-x.com"
```

### Step 2: Create .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
pnpm-lock.yaml
yarn.lock
package-lock.json

# Environment
.env
.env.local
.env.*.local
.env.production

# Build
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/

# Misc
.cache/
.turbo/
EOF
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Initial ARIA-X production build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aria-x.git
git push -u origin main
```

---

## Phase 3: Vercel Deployment

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Paste: `https://github.com/YOUR_USERNAME/aria-x.git`
5. Click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect these settings:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |

If not auto-detected, set manually:
1. Go to "Settings" → "Build & Development Settings"
2. Set Framework Preset: **Vite**
3. Set Build Command: `pnpm build`
4. Set Output Directory: `dist`

### Step 3: Add Environment Variables

1. Go to "Settings" → "Environment Variables"
2. Add each variable from `.env.production`:

```
VITE_APP_ID = <MANUS_PROVIDED>
OAUTH_SERVER_URL = <MANUS_PROVIDED>
VITE_OAUTH_PORTAL_URL = <MANUS_PROVIDED>
JWT_SECRET = <MANUS_PROVIDED>
DATABASE_URL = <MANUS_PROVIDED>
VITE_SUPABASE_URL = https://vhycfkhruerfqxjqzyyh.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_51TH7WtHl2LONgVuIkC05o53CEs2nxpcCmIUkTON7GD7YculCtmCpVEjkFesowElqpRBi4akRv2MVe001cwLADx2
STRIPE_SECRET_KEY = sk_test_51TH7WtHl2LONgVuIRSVNFTyIS3LSA8k3miLU1vDj2IDZfzadtBij0yQ6quvIok7A9V9gOEQ2H99o3agTCOI7gc9m004TSXmjZZ
GOOGLE_CLIENT_ID = <YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET = <YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_REDIRECT_URI = https://your-project.vercel.app/api/oauth/google/callback
```

3. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait 3-5 minutes for build to complete
3. Copy your Vercel URL (e.g., `https://aria-x-production.vercel.app`)

---

## Phase 4: Google Cloud Console Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a Project" → "New Project"
3. Name: `ARIA-X Production`
4. Click "Create"
5. Wait for project to initialize

### Step 2: Enable APIs

1. Go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click → "Enable"
4. Go back to Library
5. Search for "Google Calendar API"
6. Click → "Enable"

### Step 3: Create OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External"
3. Click "Create"
4. Fill in:
   - **App name:** ARIA-X
   - **User support email:** your-email@gmail.com
   - **Developer contact:** your-email@gmail.com
5. Click "Save and Continue"
6. Click "Add or Remove Scopes"
7. Search and add:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar.readonly`
8. Click "Update"
9. Click "Save and Continue"
10. Click "Back to Dashboard"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Select "Web application"
4. Name: `ARIA-X Production`
5. Under "Authorized redirect URIs" add:
   - `https://your-project.vercel.app/api/oauth/google/callback`
   - `https://your-project.vercel.app/auth/google/callback`
   - `http://localhost:3000/api/oauth/google/callback` (for local testing)
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

### Step 5: Update Vercel Environment Variables

1. Go back to Vercel Dashboard
2. Go to "Settings" → "Environment Variables"
3. Update:
   - `GOOGLE_CLIENT_ID` = Your copied Client ID
   - `GOOGLE_CLIENT_SECRET` = Your copied Client Secret
   - `GOOGLE_REDIRECT_URI` = https://your-project.vercel.app/api/oauth/google/callback
4. Click "Save"

### Step 6: Redeploy on Vercel

1. Go to "Deployments"
2. Click "Redeploy" on latest deployment
3. Wait for build to complete

---

## Phase 5: Stripe Webhook Setup

### Step 1: Get Vercel URL

From Vercel Dashboard, copy your production URL (e.g., `https://aria-x-production.vercel.app`)

### Step 2: Create Stripe Webhook

1. Go to https://dashboard.stripe.com
2. Click "Developers" → "Webhooks"
3. Click "Add endpoint"
4. Endpoint URL: `https://your-project.vercel.app/api/webhooks/stripe`
5. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click "Add endpoint"
7. Copy **Signing Secret** (starts with `whsec_`)

### Step 3: Update Vercel

1. Go to Vercel → "Settings" → "Environment Variables"
2. Add: `STRIPE_WEBHOOK_SECRET` = Your copied Signing Secret
3. Click "Save"
4. Redeploy

---

## Phase 6: Testing Checklist

### Authentication Flow
- [ ] Visit https://your-project.vercel.app
- [ ] Click "Sign up"
- [ ] Create account with email/password
- [ ] Receive confirmation email
- [ ] Click confirmation link
- [ ] Log in successfully
- [ ] See dashboard

### OAuth Flow
- [ ] Click "Connect Gmail"
- [ ] Authorize Google account
- [ ] See "Gmail connected" status
- [ ] Click "Connect Calendar"
- [ ] Authorize Google account
- [ ] See "Calendar connected" status

### Payments Flow
- [ ] Click "Upgrade to Pro"
- [ ] See Stripe checkout
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Expiry: `12/25`
- [ ] CVC: `123`
- [ ] Complete payment
- [ ] See "Pro" status on dashboard

### Revenue Recovery
- [ ] Upload invoices CSV
- [ ] See findings appear
- [ ] Click "Approve" on finding
- [ ] See execution result
- [ ] Check revenue counter updated

---

## Phase 7: Production Monitoring

### Health Checks

1. **Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Check deployment status
   - Review build logs if errors

2. **Stripe Dashboard**
   - Go to https://dashboard.stripe.com
   - Check recent transactions
   - Verify webhook deliveries

3. **Google Cloud Console**
   - Go to https://console.cloud.google.com
   - Check API quotas
   - Review OAuth access logs

### Error Handling

If deployment fails:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Check database connection
4. Verify GitHub repo has all files

If OAuth fails:
1. Verify redirect URIs in Google Console
2. Verify Client ID/Secret in Vercel
3. Check browser console for errors

If Stripe fails:
1. Verify webhook endpoint is correct
2. Check webhook signing secret
3. Review Stripe logs for failed events

---

## Phase 8: Beta Launch

### Ideal Beta Users

- Small business owners (1-10 employees)
- Freelancers with invoice management needs
- Sales teams with lead follow-up challenges
- Administrative professionals

### Onboarding Steps

1. Send beta invite link
2. User signs up
3. User connects Gmail/Calendar
4. User uploads invoices CSV
5. User clicks "Run Scan"
6. User approves recovery actions
7. User provides feedback

### Feedback Collection

Create simple form at `/feedback`:
- What worked well?
- What was confusing?
- What would you add?
- Would you pay $29/month?

### Key Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Signups | 50+ | Vercel Analytics |
| Activation (connected Gmail) | 70%+ | Database query |
| Revenue recovered | $100K+ | Dashboard counter |
| Approval rate | 80%+ | Database query |
| Conversion to Pro | 20%+ | Stripe dashboard |
| NPS Score | 50+ | Feedback form |

---

## Quick Reference: Environment Variables

### Copy-Paste Template

```bash
# Manus (Pre-configured)
VITE_APP_ID=<ASK_MANUS>
OAUTH_SERVER_URL=<ASK_MANUS>
VITE_OAUTH_PORTAL_URL=<ASK_MANUS>
JWT_SECRET=<ASK_MANUS>
DATABASE_URL=<ASK_MANUS>

# Supabase (Already provided)
VITE_SUPABASE_URL=https://vhycfkhruerfqxjqzyyh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeWNma2hydWVyZnF4anF6eXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODMyNzYsImV4cCI6MjA5MDU1OTI3Nn0.G5ap5Z61L9_0kAqH6Wq-abm9xKH4ED2XADIFDZqT9-Y

# Stripe (Already provided)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TH7WtHl2LONgVuIkC05o53CEs2nxpcCmIUkTON7GD7YculCtmCpVEjkFesowElqpRBi4akRv2MVe001cwLADx2
STRIPE_SECRET_KEY=sk_test_51TH7WtHl2LONgVuIRSVNFTyIS3LSA8k3miLU1vDj2IDZfzadtBij0yQ6quvIok7A9V9gOEQ2H99o3agTCOI7gc9m004TSXmjZZ

# Google (Create in Google Cloud Console)
GOOGLE_CLIENT_ID=<CREATE_IN_GOOGLE_CONSOLE>
GOOGLE_CLIENT_SECRET=<CREATE_IN_GOOGLE_CONSOLE>
GOOGLE_REDIRECT_URI=https://your-vercel-domain.vercel.app/api/oauth/google/callback

# Stripe Webhook (Generate after webhook setup)
STRIPE_WEBHOOK_SECRET=<GENERATE_IN_STRIPE_WEBHOOKS>
```

---

## Success Criteria

✅ App deployed on Vercel
✅ Manus OAuth working
✅ Google OAuth working
✅ Stripe payments working
✅ Database connected
✅ All tests passing
✅ Beta users onboarded
✅ Revenue recovery demo working

**Status: Ready for production launch**
