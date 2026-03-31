# ARIA-X Vercel Deployment Guide

## Prerequisites

- Vercel account (free tier works)
- Supabase account with project created
- Stripe account with API keys
- GitHub account (recommended for easy deployments)

---

## Step 1: Prepare Environment Variables

Create a `.env.production` file with the following variables:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
STRIPE_SECRET_KEY=sk_test_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here

# Database
DATABASE_URL=your-database-connection-string

# OAuth (from Manus)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your-jwt-secret
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Add environment variables in project settings
6. Click "Deploy"

---

## Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add all variables from Step 1
4. Redeploy: Click "Deployments" → Select latest → Click "Redeploy"

---

## Step 4: Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the signing secret and add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Create Stripe Price

1. Go to Stripe Dashboard → Products
2. Create a new product: "ARIA-X Pro"
3. Add a price: $29/month (recurring)
4. Copy the Price ID
5. Update `server/stripe-service.ts`:
   ```typescript
   const STRIPE_PRO_PRICE_ID = 'price_your-price-id-here';
   ```
6. Redeploy to Vercel

---

## Step 6: Test the Application

1. Visit your Vercel domain
2. Click "Sign up"
3. Create a test account
4. Click "Upgrade to Pro"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Verify subscription in Stripe Dashboard

---

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Stripe webhook configured
- [ ] Stripe test mode working
- [ ] Supabase project connected
- [ ] Database migrations applied
- [ ] PWA manifest configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate enabled (automatic with Vercel)
- [ ] Analytics enabled (optional)

---

## Monitoring & Logs

View logs in Vercel dashboard:
1. Go to project → Deployments
2. Click latest deployment
3. View "Function Logs" and "Build Logs"

---

## Troubleshooting

**"Supabase credentials missing"**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel

**"Stripe not configured"**
- Verify `STRIPE_SECRET_KEY` is set in Vercel
- Check Stripe API keys are correct

**"Build fails"**
- Run `pnpm build` locally to debug
- Check Node.js version (should be 18+)

---

## Next Steps

1. Set up custom domain in Vercel Settings
2. Enable analytics in Vercel Dashboard
3. Configure error tracking (Sentry, LogRocket, etc.)
4. Set up automated backups for Supabase
5. Monitor Stripe webhooks for failures
