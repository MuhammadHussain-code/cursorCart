import Link from "next/link";
import Image from "next/image";
import { Filter, ChevronDown } from "lucide-react";

// Mock product data (in a real app, this would come from the database)
const products = [
  {
    id: "1",
    name: "Wireless Noise Cancelling Headphones",
    price: 249.99,
    image: "/images/products/headphones.jpg",
    category: "Electronics",
    description: "Premium wireless headphones with active noise cancellation.",
  },
  {
    id: "2",
    name: "Premium Leather Backpack",
    price: 129.99,
    image: "/images/products/backpack.jpg",
    category: "Fashion",
    description: "Handcrafted leather backpack with multiple compartments.",
  },
  {
    id: "3",
    name: "Smart Fitness Tracker",
    price: 99.99,
    image: "/images/products/fitness-tracker.jpg",
    category: "Wearables",
    description: "Track your fitness goals with this advanced smart tracker.",
  },
  {
    id: "4",
    name: "Organic Cotton T-shirt",
    price: 29.99,
    image: "/images/products/tshirt.jpg",
    category: "Clothing",
    description: "Comfortable and eco-friendly cotton t-shirt.",
  },
  {
    id: "5",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "/images/products/water-bottle.jpg",
    category: "Home & Kitchen",
    description: "Double-walled insulated water bottle that keeps drinks cold for 24 hours.",
  },
  {
    id: "6",
    name: "Wireless Bluetooth Speaker",
    price: 79.99,
    image: "/images/products/speaker.jpg",
    category: "Electronics",
    description: "Portable speaker with rich sound and long battery life.",
  },
  {
    id: "7",
    name: "Ceramic Coffee Mug Set",
    price: 34.99,
    image: "/images/products/mugs.jpg",
    category: "Home & Kitchen",
    description: "Set of 4 handcrafted ceramic coffee mugs.",
  },
  {
    id: "8",
    name: "Yoga Mat",
    price: 45.99,
    image: "/images/products/yoga-mat.jpg",
    category: "Fitness",
    description: "Non-slip yoga mat made from eco-friendly materials.",
  },
];

// Mock categories
const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Wearables",
  "Clothing",
  "Fitness",
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - In a real app, these would be interactive */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <Filter className="h-5 w-5 text-gray-500" />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={category === "All Categories"}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Price Range
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="min-price"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Min
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    placeholder="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="max-price"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Max
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    placeholder="1000"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Sort By
              </h3>
              <div className="relative">
                <select
                  id="sort-by"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm appearance-none pr-10"
                  defaultValue="featured"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48 bg-gray-100">
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
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="font-semibold text-lg">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                2
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                3
              </a>
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 