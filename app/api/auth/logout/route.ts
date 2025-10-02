import { invalidateUserSessions, verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const tokenPayload = await verifyToken(request);

    if (tokenPayload) {
      await invalidateUserSessions(tokenPayload.userId);
    }

    const response = NextResponse.json({ success: true });

    // Clear cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);

    const response = NextResponse.json({ success: true }); // Always return success for logout
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
}
