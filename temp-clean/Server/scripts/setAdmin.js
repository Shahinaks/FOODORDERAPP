import admin from '../firebase/firebaseAdmin.js'; 

const makeUserAdmin = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log(`✅ User ${uid} is now an admin`);
  } catch (err) {
    console.error('❌ Failed to set admin claim:', err);
  }
};

makeUserAdmin('GS8v7QVTSAdqMNvZn8oL8VwQeRA2');
