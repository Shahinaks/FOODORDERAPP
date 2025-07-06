import admin from '../firebase/firebaseAdmin.js';
import User from '../models/User.model.js';

export const firebaseLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || 'Unnamed User',
        email: decoded.email,
        role: 'user',
      });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('🔥 Firebase login failed:', err.message);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};
