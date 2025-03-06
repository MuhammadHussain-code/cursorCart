"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/hooks/useCart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(id);
    updateQuantity(id, newQuantity);
    setIsUpdating(null);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden relative mb-4 sm:mb-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="sm:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-base font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={isUpdating === item.id || item.quantity <= 1}
                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={isUpdating === item.id}
                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal ({totalItems} items)</p>
                <p className="font-medium">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">Free</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Tax (10%)</p>
                <p className="font-medium">${(totalPrice * 0.1).toFixed(2)}</p>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-medium text-gray-900">
                    ${(totalPrice + totalPrice * 0.1).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="w-full text-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 