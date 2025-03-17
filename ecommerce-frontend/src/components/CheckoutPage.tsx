import { useState } from "react";
import { useCart } from "./Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.address) {
      alert("Please fill all fields!");
      return;
    }

    if (!cart.length) {
      alert("Cart is empty. Add items before placing an order.");
      return;
    }

    const orderData = {
      userId: localStorage.getItem("userId"),
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      totalAmount: cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
      address: formData.address,
      paymentMethod: formData.paymentMethod,
    };

    try {
      await axios.post("http://localhost:5176/api/orders", orderData);
      await clearCart();
      alert("Order Placed Successfully!");
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        🛍️ Checkout
      </h2>

      {/* Cart Summary Section with Scroll */}
      <div className="max-h-64 overflow-y-auto space-y-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">
                {item.product.name}
              </h3>
              <p className="text-gray-500 text-sm">
                ${item.product.price} x {item.quantity}
              </p>
            </div>
            <p className="text-gray-800 font-bold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* User Details Form */}
      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-blue-500"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Credit/Debit Card</option>
          </select>
        </div>

        {/* Total Price */}
        <div className="text-right text-xl font-bold text-gray-800">
          Total:{" "}
          <span className="text-blue-500">
            $
            {cart
              .reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )
              .toFixed(2)}
          </span>
        </div>

        {/* Buttons */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg shadow-md font-semibold text-lg hover:scale-105 transition-all duration-200"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
