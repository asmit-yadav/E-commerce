import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./Context/CartContext";
import { useWishlist } from "./Context/WishlistContext";
import { FaShoppingCart, FaHeart, FaHome, FaStore, FaUser } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-white bg-opacity-70 backdrop-blur-md shadow-md p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">E-Shop</h1>
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            {/* Home */}
            <li>
              <Link
                aria-label="navigating to the home"
                to="/"
                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/" ? "text-blue-600 bg-blue-100" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FaHome className="text-xl" />
              </Link>
            </li>

            {/* Shop */}
            <li>
              <Link
                aria-label="navigating to the shop"
                to="/shop"
                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/shop" ? "text-blue-600 bg-blue-100" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FaStore className="text-xl" />
              </Link>
            </li>

            {/* Cart */}
            <li className="relative">
              <Link
                aria-label="navigating to the cart"
                to="/cart"
                className={`relative flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/cart" ? "text-blue-600 bg-blue-100" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FaShoppingCart className="text-xl" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {cart.length}
                  </span>
                )}
              </Link>
            </li>

            {/* Wishlist */}
            <li className="relative">
              <Link
                aria-label="navigating to the wishlist"
                to="/wishlist"
                className={`relative flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/wishlist" ? "text-blue-600 bg-blue-100" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FaHeart className="text-xl text-red-500" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link
                aria-label="navigating to the user-profile"
                to="/profile"
                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/profile" ? "text-blue-600 bg-blue-100" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FaUser className="text-xl" />
              </Link>
            </li>

            {/* Authentication */}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-[#d73c3c] hover:bg-red-600 px-4 py-2 rounded-lg text-white transition duration-300 shadow-md"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="bg-[#326ed1] hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition duration-300 shadow-md"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 rounded-lg text-white transition duration-300 shadow-md ${location.pathname === "/signup" ? "bg-[#14873f]" : "bg-[#14873f] hover:bg-green-600"
                      }`}
                  >
                    Signup
                  </Link>

                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
