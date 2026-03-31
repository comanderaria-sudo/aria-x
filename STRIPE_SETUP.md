# Stripe Setup Guide for ARIA-X

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Start now"
3. Sign up with email
4. Complete account setup (business info is optional for testing)

---

## Step 2: Get API Keys

1. Go to **Developers** → **API Keys**
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy the following:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

4. Add to your `.env` file:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
   STRIPE_SECRET_KEY=sk_test_your-key
   ```

---

## Step 3: Create a Product

1. Go to **Products** in Stripe dashboard
2. Click "Add product"
3. Fill in:
   - **Name**: ARIA-X Pro
   - **Description**: Full access to revenue recovery platform
   - **Type**: Service
4. Click "Create product"

---

## Step 4: Create a Price

1. Click on the product you just created
2. Scroll to "Pricing" section
3. Click "Add price"
4. Fill in:
   - **Price**: 29.00
   - **Billing period**: Monthly
   - **Currency**: USD
5. Click "Create price"
6. Copy the **Price ID** (looks like: `price_1TH7WtHl2LONgVuIqXbLKaOQ`)

---

## Step 5: Update Price ID in Code

1. Open `server/stripe-service.ts`
2. Find this line:
   ```typescript
   const STRIPE_PRO_PRICE_ID = 'price_1TH7WtHl2LONgVuIqXbLKaOQ';
   ```
3. Replace with your Price ID:
   ```typescript
   const STRIPE_PRO_PRICE_ID = 'price_your-actual-id';
   ```

---

## Step 6: Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Fill in:
   - **Endpoint URL**: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
   - **Description**: ARIA-X Subscription Events
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Click on the endpoint you just created
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add to your `.env` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your-secret
   ```

---

## Step 7: Test Checkout Flow

1. Run `pnpm dev`
2. Go to `http://localhost:3000`
3. Sign up for an account
4. Click "Upgrade to Pro"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Expiry: Any future date (e.g., 12/26)
7. CVC: Any 3 digits (e.g., 123)
8. Click "Pay"

---

## Step 8: Verify Subscription

1. Go to Stripe Dashboard → **Customers**
2. Find the customer you just created
3. Click on the customer
4. Verify subscription shows "Active"

---

## Test Cards

Use these cards to test different scenarios:

| Card Number | Scenario |
|---|---|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | Requires authentication |
| 5555 5555 5555 4444 | Mastercard |

---

## Webhook Testing (Local)

To test webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copy the webhook signing secret
4. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`
5. Trigger test event: `stripe trigger customer.subscription.created`

---

## Production Checklist

- [ ] Switch to Live Mode in Stripe
- [ ] Get Live API keys (start with `pk_live_` and `sk_live_`)
- [ ] Update environment variables in Vercel
- [ ] Test with real payment method
- [ ] Set up email notifications in Stripe
- [ ] Configure subscription management portal
- [ ] Set up tax rates if applicable
- [ ] Enable fraud detection

---

## Troubleshooting

**"Invalid API key"**
- Make sure you're using the correct key (Publishable vs Secret)
- Verify you're in Test Mode for testing

**"Webhook signature verification failed"**
- Check that `STRIPE_WEBHOOK_SECRET` is correct
- Verify webhook endpoint is accessible

**"Customer not found"**
- Ensure customer email is correct
- Check that subscription was created in Stripe dashboard

**"Price not found"**
- Verify Price ID is correct in `stripe-service.ts`
- Check that price is in the same Stripe account

---

## Next Steps

1. Set up Stripe tax rates for your region
2. Configure subscription management portal
3. Set up email receipts and invoices
4. Enable advanced fraud detection
5. Create custom email templates
