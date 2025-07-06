import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = '/etc/secrets/firebase-adminsdk.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
