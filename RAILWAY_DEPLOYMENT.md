# ARIA-X Railway Production Deployment

## STACK DETECTION COMPLETE

| Component | Technology | Details |
|-----------|-----------|---------|
| **Frontend** | React 19 + Vite | Client-side rendering, TypeScript |
| **Backend** | Express.js + tRPC | Node.js API server |
| **Database** | MySQL | Drizzle ORM for schema management |
| **Build** | Vite + esbuild | Optimized production builds |
| **Package Manager** | pnpm | Fast, disk-space efficient |
| **Start Command** | `node dist/index.js` | Production entry point |
| **Build Command** | `pnpm install && pnpm build` | Full build pipeline |

---

## PHASE 1: ENVIRONMENT VARIABLES

### Required Variables (Copy-Paste)

```env
# Manus OAuth (Pre-configured)
VITE_APP_ID=<MANUS_PROVIDED>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=<MANUS_PROVIDED>
JWT_SECRET=<MANUS_PROVIDED>
OWNER_OPEN_ID=<MANUS_PROVIDED>
OWNER_NAME=<MANUS_PROVIDED>

# Database (MySQL - Manus Managed)
DATABASE_URL=<MANUS_PROVIDED_MYSQL_CONNECTION_STRING>

# Supabase (Optional)
VITE_SUPABASE_URL=https://vhycfkhruerfqxjqzyyh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeWNma2hydWVyZnF4anF6eXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODMyNzYsImV4cCI6MjA5MDU1OTI3Nn0.G5ap5Z61L9_0kAqH6Wq-abm9xKH4ED2XADIFDZqT9-Y

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TH7WtHl2LONgVuIkC05o53CEs2nxpcCmIUkTON7GD7YculCtmCpVEjkFesowElqpRBi4akRv2MVe001cwLADx2
STRIPE_SECRET_KEY=sk_test_51TH7WtHl2LONgVuIRSVNFTyIS3LSA8k3miLU1vDj2IDZfzadtBij0yQ6quvIok7A9V9gOEQ2H99o3agTCOI7gc9m004TSXmjZZ
STRIPE_WEBHOOK_SECRET=<GENERATE_AFTER_WEBHOOK_SETUP>

# Google OAuth (Create in Google Cloud Console)
GOOGLE_CLIENT_ID=<CREATE_IN_STEP_4>
GOOGLE_CLIENT_SECRET=<CREATE_IN_STEP_4>
GOOGLE_REDIRECT_URI=https://your-railway-url.railway.app/api/oauth/google/callback

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=<OPTIONAL>
VITE_ANALYTICS_WEBSITE_ID=<OPTIONAL>

# App Config
VITE_APP_TITLE=ARIA-X Revenue Recovery
NODE_ENV=production
```

---

## PHASE 2: GITHUB SETUP

### Step 1: Verify GitHub Repository

Your repository is already at: `https://github.com/comanderaria-sudo/aria-x.git`

### Step 2: Verify Git Status

```bash
cd /home/ubuntu/aria-x
git status
git log --oneline -1
```

Expected: All files committed, working tree clean

### Step 3: Verify railway.json Exists

```bash
ls -la /home/ubuntu/aria-x/railway.json
```

---

## PHASE 3: RAILWAY DEPLOYMENT

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Start Free"
3. Sign up with GitHub account (comander.aria@gmail.com)
4. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Select: `comanderaria-sudo/aria-x`
4. Click "Deploy"

### Step 3: Railway Auto-Detects Settings

Railway will auto-detect:
- **Build Command:** `pnpm install && pnpm build`
- **Start Command:** `node dist/index.js`
- **Node Version:** Latest LTS

### Step 4: Wait for Initial Build

- Build takes 3-5 minutes
- You'll see build logs in Railway dashboard
- Once complete, you'll get a Railway URL (e.g., `https://aria-x-production.railway.app`)

### Step 5: Add Environment Variables to Railway

1. In Railway dashboard, go to your project
2. Click "Variables"
3. Add each variable from the list above
4. **CRITICAL:** Add `NODE_ENV=production`
5. Click "Save"

### Step 6: Redeploy with Environment Variables

1. Go to "Deployments"
2. Click "Redeploy" on latest deployment
3. Wait 2-3 minutes for new build with env vars

### Step 7: Get Your Railway URL

After redeployment:
1. Go to "Settings"
2. Copy your Railway URL (e.g., `https://aria-x-production.railway.app`)
3. This is your production domain

---

## PHASE 4: GOOGLE OAUTH SETUP

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Select a Project" → "New Project"
3. Name: `ARIA-X Production`
4. Click "Create"
5. Wait for project initialization

### Step 2: Enable APIs

1. Go to "APIs & Services" → "Library"
2. Search "Gmail API"
3. Click → "Enable"
4. Go back to Library
5. Search "Google Calendar API"
6. Click → "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External"
3. Click "Create"
4. Fill form:
   - **App name:** ARIA-X
   - **User support email:** comander.aria@gmail.com
   - **Developer contact:** comander.aria@gmail.com
