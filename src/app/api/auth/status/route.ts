import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET from environment variables.');
}

/**
 * GET handler that reports whether the current request is authenticated as an admin.
 *
 * Reads the `admin_session` cookie, verifies it as a JWT using the module's `JWT_SECRET`,
 * and returns a 200 JSON response `{ isAuthenticated: true | false }`.
 *
 * - Returns `isAuthenticated: true` only if the token verifies and decodes to an object with `isAdmin === true`.
 * - Any missing, invalid, or expired token results in `{ isAuthenticated: false }`. Verification errors are logged.
 *
 * @returns A NextResponse with status 200 and a JSON body `{ isAuthenticated: boolean }`.
 */
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
