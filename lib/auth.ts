import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import { connectToDatabase } from './db';

interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateTokens(payload: Omit<TokenPayload, 'iat' | 'exp'>) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

export async function verifyToken(
  request: NextRequest
): Promise<TokenPayload | null> {
  try {
    // FIX: Get the cookie store directly from the incoming request object.
    // This is the correct pattern for Route Handlers and Middleware.
    const cookieStore = request.cookies;
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(decoded.userId),
      isActive: true,
    });

    if (!user) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function createSession(
  userId: string,
  token: string,
  refreshToken: string
) {
  const db = await connectToDatabase();

  const session = {
    userId,
    token,
    refreshToken,
    isActive: true,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('sessions').insertOne(session);
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  const db = await connectToDatabase();

  await db.collection('sessions').updateMany(
    { userId },
    {
      $set: {
        isActive: false,
        invalidatedAt: new Date(),
      },
    }
  );
}
