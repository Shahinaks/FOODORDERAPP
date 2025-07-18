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
    console.log('🔓 Firebase token decoded:', decodedToken);

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
      }
    }

    // 🛠️ Force name update if it's still "New User"
    const defaultNames = ['new user', '', null];
    const currentName = (user.name || '').trim().toLowerCase();

    if (defaultNames.includes(currentName)) {
      const inferredName =
        name?.trim() ||
        displayName?.trim() ||
        email.split('@')[0].trim();

      if (inferredName && inferredName.toLowerCase() !== 'new user') {
        user.name = inferredName;
        await user.save();
        console.log(`🔧 Updated user name to: ${inferredName}`);
      }
    }

    req.user = user;
    console.log(`🧾 Final user name in MongoDB: "${user.name}"`);

    next();
  } catch (err) {
    console.error('❌ Firebase token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};
