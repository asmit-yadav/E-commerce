import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Wishlist Icons

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const userId = Number(localStorage.getItem("userId")); // ✅ Fetch userId from localStorage

  const isInWishlist = wishlist.some((item) => item.productId === product.id);

  const handleAddToCart = () => {
    addToCart(userId,product);
    toast.success(`${product.name} added to cart!`, { position: "top-right", autoClose: 2000 });
  };

  const handleWishlistToggle = () => {

    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }

    const matchedWishlistItem = wishlist.find((item) => item.productId === product.id);
    const wishlistId = matchedWishlistItem?.id;

    if (wishlistId) {
      console.log("product",product)
      removeFromWishlist(wishlistId);
    } else {
      addToWishlist(userId , product?.id);
      toast.success(`${product.name} added to wishlist!`, { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <motion.div
      className="border p-2 shadow-lg rounded-lg bg-white relative"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <button
      aria-label="added to wishlist"
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 text-red-500 text-xl"
      >
        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
      </button>
      <Link to={`/product/${product.id}`} state={{product}} className="block">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
      </Link>
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-700">${product.price}</p>

      <button
      aria-label="added to cart"
        onClick={handleAddToCart}
        // className="bg-blue-500 text-white px-4 py-2 mt-2 block rounded transition-all w-full hover:bg-green-600"
        className="bg-[#326ed1] text-white px-4 py-2 mt-2 block rounded transition-all w-full hover:bg-green-600"

      >
        Add to Cart
      </button>
    </motion.div>
  );
};

export default ProductCard;
