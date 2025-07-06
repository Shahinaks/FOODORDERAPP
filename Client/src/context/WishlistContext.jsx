import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
const API = import.meta.env.VITE_API_URL;

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('firebaseToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchWishlist = async () => {
    if (!currentUser) {
      setWishlistItems([]);
      setWishlistCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('/wishlist', getAuthHeaders());
      setWishlistItems(res.data.items || []);
      setWishlistCount((res.data.items || []).length);
    } catch (err) {
      console.error('❌ Failed to fetch wishlist:', err);
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (menuItemId) => {
    if (!currentUser) return toast.warning('Please log in to use wishlist');

    const exists = wishlistItems.some(item => item._id === menuItemId);

    try {
      if (exists) {
        const res = await axios.delete(`/wishlist/${menuItemId}`, getAuthHeaders());
        setWishlistItems(res.data.wishlist.items);
        setWishlistCount(res.data.wishlist.items.length);
        toast.info('Removed from wishlist');
      } else {
        const res = await axios.post('/wishlist', { menuItemId }, getAuthHeaders());
        setWishlistItems(res.data.items);
        setWishlistCount(res.data.items.length);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error('❌ Wishlist toggle error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const clearWishlist = async () => {
    if (!currentUser) return toast.warning('Please log in to use wishlist');

    try {
      const res = await axios.delete('/wishlist', getAuthHeaders());
      setWishlistItems([]);
      setWishlistCount(0);
      toast.success('Wishlist cleared');
    } catch (err) {
      console.error('❌ Clear wishlist error:', err);
      toast.error('Failed to clear wishlist');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [currentUser]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        fetchWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
