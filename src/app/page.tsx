import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones",
    price: 249.99,
    image: "/images/products/headphones.jpg",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Premium Leather Backpack",
    price: 129.99,
    image: "/images/products/backpack.jpg",
    category: "Fashion",
  },
  {
    id: "3",
    name: "Smart Fitness Tracker",
    price: 99.99,
    image: "/images/products/fitness-tracker.jpg",
    category: "Wearables",
  },
  {
    id: "4",
    name: "Organic Cotton T-shirt",
    price: 29.99,
    image: "/images/products/tshirt.jpg",
    category: "Clothing",
  },
];

const categories = [
  {
    id: "1",
    name: "Electronics",
    image: "/images/categories/electronics.jpg",
  },
  {
    id: "2",
    name: "Fashion",
    image: "/images/categories/fashion.jpg",
  },
  {
    id: "3",
    name: "Home & Kitchen",
    image: "/images/categories/home.jpg",
  },
  {
    id: "4",
    name: "Beauty & Personal Care",
    image: "/images/categories/beauty.jpg",
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Shop the latest trends with confidence
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-lg mx-auto md:mx-0">
              Discover amazing products with fast shipping and secure payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/products"
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-black/30 z-10 rounded-xl"></div>
              <Image
                src="/images/hero.jpg"
                alt="Shopping bags"
                fill
                style={{ objectFit: "cover" }}
                priority
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Shop by Category
            </h2>
            <Link
              href="/categories"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group block"
              >
                <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48 bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="p-4 transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-blue-600 mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-medium text-slate-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="font-semibold text-lg">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Get 15% Off Your First Order
              </h2>
              <p className="text-slate-300">
                Sign up for our newsletter and receive a discount code.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
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
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-slate-600">
                Carefully selected items that meet our high standards.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-slate-600">
                Quick and reliable shipping to your doorstep.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-slate-600">
                Multiple safe payment options including cash on delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
