import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

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
