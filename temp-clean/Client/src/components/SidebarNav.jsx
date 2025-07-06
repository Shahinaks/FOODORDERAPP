import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaUser, FaClipboardCheck } from 'react-icons/fa';


const SidebarNav = () => {
  const { pathname } = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/menu', label: 'Menu', icon: <FaList /> },
    { path: '/checkout', label: 'Checkout', icon: <FaShoppingCart /> },
    { path: '/orders', label: 'Orders', icon: <FaClipboardCheck /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <div className="sidebar-nav p-3 text-light bg-dark rounded h-100 d-flex flex-column gap-3">
      {navItems.map(({ path, label, icon }) => (
        <Link
          key={path}
          to={path}
          className={`nav-link d-flex align-items-center gap-2 ${pathname === path ? 'active text-warning' : 'text-white'}`}
        >
          {icon} {label}
        </Link>
      ))}
    </div>
  );
};

export default SidebarNav;
