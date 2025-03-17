import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../Axios/axiosInstance"; // ✅ Importing Axios Instance
import { Product } from "../Product/ProductList";

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product: Product;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (productId: number) => void; // Removed userId since it's in localStorage
  removeFromWishlist: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const userId = Number(localStorage.getItem("userId")) || 0; // ✅ Fetch from local storage

  // ✅ Fetch Wishlist Items
  useEffect(() => {
    if (!userId) return; // Ensure userId is valid before fetching

    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get(`/wishlist/${userId}`);
        setWishlist(response.data.$values);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
      }
    };

    fetchWishlist();
  }, [userId]);

  // ✅ Add Item to Wishlist
  const addToWishlist = async (userid : number , productId: number) => {
    if (!userid) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    try {
      const response = await axiosInstance.post("/wishlist", { userid, productId });
      setWishlist((prevWishlist) => [...prevWishlist, response.data]);
      toast.success("Product added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  // ✅ Remove Item from Wishlist
  const removeFromWishlist = async (id: number) => {
    try {
      await axiosInstance.delete(`/wishlist/${id}`);
      setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
      toast.success("Product removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
