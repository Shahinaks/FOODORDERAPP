import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import MenuPage from './Pages/MenuPage';
import CartPage from './Pages/CartPage';
import OrderPage from './Pages/MyOrderPage';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import RestaurantDetailPage from './Pages/RestaurantDetailPage';
import OrderConfirmation from './Pages/OrderConfirmation';
import WishlistPage from './Pages/WishlistPage';
import AboutPage from './Pages/AboutPage';
import NotificationPage from './Pages/NotificationPage';
import StripeWrapper from './components/StripeWrapper';
import FloatingChatIcon from './components/FloatingChatIcon';
import ProfileModal from './components/ProfileModal';

import AdminDashboardPage from './Pages/AdminDashboardPage';
import AdminOrdersPage from './Pages/AdminOrdersPage';
import AdminActivityPage from './Pages/AdminActivityPage';
import AdminMenuPage from './Pages/AdminMenuPage';
import AdminReviewModerationPage from './Pages/AdminReviewModerationPage';
import AdminCouponPage from './Pages/AdminCouponPage';
import AdminPaymentsPage from './Pages/AdminPaymentsPage';
import AdminNotificationPage from './Pages/AdminNotificationPage';


import useNotificationListener from './hooks/useNotificationListener'; 

const AppRoutes = () => {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideNavbarRoutes = ['/signup', '/login', '/menu', '/checkout'];
  const hideMainNavbar = isAdminRoute || hideNavbarRoutes.includes(location.pathname);

  useNotificationListener(); 

  return (
    <>
      {!hideMainNavbar && <AppNavbar onProfileClick={() => setShowProfile(true)} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-orders" element={<OrderPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/checkout" element={<StripeWrapper />} />
        <Route path="/notifications" element={<NotificationPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/overview" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/activity" element={<AdminActivityPage />} />
        <Route path="/admin/menu" element={<AdminMenuPage />} />
        <Route path="/admin/reviews" element={<AdminReviewModerationPage />} />
        <Route path="/admin/coupons" element={<AdminCouponPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationPage />} />

      </Routes>

      <ProfileModal show={showProfile} handleClose={() => setShowProfile(false)} />
      <FloatingChatIcon />
    </>
  );
};

export default AppRoutes;
