import Stripe from "stripe";

// Check if the required Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing Stripe secret key - payments will be simulated");
}

// Initialize Stripe with the secret key or a placeholder for development
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata: Record<string, string> = {}
) {
  try {
    if (!stripe) {
      console.log("Simulating payment intent creation in development mode");
      // Return a simulated payment intent for development
      return {
        clientSecret: "sim_" + Math.random().toString(36).substring(2, 15),
        id: "pi_" + Math.random().toString(36).substring(2, 15),
      };
    }

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
    if (!stripe) {
      console.log("Simulating payment intent retrieval in development mode");
      // Return a simulated payment intent for development
      return {
        id: paymentIntentId,
        status: "succeeded",
        amount: 1000,
        currency: "usd",
      };
    }
    
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  try {
    if (!stripe) {
      console.log("Simulating payment intent cancellation in development mode");
      // Return a simulated cancellation for development
      return {
        id: paymentIntentId,
        status: "canceled",
      };
    }
    
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } catch (error) {
    console.error("Error canceling payment intent:", error);
    throw error;
  }
} 