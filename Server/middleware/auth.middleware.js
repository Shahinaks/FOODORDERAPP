import admin from '../firebase/firebaseAdmin.js';
import User from '../models/User.model.js';


export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, name, email, role: customRole } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: 'Authenticated user has no email' });
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        user.firebaseUid = uid;
        await user.save();
      } else {
        user = await User.create({
          firebaseUid: uid,
          name: name || 'New User',
          email,
          role: customRole || 'user',
        });
      }
    }

    req.user = user;

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Authenticated user:', {
        uid: user.firebaseUid,
        mongoId: user._id.toString(),
        role: user.role,
        email: user.email,
      });
    }

    next();
  } catch (err) {
    console.error('❌ Firebase token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};
