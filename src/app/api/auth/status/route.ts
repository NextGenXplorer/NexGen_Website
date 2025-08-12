import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET from environment variables.');
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ isAuthenticated: false }), { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded.isAdmin === true) {
      return new NextResponse(JSON.stringify({ isAuthenticated: true }), { status: 200 });
    }
    return new NextResponse(JSON.stringify({ isAuthenticated: false }), { status: 200 });
  } catch (error) {
    // This will catch expired tokens or invalid signatures
    console.log("Auth status check failed:", error);
    return new NextResponse(JSON.stringify({ isAuthenticated: false }), { status: 200 });
  }
}
