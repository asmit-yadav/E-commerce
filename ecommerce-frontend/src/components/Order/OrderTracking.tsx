import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5176/api/orders/${orderId}`);
          console.log("response",response.data)
          setOrder(response.data); // response se data directly set karo
        } catch (err) {
          toast.error("Failed to fetch order details. Please try again."); // error ke liye toast
        } finally {
          setLoading(false);
        }
      };
      

    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    if (order.status === "Shipped" || order.status === "Delivered") {
      alert("Order cannot be canceled at this stage.");
      return;
    }

    try {
      await axios.post(`https://api.example.com/orders/${orderId}/cancel`);
      setOrder((prevOrder) => ({ ...prevOrder, status: "Canceled" }));
      alert("Order Canceled Successfully!");
    } catch (err) {
      alert("Failed to cancel order. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-lg">⏳ Loading order details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white/70 to-gray-100 shadow-xl rounded-2xl backdrop-blur-md border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📦 Order Tracking</h1>
      
      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 border rounded-2xl shadow-lg bg-white backdrop-blur-md"
      >
        <p className="text-lg font-semibold">🆔 Order ID: <span className="text-blue-700">{order.id}</span></p>
        <p className="text-lg font-semibold">📌 Status: 
          <span className={`ml-2 px-3 py-1 rounded-full text-white font-medium ${order.status === "Processing" ? "bg-yellow-500" : order.status === "Shipped" ? "bg-blue-500" : order.status === "Out for Delivery" ? "bg-purple-500" : order.status === "Delivered" ? "bg-green-500" : "bg-red-500"}`}>{order.status}</span>
        </p>
        <p className="text-lg font-semibold">💰 Total Amount: <span className="text-green-600">${order.totalAmount}</span></p>
        <p className="text-lg font-semibold">📅 Estimated Delivery: <span className="text-gray-600">{order.estimatedDelivery}</span></p>
      </motion.div>

      {/* Product List */}
      {/* <h2 className="text-xl font-semibold mt-6 mb-3">🛍 Ordered Items:</h2>
      <ul className="border rounded-xl bg-white/80 shadow-sm p-4">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between items-center border-b py-3 last:border-none">
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-700 font-semibold">₹{item.price} x {item.qty}</span>
          </li>
        ))}
      </ul> */}

      {/* Timeline Section */}
      <h2 className="text-xl font-semibold mt-6 mb-3">📍 Delivery Timeline:</h2>
      <div className="relative border-l-4 border-blue-500 pl-6 bg-white/80 p-4 rounded-xl shadow-sm">
        <p className="font-bold text-gray-800">🚚 {order.startAddress} (Start)</p>
        {order.checkpoints.$values.map((cp, idx) => (
          <div key={idx} className="ml-4 mt-5">
            <div className={`h-4 w-4 rounded-full absolute -left-[9px] ${idx === order.checkpoints.length - 1 ? "bg-green-500" : "bg-blue-500"} shadow-md`}></div>
            <p className="text-lg font-semibold">{cp.status}</p>
            <p className="text-gray-600">{cp.location} - {cp.date}</p>
          </div>
        ))}
        <p className="font-bold text-gray-800 mt-5">📦 {order.endAddress} (End)</p>
      </div>

      {/* Cancel Order Button */}
      {order.status !== "Delivered" && order.status !== "Canceled" && (
        <button
          onClick={handleCancelOrder}
          className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 mt-6 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          ❌ Cancel Order
        </button>
      )}

      {order.status === "Canceled" && (
        <p className="text-red-600 font-bold mt-6 text-center text-lg">🚫 Order has been canceled</p>
      )}
    </div>
  );
};

export default OrderTracking;
