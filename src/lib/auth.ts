import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Returns whether a given user ID corresponds to an admin user.
 *
 * Checks the Firestore document at `users/{uid}` and resolves to `true` only if the document exists
 * and its `isAdmin` field is strictly `true`. If `uid` is falsy, the document does not exist,
 * or any error occurs while fetching the document, the function resolves to `false`.
 *
 * @param uid - The user ID to check
 * @returns A promise that resolves to `true` when the user's `isAdmin` field is `true`; otherwise `false`.
 */
export async function isAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;

  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().isAdmin === true) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
  