5. Click "Save and Continue"
6. Click "Add or Remove Scopes"
7. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/calendar.readonly`
8. Click "Update"
9. Click "Save and Continue"
10. Click "Back to Dashboard"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Type: "Web application"
4. Name: `ARIA-X Production`
5. Under "Authorized redirect URIs" add:
   - `https://your-railway-url.railway.app/api/oauth/google/callback`
   - `https://your-railway-url.railway.app/auth/google/callback`
   - `http://localhost:3000/api/oauth/google/callback`
6. Click "Create"
7. Copy **Client ID** and **Client Secret**

### Step 5: Update Railway with Google Credentials

1. Go to Railway dashboard
2. Click "Variables"
3. Update:
   - `GOOGLE_CLIENT_ID` = Your copied Client ID
   - `GOOGLE_CLIENT_SECRET` = Your copied Client Secret
   - `GOOGLE_REDIRECT_URI` = https://your-railway-url.railway.app/api/oauth/google/callback
4. Click "Save"
5. Go to "Deployments" → Click "Redeploy"

---

## PHASE 5: STRIPE WEBHOOK SETUP

### Step 1: Create Stripe Webhook

1. Go to https://dashboard.stripe.com
2. Click "Developers" → "Webhooks"
3. Click "Add endpoint"
4. Endpoint URL: `https://your-railway-url.railway.app/api/webhooks/stripe`
5. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click "Add endpoint"
7. Copy **Signing Secret** (starts with `whsec_`)

### Step 2: Update Railway

1. Go to Railway dashboard
2. Click "Variables"
3. Add: `STRIPE_WEBHOOK_SECRET` = Your copied secret
4. Click "Save"
5. Go to "Deployments" → Click "Redeploy"

---

## PHASE 6: TESTING

### Test 1: Frontend Loads

```bash
curl https://your-railway-url.railway.app
# Should return HTML with ARIA-X content
```

### Test 2: Backend API Responds

```bash
curl https://your-railway-url.railway.app/api/trpc/auth.me
# Should return JSON response
```

### Test 3: OAuth Login Works

1. Visit https://your-railway-url.railway.app
2. Click "Sign up"
3. Should redirect to Manus OAuth
4. After login, should see dashboard

### Test 4: Gmail Connection Works

1. On dashboard, click "Connect Gmail"
2. Should open Google OAuth
3. After auth, should see "Gmail connected ✓"

### Test 5: Calendar Connection Works

1. On dashboard, click "Connect Calendar"
2. Should open Google OAuth
3. After auth, should see "Calendar connected ✓"

### Test 6: Stripe Payment Works

1. On dashboard, click "Upgrade to Pro"
2. Should open Stripe checkout
3. Use test card: `4242 4242 4242 4242`
4. Expiry: `12/25`, CVC: `123`
5. After payment, should see "Pro" status

### Test 7: Revenue Recovery Works

1. Click "Upload Invoices"
2. Upload sample CSV
3. Click "Run Scan"
4. Should see findings appear
5. Click "Approve"
6. Should see execution result

---

## PHASE 7: MONITORING

### Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click your project
3. Monitor:
   - **Deployments:** Status of current build
   - **Logs:** Real-time server logs
   - **Metrics:** CPU, memory, network usage
   - **Variables:** All environment variables

### Health Checks

```bash
# Check if app is running
curl https://your-railway-url.railway.app/health

# Check API response time
time curl https://your-railway-url.railway.app/api/trpc/auth.me

# Check database connection
# (Check Railway logs for "Database connected" message)
```

---

## PHASE 8: TROUBLESHOOTING

### Build Fails

1. Check Railway build logs
2. Common issues:
   - Missing dependencies: Run `pnpm install` locally
   - TypeScript errors: Run `pnpm check` locally
   - Build command wrong: Verify in railway.json

### App Crashes on Start

1. Check Railway logs
2. Common issues:
   - Missing environment variables: Add to Railway dashboard
   - Database connection failed: Verify DATABASE_URL
   - Port conflict: Railway uses dynamic ports (OK)

### OAuth Not Working

1. Verify redirect URIs in Google Console match Railway URL
2. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Railway
3. Check browser console for errors

### Stripe Webhook Not Firing

1. Verify webhook URL in Stripe dashboard
2. Verify STRIPE_WEBHOOK_SECRET in Railway
3. Check Stripe webhook logs for delivery status

---

## FINAL VERIFICATION CHECKLIST

- [ ] Railway project created
- [ ] GitHub repo connected
- [ ] Build succeeds
- [ ] App deploys without errors
- [ ] All environment variables set
- [ ] Frontend loads at Railway URL
- [ ] Backend API responds
- [ ] OAuth login works
- [ ] Gmail connection works
- [ ] Calendar connection works
- [ ] Stripe payment works
- [ ] Revenue recovery demo works
- [ ] No errors in Railway logs
- [ ] Monitoring dashboard accessible

---

## PRODUCTION URL

Your live application is at:
```
https://your-railway-url.railway.app
```

Replace `your-railway-url` with your actual Railway URL from the dashboard.

---

## NEXT STEPS

1. Share production URL with beta users
2. Monitor Railway logs daily
3. Track metrics in Stripe dashboard
4. Collect user feedback
5. Deploy updates via GitHub push (Railway auto-redeploys)

**Status: Ready for Production Launch on Railway**
