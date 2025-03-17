import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { Suspense, lazy } from "react";
import SignupPage from "../components/Auth/Signup";
import LoginPage from "../components/Auth/Login";
import { CartProvider } from "../components/Context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import { WishlistProvider } from "../components/Context/WishlistContext";
import Wishlist from "../components/Wishlist";
import ProductDetail from "../components/Product/ProductDetail";
import CheckoutPage from "../components/CheckoutPage";
import OrderHistory from "../components/OrderHistory";
import OrderTracking from "../components/Order/OrderTracking";
import PremiumDeals from "../components/PremiumDeals";

const HomePage = lazy(() => import("../components/HomePage"));
const ShopPage = lazy(() => import("../components/ShopPage"));
const CartPage = lazy(() => import("../components/CartPage"));
const ProfilePage = lazy(() => import("../components/ProfilePage"));

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Access Denied! Please log in first.");
    return <Navigate to="/" />;
  }

  return element;
};

// ✅ MainLayout ko `children` properly dene ke liye wrapper
const LayoutWrapper = () => (
  <MainLayout>
    <Outlet /> {/* Yeh ensure karega ke children `MainLayout` ke andar dikhayen */}
  </MainLayout>
);

const AppRoutes = () => {
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastContainer aria-label="Notification container" />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* ✅ Public Routes - Without Header/Footer */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* ✅ Private Routes - With Header/Footer */}
              <Route path="/" element={<LayoutWrapper />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ProtectedRoute element={<ShopPage />} />} />
                <Route path="cart" element={<ProtectedRoute element={<CartPage />} />} />
                <Route path="profile" element={<ProtectedRoute element={<ProfilePage />} />} />
                <Route path="wishlist" element={<ProtectedRoute element={<Wishlist />} />} />
                <Route path="product/:id" element={<ProtectedRoute element={<ProductDetail />} />} />
                <Route path="checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />
                <Route path="/order/:orderId" element={<OrderTracking />} />
                <Route path="/premium-deals" element={<PremiumDeals />} /> 
              </Route>

              {/* ✅ Default Redirect for Unknown Routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
};

export default AppRoutes;
