import { createSession, generateTokens, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const db = await connectToDatabase();

    // Find user
    const user = await db.collection('users').findOne(
      { email: email.toLowerCase(), isActive: true },
      {
        projection: {
          password: 1,
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          roles: 1,
          employeeId: 1,
        },
      }
    );

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };

    // FIX: Added 'await' because generateTokens is an async function and returns a Promise.
    const { accessToken, refreshToken } = await generateTokens(tokenPayload);

    // Create session
    await createSession(user._id.toString(), accessToken, refreshToken);

    // Update last login
    await db
      .collection('users')
      .updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userResponse } = user;

    const response = NextResponse.json({
      success: true,
      data: {
        user: { ...userResponse, id: user._id.toString() },
        token: accessToken,
        refreshToken,
      },
    });

    // Set HTTP-only cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred during login.',
        },
      },
      { status: 500 }
    );
  }
}
