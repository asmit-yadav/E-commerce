import { FaShoppingCart, FaCrown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found.");

        const [userRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:5176/api/auth/user/${userId}`),
          fetch(`http://localhost:5176/api/orders/user/${userId}`)
        ]);

        if (!userRes.ok || !ordersRes.ok) throw new Error("Failed to fetch data.");

        const userData = await userRes.json();
        const ordersData = await ordersRes.json();

        setUser(userData);
        setOrders(ordersData.$values);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {user.premiumUser && (
        <Link to="/premium-deals">
          <div className="mt-6 bg-yellow-500 text-white py-4 px-6 rounded-lg flex items-center justify-between shadow-md hover:bg-yellow-600 transition">
            <span className="font-bold">🎉 Exclusive Premium Deals Just for You!</span>
            <FaCrown className="text-2xl" />
          </div>
        </Link>
      )}

      {/* User Profile */}
      <div className="p-6 w-96 bg-white shadow-xl rounded-lg text-center mt-6">
        <h2 className="text-2xl font-bold">{user.email}</h2>
        <p className="text-gray-600 text-sm">User ID: #{user.id}</p>
      </div>

      {/* Order History Timeline */}
      <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" /> Order History
        </h3>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No orders yet.</p>
        ) : (
          
          <div className="mt-4 overflow-y-auto max-h-80 pr-2">
            <ul className="relative border-l-2 border-blue-400 pl-4">
              {orders.map((order) => (
                <li key={order.id} className="relative mb-6 pl-6">
                  <span className="absolute left-[-10px] top-1.5 w-4 h-4 bg-blue-500 rounded-full"></span>
                  <Link to={`/order/${order.orderId}`} className="block">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition">
                      <p className="font-medium">
                        Order ID: <span className="text-blue-600">#{order.orderId}</span>
                      </p>
                      <p className="text-gray-600">
                        Total: <span className="font-semibold">${order.totalAmount}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>   
        )}
      </div>
    </div>
  );
};

export default ProfilePage;