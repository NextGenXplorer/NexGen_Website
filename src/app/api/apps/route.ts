import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET apps (public for all apps)
export async function GET() {
  try {
    const appsQuery = adminDb.collection('apps').orderBy('createdAt', 'desc');
    const snapshot = await appsQuery.get();

    const apps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({ message: 'Failed to fetch apps.' }, { status: 500 });
  }
}

// POST a new app (admin only)
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { name, description, logoUrl, downloadUrl } = await request.json();

    if (!name || !logoUrl || !downloadUrl) {
      return NextResponse.json({
        message: 'App name, logo URL, and download URL are required.'
      }, { status: 400 });
    }

    const newApp = {
      name,
      description: description || '',
      logoUrl,
      downloadUrl,
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection('apps').add(newApp);

    revalidatePath('/apps');

    return NextResponse.json({
      message: 'App added successfully.',
      id: docRef.id
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error adding app:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({
      message: 'Failed to add app.',
      error: errorMessage
    }, { status: 500 });
  }
}

// DELETE an app (admin only)
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'App ID is required.' }, { status: 400 });
    }

    const appDoc = await adminDb.collection('apps').doc(id).get();
    if (!appDoc.exists) {
      return NextResponse.json({ message: 'App not found.' }, { status: 404 });
    }

    await adminDb.collection('apps').doc(id).delete();

    revalidatePath('/apps');

    return NextResponse.json({ message: 'App deleted successfully.' });
  } catch (error: unknown) {
    console.error('Error deleting app:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({
      message: 'Failed to delete app.',
      error: errorMessage
    }, { status: 500 });
  }
}
