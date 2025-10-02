import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = await verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get today's metrics
    const todayMetrics = await db.collection('dailymetrics').findOne({
      date: today,
      isLocked: false,
    });

    // Get yesterday's metrics for comparison
    const yesterdayMetrics = await db.collection('dailymetrics').findOne({
      date: yesterday,
    });

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const todayData = todayMetrics?.metrics || {
      lettersDelivered: 0,
      parcelsDelivered: 0,
      revenueCollected: 0,
    };

    const yesterdayData = yesterdayMetrics?.metrics || {
      lettersDelivered: 0,
      parcelsDelivered: 0,
      revenueCollected: 0,
    };

    // Get DRM entries stats
    const drmStats = await db
      .collection('drmentries')
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const drmEntries = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    drmStats.forEach((stat) => {
      drmEntries.total += stat.count;
      switch (stat._id) {
        case 'Submitted':
          drmEntries.pending += stat.count;
          break;
        case 'Finalized':
          drmEntries.approved += stat.count;
          break;
        case 'Rejected':
          drmEntries.rejected += stat.count;
          break;
      }
    });

    const stats = {
      todaysMetrics: {
        lettersDelivered: todayData.lettersDelivered,
        parcelsDelivered: todayData.parcelsDelivered,
        revenueCollected: todayData.revenueCollected,
        change: {
          letters: calculateChange(
            todayData.lettersDelivered,
            yesterdayData.lettersDelivered
          ),
          parcels: calculateChange(
            todayData.parcelsDelivered,
            yesterdayData.parcelsDelivered
          ),
          revenue: calculateChange(
            todayData.revenueCollected,
            yesterdayData.revenueCollected
          ),
        },
      },
      drmEntries,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch dashboard stats',
        },
      },
      { status: 500 }
    );
  }
}
