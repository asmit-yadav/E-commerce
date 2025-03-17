import { useState, useEffect } from "react";
import { FaShoppingCart, FaCrown, FaTimesCircle, FaCheckCircle, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found.");

        const response = await fetch(`http://localhost:5176/api/orders/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch orders.");

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-2xl font-bold flex items-center gap-2 border-b pb-3">
          <FaShoppingCart className="text-blue-500" /> Order History
        </h3>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/order/${order.orderId}`)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order ID: <span className="text-blue-600">#{order.orderId}</span></p>
                    <p className="text-sm text-[#6b7280] bg-[#ffffff]">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>


                  </div>
                  <div className="text-green-500 flex items-center gap-1 font-semibold">
                    <FaCheckCircle /> Delivered
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
