import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  views: number;
  category: string;
  available: boolean;
  quantity: number;
  description?: string; // Optional
  reviews?: { user: string; comment: string; stars: number }[]; // Optional
}


const ProductList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [availability, setAvailability] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  // Start confetti and stop after 3 seconds
  const handleOfferClick = () => {
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 5000);
  };

  useEffect(() => {
    fetch("http://localhost:5176/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data?.$values) ? data.$values : []); // Ensure it's an array
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);



  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.price <= priceRange &&
      product.rating >= minRating &&
      (availability ? product.available : true)
    );
  });

  // Trending & Featured Sections
  const trendingProducts = [...products].sort((a, b) => b.views - a.views).slice(0, 4);
  const featuredProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {celebrate && <Confetti />}

      {/* Promotional Banner */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={handleOfferClick}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-5 mb-8 rounded-xl shadow-lg cursor-pointer">
          <h2 className="text-3xl font-extrabold">🔥 Limited Time Offer - Up to 50% Off! 🔥</h2>
          <p className="text-lg mt-2">Grab your favorite products before the deal ends!</p>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <div className="bg-white p-6 shadow-md rounded-xl mb-8">
        <input
          type="text"
          placeholder="🔍 Search for products..."
          className="border p-3 w-full rounded-xl shadow-sm mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col">
            <label htmlFor="category-select" className="sr-only">Select Category</label>
            <select
              id="category-select"
              className="border p-3 rounded-lg shadow-sm bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Wearable">Wearable</option>
              <option value="Computers">Computers</option>
              <option value="Audio">Audio</option>
              <option value="Appliances">Appliances</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>



          <div className="flex items-center gap-2">
            <label htmlFor="price-range" className="sr-only">
              Price Range
            </label>
            <input
              id="price-range"
              type="range"
              min="0"
              max="1500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-44 cursor-pointer"
            />
            <span className="font-semibold">${priceRange}</span>
          </div>


          {/* <select
            className="border p-3 rounded-lg shadow-sm bg-white"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select> */}
          <label htmlFor="rating-select" className="sr-only">Select Rating</label>
          <select
            id="rating-select"
            className="border p-3 rounded-lg shadow-sm bg-white"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={availability}
              onChange={() => setAvailability(!availability)}
              className="mr-2"
            />
            <span className="font-medium">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Main Product List */}
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-lg text-gray-500 col-span-full text-center">No matching products found.</p>
        )}
      </div>

      {/* Trending Now Section */}
      <h2 className="text-3xl font-semibold mt-10 mb-4 text-gray-800">🔥 Trending Now</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Featured Products Section */}
      <h2 className="text-3xl font-semibold mt-10 mb-4 text-gray-800">🌟 Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
