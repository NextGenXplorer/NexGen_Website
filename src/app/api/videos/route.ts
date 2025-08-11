import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Using client-side db for public GET
import { adminDb } from '@/lib/firebase-admin'; // Using admin SDK for protected routes
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET from environment variables.');
}

// Helper function to verify the admin's JWT session
function verifyAdmin(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded.isAdmin === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Admin verification failed:", error);
    return false;
  }
}

// GET all videos (public)
export async function GET() {
    try {
        // Using client-side db for public, read-only access
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
export async function POST(request: NextRequest) {
    if (!verifyAdmin()) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    
    try {
        const { youtubeUrl, relatedLinks } = await request.json();

        if (!youtubeUrl) {
            return NextResponse.json({ message: 'YouTube URL is required.' }, { status: 400 });
        }

        // Using adminDb to bypass security rules for admin actions
        const videosCollection = adminDb.collection('videos');
        const q = await videosCollection.where("youtubeUrl", "==", youtubeUrl).get();
        if (!q.empty) {
            return NextResponse.json({ message: 'Video with this URL already exists.' }, { status: 409 });
        }

        const newVideo = {
            youtubeUrl,
            relatedLinks: relatedLinks || [],
            createdAt: new Date(),
        };

        const docRef = await videosCollection.add(newVideo);

        return NextResponse.json({ message: 'Video added successfully.', id: docRef.id }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding video:', error);
        return NextResponse.json({ message: 'Failed to add video.', error: error.message }, { status: 500 });
    }
}


// DELETE a video (admin only)
export async function DELETE(request: NextRequest) {
    if (!verifyAdmin()) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: 'Video ID is required.' }, { status: 400 });
        }

        // Using adminDb to bypass security rules for admin actions
        await adminDb.collection('videos').doc(id).delete();

        return NextResponse.json({ message: 'Video deleted successfully.' });
    } catch (error: any) {
        console.error('Error deleting video:', error);
        return NextResponse.json({ message: 'Failed to delete video.', error: error.message }, { status: 500 });
    }
}
