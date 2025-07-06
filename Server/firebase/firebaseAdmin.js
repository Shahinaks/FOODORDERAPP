import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

try {
  if (process.env.FIREBASE_ADMIN_SDK) {
   
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
  } else {
 
    const localPath = path.resolve(__dirname, './firebase-adminsdk.json');
    serviceAccount = JSON.parse(readFileSync(localPath, 'utf-8'));
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('🔥 Firebase Admin SDK init failed:', error.message);
}

export default admin;
