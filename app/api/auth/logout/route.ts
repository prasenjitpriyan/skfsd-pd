// FIX: Import the Node.js-specific function from lib/auth.ts
import { invalidateUserSessions } from '@/lib/auth';
// FIX: Import the Edge-safe verification function from lib/edge-auth.ts
import { verifyAuth } from '@/lib/edge-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // FIX: Call the correct function, which is now 'verifyAuth'.
    // This function is safe to use in Node.js routes as well.
    const tokenPayload = await verifyAuth(request);

    if (tokenPayload) {
      // If the token was valid, invalidate all sessions for that user.
      await invalidateUserSessions(tokenPayload.userId);
    }

    // Always respond with success and clear cookies, regardless of whether a token was present.
    // This prevents revealing whether a user was logged in or not.
    const response = NextResponse.json({ success: true });

    // Clear cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);

    // In case of an unexpected error, still attempt to clear cookies and return a success response.
    const response = NextResponse.json({ success: true });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
}
