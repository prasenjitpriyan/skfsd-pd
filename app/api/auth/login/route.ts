import { createSession, generateTokens, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User, UserRole } from '@/types/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

type UserInDb = Omit<User, 'id'> & {
  _id: ObjectId;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const db = await connectToDatabase();
    // Strongly type the collection for better type-safety
    const usersCollection = db.collection<UserInDb>('users');

    // Find the active user by email
    const user = await usersCollection.findOne(
      { email: email.toLowerCase(), isActive: true },
      {
        // Projection ensures we only fetch the fields we absolutely need for the login process
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

    // Check if user exists and if the provided password is correct
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

    // Prepare payload for JWT
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles as UserRole[], // Cast roles to the correct type
    };

    // Generate JWT access and refresh tokens
    const { accessToken, refreshToken } = await generateTokens(tokenPayload);

    // Create a session record in the database
    await createSession(user._id.toString(), accessToken, refreshToken);

    // Update the user's last login timestamp
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date() } }
    );

    // Prepare the user object for the API response, removing the password
    // and transforming _id to id.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, _id, ...userFields } = user;
    const userResponse = {
      ...userFields,
      id: _id.toString(),
    };

    const response = NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token: accessToken,
        refreshToken,
      },
    });

    // Set tokens in secure, HTTP-only cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
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
