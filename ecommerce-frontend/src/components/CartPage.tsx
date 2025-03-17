import { useCart } from "./Context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {}) // Start all with 1
  );

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 1) }));
  };

  const totalAmount = cart
    .reduce((acc, item) => acc + item.product.price * quantities[item.id], 0)
    .toFixed(2);

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        🛒 Your Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between border-b pb-4 last:border-none"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg shadow-md"
              />

              <div className="flex-1 px-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {item.product.name}
                </h3>
                <p className="text-gray-500 text-sm">${item.product.price}</p>
              </div>

              <div className="flex items-center">
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l-lg hover:bg-gray-400 transition"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100 text-gray-700">
                  {quantities[item.id]}
                </span>
                <button
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r-lg hover:bg-gray-400 transition"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>

              {/* <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
              >
                <FaTrashAlt size={16} />
              // </button> */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
                aria-label="Remove from cart"
              >
                <FaTrashAlt size={16} />
              </button>

            </div>
          ))}

          <div className="text-right text-xl font-bold text-gray-800">
            Total: <span className="text-blue-500">${totalAmount}</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg shadow-md font-semibold text-lg hover:scale-105 transition-all duration-200"
            >
              Place Order
            </button>
            {/* <button
              onClick={async () => await clearCart()}
              className="flex-1 bg-red-500 text-white p-3 rounded-lg shadow-md font-semibold text-lg hover:bg-red-600 transition-all duration-200"
            >
              Clear Cart
            </button> */}
            <button
              onClick={async () => await clearCart()}
              className="flex-1 bg-[#d73c3c] text-white p-3 rounded-lg shadow-md font-semibold text-lg hover:bg-red-600 transition-all duration-200"
            >
              Clear Cart
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
