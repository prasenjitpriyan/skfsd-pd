// FIX: Import the correct, renamed function.
import { verifyTokenAndGetUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
// Note: You no longer need 'mongodb' or 'db' imports here

export async function GET(request: NextRequest) {
  try {
    // FIX: Call the correct function. It now returns the full user object or null.
    const user = await verifyTokenAndGetUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token, or user not found',
          },
        },
        { status: 401 }
      );
    }

    // FIX: The second database call is now completely removed.

    return NextResponse.json({
      success: true,
      data: {
        // The user object is already prepared
        user: user,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get user data' },
      },
      { status: 500 }
    );
  }
}
