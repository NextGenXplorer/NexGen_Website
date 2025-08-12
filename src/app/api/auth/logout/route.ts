import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

/**
 * POST route handler that logs out an admin by clearing the `admin_session` cookie.
 *
 * Clears the `admin_session` cookie (empty value, `maxAge: 0`, `httpOnly`, `sameSite: 'strict'`, `path: '/'`, `secure` true unless in development)
 * and returns a 200 OK JSON response indicating success. The cookie-clear instruction is applied via the `Set-Cookie` response header.
 *
 * @returns A NextResponse with status 200 and body `{ success: true, message: 'Logged out successfully.' }`, including the `Set-Cookie` header to clear the session cookie.
 */
export async function POST() {
  // To logout, we clear the cookie by setting its maxAge to 0
  const cookie = serialize('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return new NextResponse(JSON.stringify({ success: true, message: 'Logged out successfully.' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
