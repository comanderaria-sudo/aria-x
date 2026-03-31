# ARIA-X Production Setup (FINAL)

## 🚀 YOU ARE HERE: Ready to Go Live

This is the **complete checklist** to make ARIA-X a fully functional product.

---

## STEP 1: Supabase Configuration (CRITICAL)

### In Supabase Dashboard:

1. **Create the schema:**
   - Go to SQL Editor
   - Copy the entire content from `SUPABASE_SCHEMA.sql`
   - Paste into SQL Editor
   - Click "Run"

2. **Get your credentials:**
   - Go to Settings → API
   - Copy **Project URL** (e.g., `https://vhycfkhruerfqxjqzyyh.supabase.co`)
   - Copy **Anon Key** (starts with `eyJ...`)

### In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add these EXACTLY:
   ```
   VITE_SUPABASE_URL=https://vhycfkhruerfqxjqzyyh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click "Save"
4. Redeploy: Go to Deployments → Latest → Click "Redeploy"

---

## STEP 2: Stripe Configuration (CRITICAL)

### In Stripe Dashboard:

1. **Create Product:**
   - Go to Products
   - Click "Add product"
   - Name: `ARIA-X Pro`
   - Click "Create product"

2. **Create Price:**
   - Click on product
   - Click "Add price"
   - Price: `29.00`
   - Billing: `Monthly`
   - Click "Create price"
   - Copy the **Price ID** (e.g., `price_1TH7WtHl2LONgVuIqXbLKaOQ`)

3. **Update Code:**
   - Open `server/stripe-service.ts`
   - Find: `const STRIPE_PRO_PRICE_ID = 'price_1TH7WtHl2LONgVuIqXbLKaOQ';`
   - Replace with your Price ID

4. **Set Up Webhook:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
   - Events: Select `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Click "Add endpoint"
   - Copy **Signing Secret** (starts with `whsec_`)

### In Vercel Dashboard:

1. Add these environment variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TH7WtHl2LONgVuIkC05o53CEs2nxpcCmIUkTON7GD7YculCtmCpVEjkFesowElqpMIsLEYovgPpRBi4akRv2MVe001cwLADx2
   STRIPE_SECRET_KEY=sk_test_51TH7WtHl2LONgVuIRSVNFTyIS3LSA8k3miLU1vDj2IDZfzadtBij0yQ6quvIok7A9V9gOEQ2H99o3agTCOI7gc9m004TSXmjZZ
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```
2. Click "Save"
3. Redeploy

---

## STEP 3: Test the Complete Flow

### Test User Flow:

1. Go to your Vercel domain
2. Click "Sign Up"
3. Create account with email
4. You should see "Connect Your Business" page
5. Enter business name and industry
6. Click "Continue"
7. You'll see data import options
8. Click "Skip for Now"
9. You should be redirected to dashboard (or upgrade page if not Pro)

### Test Stripe Checkout:

1. On upgrade page, click "Upgrade to Pro"
2. Use test card: `4242 4242 4242 4242`
3. Expiry: `12/26`
4. CVC: `123`
5. Click "Pay"
6. Check Stripe Dashboard → Customers to verify subscription

---

## STEP 4: Verify Everything Works

### Checklist:

- [ ] Supabase credentials set in Vercel
- [ ] Stripe credentials set in Vercel
- [ ] Stripe webhook configured
- [ ] Stripe product created with correct price
- [ ] Can sign up and create account
- [ ] Can see onboarding flow
- [ ] Can click upgrade and reach Stripe checkout
- [ ] Test payment goes through
- [ ] Subscription shows in Stripe dashboard
- [ ] Can access dashboard after payment

---

## STEP 5: Go Live

### When Everything Works:

1. Switch Stripe from Test Mode to Live Mode
2. Get Live API keys (start with `pk_live_` and `sk_live_`)
3. Update Vercel environment variables with Live keys
4. Redeploy
5. Test with real payment method (small amount)
6. Announce to users!

---

## 🎯 User Flow (What Users See)

```
Landing Page
    ↓
Sign Up
    ↓
Connect Your Business
    ↓
Add Invoices/Leads (or skip)
    ↓
Dashboard (Free tier - limited)
    ↓
Click "Upgrade to Pro"
    ↓
Stripe Checkout
    ↓
Full Dashboard Access
    ↓
ARIA-X finds revenue opportunities
```

---

## 🔧 Troubleshooting

**"Missing Supabase environment variables"**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
- Redeploy after adding variables

**"Stripe not configured"**
- Verify `STRIPE_SECRET_KEY` is set
- Check that price ID in `stripe-service.ts` is correct

**"Webhook signature verification failed"**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook endpoint URL matches exactly

**"Can't sign up"**
- Check Supabase authentication is enabled
- Verify email provider is enabled in Supabase

**"Subscription doesn't activate"**
- Check webhook is receiving events in Stripe dashboard
- Verify webhook secret is correct

---

## 📊 Monitoring

### Daily Checks:

1. Stripe Dashboard → Recent payments
2. Supabase → Auth → Users (new signups)
3. Vercel → Deployments (any errors?)
4. Stripe Webhooks → Recent events (any failures?)

### Weekly Checks:

1. Revenue metrics
2. User feedback
3. Error logs
4. Performance metrics

---

## 🎉 You're Live!

When all tests pass, ARIA-X is a **real, functional product** that:

✅ Lets users sign up
✅ Connects their business data
✅ Charges them for Pro access
✅ Finds revenue recovery opportunities
✅ Tracks their subscriptions

**Next steps:**
1. Market to early users
2. Collect feedback
3. Iterate on features
4. Scale infrastructure
