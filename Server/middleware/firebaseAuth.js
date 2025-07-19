// middleware/firebaseAuth.js
import admin from '../firebase/firebaseAdmin.js';
import User from '../models/User.model.js';

export const verifyFirebaseToken = async (req, res, next) => {
  console.log('🛡️ verifyFirebaseToken middleware triggered');

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.log('🚫 No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, displayName, role: customRole } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid }) || await User.findOne({ email });

    if (!user) {
      const inferredName = name?.trim() || displayName?.trim() || email.split('@')[0].trim();
      user = await User.create({
        firebaseUid: uid,
        name: inferredName || 'New User',
        email,
        role: customRole || 'user',
      });
    } else {
      if (customRole && user.role !== 'admin') user.role = customRole;
      user.firebaseUid = uid;
      await user.save();
    }

    // Ensure name is not "New User"
    const currentName = (user.name || '').trim().toLowerCase();
    const inferredName = name?.trim() || displayName?.trim() || email.split('@')[0].trim();

    if (currentName === 'new user' && inferredName.toLowerCase() !== 'new user') {
      user.name = inferredName;
      await user.save();
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Firebase token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid Firebase token' });
  }
};
