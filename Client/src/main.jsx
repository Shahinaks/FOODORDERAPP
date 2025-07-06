import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure this is the correct component, or replace with AppRoutes if defined
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this line
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
// import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
