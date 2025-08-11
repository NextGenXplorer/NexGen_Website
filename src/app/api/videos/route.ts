import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Using client-side db for public GET

// Helper function to verify the user's token and admin status
async function verifyAdmin(request: Request): Promise<{ authorized: boolean; error?: string; status?: number }> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { authorized: false, error: 'Authorization header missing or invalid.', status: 401 };
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const admin = getFirebaseAdmin();
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Check if the user is an admin in Firestore
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        if (!userDoc.exists || !userDoc.data()?.isAdmin) {
            return { authorized: false, error: 'User is not an administrator.', status: 403 };
        }

        return { authorized: true };
    } catch (error) {
        console.error('Error verifying token:', error);
        return { authorized: false, error: 'Invalid or expired token.', status: 401 };
    }
}


// GET all videos (public)
export async function GET() {
    try {
        const videosCollection = collection(db, 'videos');
        const videoSnapshot = await getDocs(videosCollection);
        const videos = videoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json({ message: 'Failed to fetch videos.' }, { status: 500 });
    }
}

// POST a new video (admin only)
export async function POST(request: Request) {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.authorized) {
        return NextResponse.json({ message: adminCheck.error }, { status: adminCheck.status });
    }
    
    try {
        const { youtubeUrl, relatedLinks } = await request.json();

        if (!youtubeUrl) {
            return NextResponse.json({ message: 'YouTube URL is required.' }, { status: 400 });
        }

        // Optional: Check if video with this URL already exists
        const videosCollection = collection(db, 'videos');
        const q = query(videosCollection, where("youtubeUrl", "==", youtubeUrl));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return NextResponse.json({ message: 'Video with this URL already exists.' }, { status: 409 });
        }

        const newVideo = {
            youtubeUrl,
            relatedLinks: relatedLinks || [],
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'videos'), newVideo);

        return NextResponse.json({ message: 'Video added successfully.', id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error('Error adding video:', error);
        return NextResponse.json({ message: 'Failed to add video.' }, { status: 500 });
    }
}


// DELETE a video (admin only)
export async function DELETE(request: Request) {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.authorized) {
        return NextResponse.json({ message: adminCheck.error }, { status: adminCheck.status });
    }

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: 'Video ID is required.' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'videos', id));

        return NextResponse.json({ message: 'Video deleted successfully.' });
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json({ message: 'Failed to delete video.' }, { status: 500 });
    }
}
