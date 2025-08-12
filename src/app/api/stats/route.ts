import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/auth';

const statsRef = adminDb.collection('stats').doc('visits');

// GET visitor stats (admin only)
export async function GET() {
  if (!(await verifyAdmin())) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const doc = await statsRef.get();
    if (!doc.exists) {
      // If the document doesn't exist, initialize it.
      await statsRef.set({ count: 0 });
      return NextResponse.json({ count: 0 });
    }
    return NextResponse.json({ count: doc.data()?.count || 0 });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch visitor stats.' }),
      { status: 500 }
    );
  }
}

// POST to increment visitor count
export async function POST() {
  try {
    // Use a transaction to atomically increment the count.
    await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(statsRef);
      if (!doc.exists) {
        transaction.set(statsRef, { count: 1 });
      } else {
        const newCount = (doc.data()?.count || 0) + 1;
        transaction.update(statsRef, { count: newCount });
      }
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to increment visitor count.' }),
      { status: 500 }
    );
  }
}
