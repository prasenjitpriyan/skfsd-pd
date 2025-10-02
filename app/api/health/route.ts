import { connectToDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectToDatabase();
    await db.admin().ping();

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.APP_VERSION || '1.0.0',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: 'Database connection failed',
      },
      { status: 503 }
    );
  }
}
