import * as admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
}

let serviceAccount;
try {
  // Replace escaped newlines with actual newlines
  const jsonString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n");
  serviceAccount = JSON.parse(jsonString);
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", e);
  throw e;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
  
