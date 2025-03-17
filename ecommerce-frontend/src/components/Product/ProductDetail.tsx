import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  quantity: number;
  reviews: { user: string; comment: string; stars: number }[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = Number(localStorage.getItem("userId")); // ✅ Fetch userId from localStorage

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5176/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const isInWishlist = wishlist.some((item) => item.productId === product?.id);

  const handleAddToCart = () => {
    if(!product) return;

    addToCart(userId,product);
    toast.success(`${product?.name} added to cart!`);
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
      addToWishlist(userId, product.id);
      toast.success(`${product.name} added to wishlist!`, { position: "top-right", autoClose: 2000 });
    }
  };

  const handleReviewSubmit = async () => {
    const userEmail = localStorage.getItem("userEmail") || "";

    if (!userEmail.trim() || !product) {
        toast.error("User is not logged in!");
        return;
    }

    if (!newReview.comment.trim()) {
        toast.error("Please enter a review before submitting.");
        return;
    }

    const reviewData = {
        productId: product.id,
        user: userEmail,  // Use userEmail from localStorage
        comment: newReview.comment,
        stars: newReview.stars,
    };

    try {
        // **STEP 1: Post New Review**
        const response = await fetch("http://localhost:5176/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error("Failed to submit review");
        }

        const addedReview = await response.json();

        // **STEP 2: Update Local State with New Review**
        const updatedReviews = [...(product.reviews.$values || []), addedReview];

        // **STEP 3: Calculate New Average Rating**
        const totalStars = updatedReviews.reduce((sum, review) => sum + review.stars, 0);
        const newRating = totalStars / updatedReviews.length;

        // **STEP 4: Call API to Update Product Rating in DB**
        const ratingResponse = await fetch(`http://localhost:5176/api/products/${product.id}/update-rating`, {
            method: "PATCH", // or PUT
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating: newRating }),
        });

        if (!ratingResponse.ok) {
            throw new Error("Failed to update product rating");
        }

        // **STEP 5: Update Product State**
        setProduct({
            ...product,
            reviews: { ...product.reviews, $values: updatedReviews },
            rating: newRating,
        });

        // Reset review form
        setNewReview({ user: "", comment: "", stars: 5 });

        toast.success("Review submitted successfully!");
    } catch (error) {
        toast.error("Failed to submit review. Please try again.");
    }
};

  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <motion.div
      className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-white shadow-lg rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Product Image */}
        <motion.img
          src={product?.image}
          alt={product?.name}
          className="w-full max-w-md h-96 rounded-xl shadow-lg object-cover border border-gray-200"
          whileHover={{ scale: 1.05 }}
        />
  
        {/* Product Details */}
        <div className="p-4">
          <h1 className="text-3xl font-extrabold text-gray-900">{product?.name}</h1>
          <p className="text-gray-600 mt-3 text-lg">{product?.description}</p>
  
          {/* Price & Rating */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-2xl font-semibold text-blue-600">${product?.price}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < product?.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </div>
  
          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <motion.button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </motion.button>
  
            <motion.button
              onClick={handleWishlistToggle}
              className={`text-2xl transition-all ${
                isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
              whileHover={{ scale: 1.2 }}
            >
              {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            </motion.button>
          </div>
        </div>
      </div>
  
      {/* Reviews Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
  
        <div className="mt-4 max-h-64 overflow-y-auto">
          {product.reviews.$values.length > 0 ? (
            product.reviews.$values.map((review, index) => (
              <div key={index} className="border-b pb-3 mb-3">
                <p className="font-semibold text-gray-800">{review.user}</p>
                <p className="text-gray-600">{review.comment}</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.stars ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
  
        {/* Add Review */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Leave a Review</h3>
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="border p-3 w-full rounded-lg mt-2 bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          />
  
          {/* Rating Selection */}
          <div className="flex items-center mt-3">
            <span className="mr-3 font-semibold">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl ${
                  star <= newReview.stars ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setNewReview({ ...newReview, stars: star })}
              />
            ))}
          </div>
  
          {/* Submit Button */}
          <motion.button
            onClick={handleReviewSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg mt-4 transition-all"
            whileHover={{ scale: 1.05 }}
          >
            Submit Review
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
  
};

export default ProductDetail;
