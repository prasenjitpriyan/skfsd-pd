import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  employeeId: z.string().min(3),
  phone: z.string().optional(),
  department: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData = registerSchema.parse(body);

    const db = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({
      $or: [
        { email: userData.email.toLowerCase() },
        { employeeId: userData.employeeId },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email or employee ID already exists',
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const newUser = {
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      isActive: false, // Requires admin approval
      emailVerified: false,
      twoFactorEnabled: false,
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
      roles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json({
      success: true,
      data: {
        userId: result.insertedId,
        message: 'Registration successful. Your account is pending approval.',
      },
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);

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
          message: 'An unexpected error occurred during registration.',
        },
      },
      { status: 500 }
    );
  }
}
