import admin from '../firebase/firebaseAdmin.js';
import User from '../models/User.model.js'; 

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ message: 'User not found in database' });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error('Firebase token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};
