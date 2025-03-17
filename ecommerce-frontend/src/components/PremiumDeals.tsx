import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";

const PremiumDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getRandomDiscount = () => {
    const discounts = [10, 15, 20, 25, 30, 35, 40]; // Random discounts
    return discounts[Math.floor(Math.random() * discounts.length)];
  };

  useEffect(() => {
    const fetchPremiumDeals = async () => {
      try {
        const response = await fetch("http://localhost:5176/api/products");
        if (!response.ok) throw new Error("Failed to fetch premium deals.");

        const data = await response.json();

        // Assign random discount and calculate discounted price
        const updatedDeals = data.$values.map((product) => {
          const discount = getRandomDiscount();
          const discountedPrice = (product.price * (1 - discount / 100)).toFixed(2);
          return { ...product, discount, discountedPrice };
        });

        setDeals(updatedDeals);
      } catch (error) {
        console.error("Error fetching premium deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumDeals();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading premium deals...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center space-x-2 text-yellow-500 text-2xl font-bold"
      >
        <FaCrown />
        <h2>Exclusive Premium Deals</h2>
      </motion.div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {deals.map((deal) => (
          <motion.div
            key={deal.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white shadow-lg rounded-lg"
          >
            <img
              src={deal.image}
              alt={deal.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-2">{deal.name}</h3>

            {/* Original & Discounted Price */}
            <p className="text-gray-500 line-through">${deal.price}</p>
            <p className="text-green-600 font-bold">Now: ${deal.discountedPrice}</p>
            <p className="text-yellow-500 font-semibold">Discount: {deal.discount}% OFF</p>

            {/* View Deal Button */}
            <button
              onClick={() => navigate(`/product/${deal.id}`, { state: { deal } })}
              className="block mt-3 text-center bg-yellow-500 text-white py-2 rounded-lg w-full hover:bg-yellow-600 transition"
            >
              View Deal
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PremiumDeals;
