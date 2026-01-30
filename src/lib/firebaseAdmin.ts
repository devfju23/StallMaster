import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase only once
if (!admin.apps.length) {
  const serviceAccount = require("../stallmaster-firebase-admin.json"); // the JSON key you downloaded

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export Firestore so we can use it in API routes
export const db = getFirestore();
