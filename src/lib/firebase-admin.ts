import * as admin from 'firebase-admin';

let adminInstance: typeof admin | null = null;

function initializeFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }

  if (!process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_PRIVATE_KEY ||
      !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('Missing Firebase Admin SDK configuration');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  return admin;
}

export function getFirebaseAdmin() {
  if (!adminInstance) {
    adminInstance = initializeFirebaseAdmin();
  }
  return adminInstance;
}
