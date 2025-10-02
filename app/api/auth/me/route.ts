import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = await verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
        },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    const user = await db
      .collection('users')
      .findOne(
        { _id: new ObjectId(tokenPayload.userId), isActive: true },
        { projection: { password: 0 } }
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: { ...user, id: user._id.toString() },
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
