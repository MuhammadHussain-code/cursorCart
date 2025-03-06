"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, Truck } from "lucide-react";

type PaymentMethod = "STRIPE" | "CASH_ON_DELIVERY";

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?redirect=/checkout");
    }
  }, [status, router]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0 && status !== "loading") {
      router.push("/cart");
    }
  }, [items, router, status]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate address
    const addressValues = Object.values(address);
    if (addressValues.some((value) => !value.trim())) {
      setError("Please fill in all address fields");
      setLoading(false);
      return;
    }

    try {
      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          paymentMethod,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      if (paymentMethod === "STRIPE") {
        // Redirect to Stripe payment page
        router.push(`/checkout/payment?orderId=${data.order.id}`);
      } else {
        // Cash on delivery - redirect to confirmation page
        clearCart();
        router.push(`/checkout/confirmation?orderId=${data.order.id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during checkout"
      );
      setLoading(false);
    }
  };

  if (status === "loading" || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={address.country}
                        onChange={handleAddressChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="stripe"
                        name="paymentMethod"
                        type="radio"
                        checked={paymentMethod === "STRIPE"}
                        onChange={() => setPaymentMethod("STRIPE")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="stripe"
                        className="ml-3 flex items-center text-sm font-medium text-gray-700"
                      >
                        <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cod"
                        name="paymentMethod"
                        type="radio"
                        checked={paymentMethod === "CASH_ON_DELIVERY"}
                        onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="cod"
                        className="ml-3 flex items-center text-sm font-medium text-gray-700"
                      >
                        <Truck className="h-5 w-5 mr-2 text-gray-400" />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Processing..."
                      : paymentMethod === "STRIPE"
                      ? "Proceed to Payment"
                      : "Complete Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Subtotal</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Tax</p>
                  <p>${(totalPrice * 0.1).toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <p>${(totalPrice + totalPrice * 0.1).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/cart"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  ← Return to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 