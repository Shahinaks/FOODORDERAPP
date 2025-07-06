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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();

          setCurrentUser(firebaseUser);
          setFirebaseToken(token);
          localStorage.setItem('firebaseToken', token);

          const res = await fetch(`${API}/users/check`, {
            headers: { Authorization: `Bearer ${token}` },
          });



          if (res.ok) {
            const data = await res.json();
            setRole(data.user.role || 'user');
          } else {
            setRole('user');
          }

          // ✅ Register this user to their personal socket room
          socket.emit('register', firebaseUser.uid);

        } catch (error) {
          console.error('Auth context error:', error);
          setCurrentUser(null);
          setFirebaseToken(null);
          setRole('user');
          localStorage.removeItem('firebaseToken');
        }
      } else {
        setCurrentUser(null);
        setFirebaseToken(null);
        setRole('user');
        localStorage.removeItem('firebaseToken');
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, firebaseToken, role, authLoading, isAuthenticated: !!currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
