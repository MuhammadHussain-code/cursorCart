"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/hooks/useCart";
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus } from "lucide-react";
import React from "react";

// Mock product data (in a real app, this would come from the database)
const products = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones",
    price: 249.99,
    image: "/images/products/headphones.jpg",
    category: "Electronics",
    description:
      "Experience premium sound quality with these wireless noise cancelling headphones. Perfect for travel, work, or relaxation, these headphones deliver crisp audio and effective noise cancellation. The comfortable over-ear design and long battery life ensure you can enjoy your music all day long.",
    features: [
      "Active noise cancellation",
      "40-hour battery life",
      "Bluetooth 5.0 connectivity",
      "Built-in microphone for calls",
      "Comfortable memory foam ear cushions",
    ],
    stock: 15,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Premium Leather Backpack",
    price: 129.99,
    image: "/images/products/backpack.jpg",
    category: "Fashion",
    description:
      "This premium leather backpack combines style and functionality. Crafted from genuine leather, it features multiple compartments for organization, padded laptop sleeve, and adjustable shoulder straps for comfort. Perfect for work, travel, or everyday use.",
    features: [
      "Genuine full-grain leather",
      "Padded 15-inch laptop compartment",
      "Water-resistant lining",
      "Multiple interior pockets",
      "Adjustable shoulder straps",
    ],
    stock: 8,
    rating: 4.6,
    reviews: 89,
  },
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  // Find the product by ID
  const product = products.find((p) => p.id === id);

  // Handle quantity changes
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-100">Product not found</p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Link
        href="/products"
        className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 p-8">
          <div className="relative h-80 md:h-96 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-6">
            <p className="text-blue-400 text-sm mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-300">
                {product.rating} ({product.reviews} reviews)
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-100 mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-300 mb-6">{product.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-100 mb-3">
              Key Features
            </h2>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-900 text-blue-400 mr-2">
                    ✓
                  </span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <p className="text-gray-300 mr-4">Quantity:</p>
              <div className="flex items-center border border-gray-700 rounded-md bg-gray-800">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-300 hover:text-white disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-gray-100">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 text-gray-300 hover:text-white disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="ml-4 text-sm text-gray-400">
                {product.stock} available
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Shipping and Returns */}
          <div className="border-t border-gray-700 pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-100">
                  Free Shipping
                </h3>
                <p className="text-sm text-gray-400">
                  Free standard shipping on orders over $50
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-100">
                  30-Day Returns
                </h3>
                <p className="text-sm text-gray-400">
                  Return or exchange within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 