import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

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
  
