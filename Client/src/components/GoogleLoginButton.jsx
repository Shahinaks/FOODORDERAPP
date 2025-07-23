import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setPrompt('select_account'); // ✅ Force account chooser

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User:", user.email);
      // Optional: redirect or store token
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
