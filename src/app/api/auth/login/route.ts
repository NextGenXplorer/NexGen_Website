import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_PASSWORD || !JWT_SECRET) {
  throw new Error('Missing ADMIN_PASSWORD or JWT_SECRET from environment variables.');
}

/**
 * POST handler for admin login: validates a password and, on success, issues a JWT in an httpOnly cookie.
 *
 * Accepts a JSON body with a `password` property. If the password matches the server's ADMIN_PASSWORD,
 * returns 200 with a Set-Cookie header containing a JWT (`admin_session`) that expires in 1 day. If the
 * password is incorrect, returns 401 with `{ success: false, message: 'Invalid password.' }`. On unexpected
 * errors, returns 500 with a generic error message.
 *
 * @param request - Incoming Request whose JSON body must include `{ password: string }`.
 * @returns A NextResponse with status 200 (successful login and Set-Cookie), 401 (invalid password), or 500 (internal error).
 */
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Create JWT
      const token = jwt.sign({ isAdmin: true }, JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
      });

      // Serialize the cookie
      const cookie = serialize('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      // Set the cookie in the response header
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      });
    } else {
      return new NextResponse(JSON.stringify({ success: false, message: 'Invalid password.' }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse(JSON.stringify({ success: false, message: 'An internal server error occurred.' }), {
      status: 500,
    });
  }
}
