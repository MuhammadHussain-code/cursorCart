"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/hooks/useCart";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "succeeded" | "failed"
  >("pending");

  // Redirect if not authenticated or no order ID
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?redirect=/checkout");
      return;
    }

    if (!orderId) {
      router.push("/cart");
      return;
    }
  }, [status, orderId, router]);

  // Fetch order details
  useEffect(() => {
    if (orderId && session) {
      fetchOrderDetails();
    }
  }, [orderId, session]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      
      const data = await response.json();
      setOrderDetails(data.order);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Could not load order details. Please try again.");
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus("succeeded");
    clearCart();
    // Redirect to confirmation page after a short delay
    setTimeout(() => {
      router.push(`/checkout/confirmation?orderId=${orderId}`);
    }, 2000);
  };

  const handlePaymentError = (message: string) => {
    setPaymentStatus("failed");
    setError(message);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderDetails || !orderDetails.paymentIntentId) {
      setError("Invalid order information");
      return;
    }
    
    setPaymentStatus("processing");
    
    try {
      // In a real implementation, you would:
      // 1. Load Stripe Elements
      // 2. Create a payment method
      // 3. Confirm the payment intent with the payment method
      
      // For this demo, we'll simulate a successful payment
      const response = await fetch(`/api/payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentIntentId: orderDetails.paymentIntentId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }
      
      handlePaymentSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      handlePaymentError(
        error instanceof Error
          ? error.message
          : "An error occurred during payment processing"
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading payment information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Payment Error</h1>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link
              href="/cart"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Cart
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          <p className="mt-2 text-gray-600">
            Your order #{orderId?.slice(0, 8)} is almost complete
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Order Total</span>
            <span className="font-semibold">
              ${orderDetails?.total.toFixed(2)}
            </span>
          </div>

          {paymentStatus === "succeeded" ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Redirecting you to the confirmation page...
              </p>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 py-2"
                    disabled={paymentStatus === "processing"}
                  />
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM / YY"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2"
                    disabled={paymentStatus === "processing"}
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    placeholder="123"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2"
                    disabled={paymentStatus === "processing"}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2"
                  disabled={paymentStatus === "processing"}
                />
              </div>

              <button
                type="submit"
                disabled={paymentStatus === "processing"}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {paymentStatus === "processing"
                  ? "Processing..."
                  : `Pay $${orderDetails?.total.toFixed(2)}`}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                For testing, use card number 4242 4242 4242 4242, any future
                date, any 3 digits for CVC, and any name.
              </p>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/cart"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Cancel and return to cart
          </Link>
        </div>
      </div>
    </div>
  );
} 