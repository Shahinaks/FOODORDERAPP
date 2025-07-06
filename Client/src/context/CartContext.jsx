import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
const API = import.meta.env.VITE_API_URL;

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('firebaseToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCart = async () => {
    if (!currentUser) return setCartItems([]);
    try {
      setLoading(true);
      const res = await axios.get('/cart', getAuthHeaders());
      setCartItems(res.data.items);
      setCartCount(res.data.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItem, quantity = 1) => {
    if (!currentUser) return toast.warning('Please login to add to cart');
    try {
      const res = await axios.post('/cart/add', { menuItemId: menuItem._id, quantity }, getAuthHeaders());
      setCartItems(res.data.items);
      setCartCount(res.data.items.reduce((sum, item) => sum + item.quantity, 0));
      toast.success('Added to cart');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const updateCartItem = async (menuItemId, quantity) => {
    try {
      const res = await axios.put('/cart/update', { menuItemId, quantity }, getAuthHeaders());
      setCartItems(res.data.items);
      setCartCount(res.data.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      toast.error('Could not update item');
    }
  };

  const removeFromCart = async (menuItemId) => {
    try {
      const res = await axios.delete('/cart/remove', {
        data: { menuItemId },
        ...getAuthHeaders(),
      });
      setCartItems(res.data.items);
      setCartCount(res.data.items.reduce((sum, item) => sum + item.quantity, 0));
      toast.success('Item removed');
    } catch {
      toast.error('Could not remove item');
    }
  };
  const clearCart = async () => {
    try {
      await axios.delete('/cart/clear', getAuthHeaders());
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
