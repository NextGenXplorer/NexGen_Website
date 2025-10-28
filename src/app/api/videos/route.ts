import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin'; // Admin SDK
import { verifyAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=)|(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v%3D))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

// GET videos (public for public videos, full list for admin)
export async function GET() {
  try {
    const isAdmin = await verifyAdmin();

    // Fetch videos without orderBy to avoid needing composite index
    const videosQuery = isAdmin
      ? adminDb.collection('videos')
      : adminDb.collection('videos').where('isPublic', '==', true);

    const snapshot = await videosQuery.get();

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by createdAt in memory
    videos.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ message: 'Failed to fetch videos.' }, { status: 500 });
  }
}

// POST a new video (admin only)
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { youtubeUrl, relatedLinks, isPublic = true } = await request.json();
    if (!youtubeUrl) {
      return NextResponse.json({ message: 'YouTube URL is required.' }, { status: 400 });
    }

    const youtubeId = getYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json({ message: 'Invalid YouTube URL.' }, { status: 400 });
    }

    // Check for duplicates
    const q = await adminDb.collection('videos').where("youtubeId", "==", youtubeId).get();
    if (!q.empty) {
      return NextResponse.json({ message: 'Video with this ID already exists.' }, { status: 409 });
    }

    // Fetch oEmbed details
    const oembedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    );
    if (!oembedResponse.ok) {
      throw new Error('Failed to fetch video details from YouTube.');
    }
    const oembedData = await oembedResponse.json();

    const newVideo = {
      youtubeUrl,
      youtubeId,
      title: oembedData.title,
      description: oembedData.title,
      thumbnailUrl: oembedData.thumbnail_url.replace('hqdefault.jpg', 'maxresdefault.jpg'),
      relatedLinks: relatedLinks || [],
      isPublic,
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection('videos').add(newVideo);

    revalidatePath('/youtube');
    revalidatePath('/');

    return NextResponse.json({ message: 'Video added successfully.', id: docRef.id }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error adding video:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Failed to add video.', error: errorMessage }, { status: 500 });
  }
}

// DELETE a video (admin only)
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Video ID is required.' }, { status: 400 });
    }

    await adminDb.collection('videos').doc(id).delete();

    revalidatePath('/youtube');
    revalidatePath('/');

    return NextResponse.json({ message: 'Video deleted successfully.' });
  } catch (error: unknown) {
    console.error('Error deleting video:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ message: 'Failed to delete video.', error: errorMessage }, { status: 500 });
  }
  }
      
