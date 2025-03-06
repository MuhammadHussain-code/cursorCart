import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia", // Use the latest API version
});

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata: Record<string, string> = {}
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } catch (error) {
    console.error("Error canceling payment intent:", error);
    throw error;
  }
} 