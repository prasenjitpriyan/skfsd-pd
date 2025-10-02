import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import { connectToDatabase } from './db';
import { verifyAuth } from './edge-auth';
import { signToken, TokenPayload } from './jwt';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function generateTokens(payload: TokenPayload) {
  const accessToken = await signToken(payload);
  const refreshToken = await signToken(payload, true);
  return { accessToken, refreshToken };
}

// This function is for NODE.JS RUNTIME ONLY (e.g., API Route Handlers)
// It first verifies the token, then checks the database.
export async function verifyTokenAndGetUser(
  request: NextRequest
): Promise<TokenPayload | null> {
  // Step 1: Perform Edge-safe verification first
  const decoded = await verifyAuth(request);

  if (!decoded) {
    return null;
  }

  // Step 2: Perform Node.js-only database check
  try {
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
    console.error('Database check failed during token verification:', error);
    return null;
  }
}

// FIX: Implemented the createSession function
export async function createSession(
  userId: string,
  token: string,
  refreshToken: string
) {
  const db = await connectToDatabase();

  const session = {
    userId: new ObjectId(userId), // Store as ObjectId for better indexing
    token, // The access token
    refreshToken,
    isActive: true,
    // The session expires when the access token does, useful for cleanup
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('sessions').insertOne(session);
}

// FIX: Implemented the invalidateUserSessions function
export async function invalidateUserSessions(userId: string): Promise<void> {
  const db = await connectToDatabase();

  // Find all active sessions for the user and mark them as inactive
  await db.collection('sessions').updateMany(
    { userId: new ObjectId(userId), isActive: true },
    {
      $set: {
        isActive: false,
        invalidatedAt: new Date(),
      },
    }
  );
}
