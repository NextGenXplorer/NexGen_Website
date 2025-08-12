import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface AdminJwtPayload extends JwtPayload {
  isAdmin: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyAdmin(): Promise<boolean> {
  if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET from environment variables.');
    return false;
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return false;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    return decoded.isAdmin === true;
  } catch (error) {
    console.log("Admin verification failed:", error);
    return false;
  }
}

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
  
