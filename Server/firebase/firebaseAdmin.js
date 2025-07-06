import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JJSON.parse(process.env.FIREBASE_ADMIN_SDK);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
