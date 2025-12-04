import admin from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config();

const requiredVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_STORAGE_BUCKET"
];

requiredVars.forEach(key => {
  if (!process.env[key]) {
    console.error(`Missing ENV variable: ${key}`);
    throw new Error(`Missing ENV variable: ${key}`);
  }
});

if (!admin.apps.length) {
  // Handle private key - convert escaped \n to actual newlines
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Replace literal \n with actual newlines
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Additional validation
  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    console.error('FIREBASE_PRIVATE_KEY appears to be malformed');
    throw new Error('Invalid FIREBASE_PRIVATE_KEY format');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  console.log('✅ Firebase Admin initialized successfully');
}

export const adminDB = admin.firestore();
export const adminStorage = admin.storage().bucket();
