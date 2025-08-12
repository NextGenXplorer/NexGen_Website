import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin'; // Admin SDK
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET from environment variables.');
}

/**
 * Checks whether the current request has a valid admin session.
 *
 * Reads the `admin_session` cookie and verifies it as a JWT. Returns `true`
 * only when the token decodes to an object with `isAdmin === true`; returns
 * `false` if the cookie is missing, the token is invalid, or verification fails.
 *
 * @returns `true` when an admin session is present and valid; otherwise `false`.
 */
function verifyAdmin(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return typeof decoded === 'object' && decoded.isAdmin === true;
  } catch (error) {
    console.log("Admin verification failed:", error);
    return false;
  }
}

/**
 * Extracts the 11-character YouTube video ID from a YouTube URL.
 *
 * Accepts common YouTube URL forms (full watch URLs, shortened youtu.be links, embed URLs, etc.).
 *
 * @param url - The YouTube URL or string potentially containing a video ID.
 * @returns The 11-character YouTube video ID if found and valid; otherwise `null`.
 */
function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v=)|(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|watch\?v%3D))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

/**
 * Returns a JSON list of videos. Public requests receive only videos with `isPublic === true`; authenticated admin requests receive all videos, both ordered by `createdAt` descending.
 *
 * The response body is an array of video objects with an `id` property and the stored document fields. On error, responds with a 500 status and a JSON message.
 *
 * @returns A Next.js JSON Response containing the array of videos or an error message with status 500.
 */
export async function GET() {
  try {
    const isAdmin = verifyAdmin();

    const videosQuery = isAdmin
      ? adminDb.collection('videos').orderBy('createdAt', 'desc')
      : adminDb.collection('videos').where('isPublic', '==', true).orderBy('createdAt', 'desc');

    const snapshot = await videosQuery.get();

    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ message: 'Failed to fetch videos.' }, { status: 500 });
  }
}

/**
 * Adds a new YouTube video document to Firestore (admin only).
 *
 * Validates admin session, parses JSON body for `youtubeUrl`, `relatedLinks`, and `isPublic`
 * (defaults to true). Extracts the YouTube ID, prevents duplicates, fetches YouTube oEmbed data
 * to populate title and thumbnail, creates a video document with `createdAt`, saves it to the
 * `videos` collection, and triggers ISR revalidation for `/youtube` and `/`.
 *
 * Returns:
 * - 201 with the new document `id` on success.
 * - 400 for missing or invalid `youtubeUrl`.
 * - 401 if the requester is not an admin.
 * - 409 if a video with the same YouTube ID already exists.
 * - 500 on unexpected errors.
 *
 * @returns A NextResponse with a JSON body describing the result and an appropriate HTTP status.
 */
export async function POST(request: NextRequest) {
  if (!verifyAdmin()) {
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

/**
   * Deletes a YouTube video document by ID (admin-only).
   *
   * Verifies admin access via the request's `admin_session` cookie; expects the request body to be JSON with an `id` field containing the Firestore document ID to delete. On success it deletes the document from the `videos` collection and triggers ISR revalidation for `/youtube` and `/`.
   *
   * @param request - NextRequest whose JSON body must include `{ id: string }`.
   * @returns A NextResponse with:
   *  - 200 and `{ message: 'Video deleted successfully.' }` on success,
   *  - 400 if `id` is missing,
   *  - 401 if the requester is not an admin,
   *  - 500 with an error message on failure.
   */
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin()) {
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
      
