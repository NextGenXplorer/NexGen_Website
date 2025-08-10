import * as admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
}

let serviceAccount;
try {
  // Decode Base64 → UTF-8 string → JSON
  const jsonString = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    "base64"
  ).toString("utf8");

  serviceAccount = JSON.parse(jsonString);
} catch (e) {
  console.error("Failed to decode FIREBASE_SERVICE_ACCOUNT_KEY", e);
  throw e;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
    
