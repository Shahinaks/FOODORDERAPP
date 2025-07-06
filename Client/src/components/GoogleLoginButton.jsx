// GoogleLoginButton.jsx
import React from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User:", user);
      // Optionally redirect or store token/user info
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <Button variant="outline-light" onClick={handleGoogleLogin} className="w-100">
      <FaGoogle className="me-2" /> Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;
