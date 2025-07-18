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
    console.log('🔓 Decoded Firebase token:', decodedToken);

    const { uid, email, name, displayName, role: customRole } = decodedToken;

    if (!email) {
      console.log('🚫 No email in token');
      return res.status(400).json({ message: 'Authenticated user has no email' });
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        user.firebaseUid = uid;
        if (customRole && user.role !== 'admin') user.role = customRole;
        await user.save();
        console.log('🔗 Linked Firebase UID to existing user');
      } else {
        const inferredName =
          name?.trim() ||
          displayName?.trim() ||
          email.split('@')[0].trim();

        user = await User.create({
          firebaseUid: uid,
          name: inferredName || 'New User',
          email,
          role: customRole || 'user',
        });
        console.log('🆕 Created new user in MongoDB:', user.name);
      }
    }

    // 🛠️ Update name if it's still "New User"
    const currentName = (user.name || '').trim().toLowerCase();
    const inferredName =
      name?.trim() ||
      displayName?.trim() ||
      email.split('@')[0].trim();

    if (currentName === 'new user' && inferredName && inferredName.toLowerCase() !== 'new user') {
      user.name = inferredName;
      await user.save();
      console.log(`✅ Updated user name to: "${user.name}"`);
    }

    req.user = user;

    if (process.env.NODE_ENV !== 'production') {
      console.log('👤 Authenticated user:', {
        uid: user.firebaseUid,
        mongoId: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
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
