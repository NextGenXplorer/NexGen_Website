import * as admin from 'firebase-admin';

// Check if the service account JSON is provided as a single environment variable
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (serviceAccount) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });
    }
} else {
    // Fallback to individual environment variables if the JSON is not provided
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn("Firebase Admin SDK not initialized. Missing environment variables.");
    } else {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    client_email: process.env.FIREBASE_CLIENT_EMAIL,
                }),
            });
        }
    }
}


export const adminDb = admin.firestore();
