import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('[Stripe] Missing STRIPE_SECRET_KEY. Payments will not work.');
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const STRIPE_PRO_PRICE_ID = 'price_1TH7WtHl2LONgVuIqXbLKaOQ'; // Replace with your actual price ID

/**
 * Create a checkout session for Pro subscription
 */
export async function createCheckoutSession(email: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    throw error;
  }
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Failed to retrieve checkout session:', error);
    throw error;
  }
}

/**
 * Get subscription status for a customer
 */
export async function getSubscriptionStatus(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { status: 'inactive', tier: 'free' };
    }

    const subscription = subscriptions.data[0];
    return {
      status: subscription.status,
      tier: subscription.status === 'active' ? 'pro' : 'free',
    };
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    throw error;
  }
}

/**
 * Handle webhook event
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // TODO: Update subscription status in database
      console.log('Subscription event:', event.type);
      break;
    default:
      console.log('Unhandled webhook event:', event.type);
  }
}
