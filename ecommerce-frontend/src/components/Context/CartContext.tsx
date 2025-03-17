import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../Axios/axiosInstance"; // ✅ Import AxiosInstance
import { Product } from "../Product/ProductList";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  productId: number; // Ensure productId is included
  product: Product;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const userId = Number(localStorage.getItem("userId")) || 0; // Fetch userId

  // 🛒 Fetch cart items when component mounts
  useEffect(() => {
    if (!userId || userId === 0) return; // Ensure userId is valid before fetching

    axiosInstance
      .get(`/cart/${userId}`) // ✅ Base URL already set in axiosInstance
      .then((response) => setCart(response.data.$values))
      .catch((error) => console.error("Error fetching cart:", error));
  }, [userId]);

  // 🛍️ Add item to cart
  const addToCart = async (userid:number , product: CartItem) => {
    try {
      const cartItem = {
        userId: userid, // Ensure correct data format
        productId: product.id, // Backend expects `productId`
        quantity: product.quantity,
      };

      const response = await axiosInstance.post("/cart", cartItem); // ✅ axiosInstance use kiya
      setCart([...cart, response.data]);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ❌ Remove item from cart
  const removeFromCart = async (id: number) => {
    try {
      await axiosInstance.delete(`/cart/${id}`); // ✅ axiosInstance use kiya
      setCart(cart.filter((item) => item.id !== id));
      toast.success(`Product removed from cart!`);
    } catch (error) {
      toast.error(`Product can't be removed from cart. Some error occurred!`);
    }
  };

  // 🗑️ Clear entire cart (NEW FUNCTION)
  const clearCart = async () => {
    try {
      const cartItemIds = cart.map(item => item.id);
      if (!cartItemIds.length) return; // No need to clear if cart is empty

      await axiosInstance.post("/cart/clear", { cartItemIds }, { headers: { "Content-Type": "application/json" } });
      setCart([]); // ✅ Clear cart state after API call
      toast.success("Cart cleared successfully!");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart!");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart , clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
