import { useWishlist } from "./Context/WishlistContext";
import { useCart } from "./Context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const userId = Number(localStorage.getItem("userId")); // ✅ Fetch userId from localStorage

  // Filter only wishlist products
  const wishlistProducts = wishlist;

  // Add to Cart Handler
  const handleAddToCart = (product: any) => {
    addToCart(userId,product.product);
    removeFromWishlist(product.id);
    toast.success(`${product.product.name} added to cart!`, { theme: "colored" });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Wishlist ❤️
      </h2>

      {wishlistProducts.length === 0 ? (
        <p className="text-gray-500 text-center">
          Your wishlist is empty.{" "}
          <Link to="/shop" className="text-blue-500 hover:underline" aria-label="navigating to the shop">
            Go shopping
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-full h-48 overflow-hidden rounded-md">
                <img
                  src={product.product.image}
                  alt={product.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {product.product.name}
              </h3>
              <p className="text-gray-600 text-sm">${product.product.price}</p>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#326ed1] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition"
                >
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="bg-[#d73c3c] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                >
                  <FaTrash />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
