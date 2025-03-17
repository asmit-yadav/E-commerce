import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Product } from "./Product/ProductList";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5176/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setProducts(Array.isArray(data?.$values) ? data.$values : []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const trendingProducts = [...products]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center text-center p-6">
      {/* 🎯 Hero Section */}
      <motion.div
        className="bg-white shadow-xl rounded-3xl p-12 max-w-3xl text-gray-900"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-5xl font-extrabold mb-4">Welcome to <span className="text-blue-600">E-Shop</span>!</h2>
        <p className="text-gray-700 text-lg mb-6">
          Discover the latest trends & exclusive deals just for you!
        </p>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link
          aria-label="navigating to the shop"
            to="/shop"
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Start Shopping 🛍️
          </Link>
        </motion.div>
      </motion.div>

      {/* 🔥 Trending Products Section */}
      <div className="mt-16 w-full max-w-6xl">
        <h3 className="text-4xl font-bold text-gray-800 mb-8">🔥 Trending Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <Link to={`/product/${product.id}`}>
              <div className="h-48 w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-lg hover:opacity-90 transition duration-300"
                />
              </div>
              </Link>
              <p className="mt-4 text-xl font-semibold text-gray-900">{product.name}</p>
              <Link to={`/product/${product.id}`} className="text-[#326ed1] hover:text-blue-700 text-sm font-medium transition duration-300" href="/product/5" data-discover="true">View Details →</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
