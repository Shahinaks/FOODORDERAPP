import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { socket } from '../socket.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState(null);
  const [role, setRole] = useState('user');
  const [authLoading, setAuthLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();

          setCurrentUser(firebaseUser);
          setFirebaseToken(token);
          localStorage.setItem('firebaseToken', token);
          setUid(firebaseUser.uid);
          setEmail(firebaseUser.email);

          const API = import.meta.env.VITE_API_URL;

          const res = await fetch(`${API}/users/check`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setRole(data.user.role || 'user');
            console.log('✅ User role from API:', data.user.role);
          } else {
            console.warn('⚠️ Failed to fetch user role — defaulting to user');
            setRole('user');
          }

          socket.emit('register', firebaseUser.uid);
        } catch (error) {
          console.error('❌ Auth context error:', error);
          setCurrentUser(null);
          setFirebaseToken(null);
          setRole('user');
          setUid(null);
          setEmail(null);
          localStorage.removeItem('firebaseToken');
        }
      } else {
        setCurrentUser(null);
        setFirebaseToken(null);
        setRole('user');
        setUid(null);
        setEmail(null);
        localStorage.removeItem('firebaseToken');
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseToken,
        role,
        authLoading,
        isAuthenticated: !!currentUser,
        uid,
        email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
