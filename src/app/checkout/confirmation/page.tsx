"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckCircle, Truck, Package, Clock } from "lucide-react";

export default function OrderConfirmation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  // Redirect if not authenticated or no order ID
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (!orderId) {
      router.push("/");
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
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Could not load order details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading order information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 p-4 rounded-md inline-block">
          <p className="text-red-800">{error}</p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-800 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-300">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg shadow-sm p-6 mb-8">
          <div className="border-b border-gray-600 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-white">
              Order #{orderId?.slice(0, 8)}
            </h2>
            <p className="text-sm text-gray-300">
              Placed on{" "}
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Order Total</span>
              <span className="font-semibold text-white">
                ${order?.total?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Payment Method</span>
              <span className="font-semibold text-white">
                {order?.paymentMethod === "STRIPE"
                  ? "Credit Card"
                  : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Order Status</span>
              <span className="font-semibold capitalize text-white">
                {order?.status?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Delivery Information
          </h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Order Processing
                </h3>
                <p className="text-sm text-gray-300">
                  Your order is being prepared for shipping
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-gray-300" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Estimated Delivery
                </h3>
                <p className="text-sm text-gray-300">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-300" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Delivery Updates
                </h3>
                <p className="text-sm text-gray-300">
                  You will receive email updates about your order status
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 