'use client';

import { BarChart } from '@/components/BarChart';
import { LineChart } from '@/components/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/hooks/use-api';
import { useCallback, useEffect, useState } from 'react';

interface AnalyticsData {
  dailyMetrics: {
    dates: string[];
    letters: number[];
    parcels: number[];
    revenue: number[];
  };
  topOffices: {
    id: string;
    name: string;
    revenue: number;
  }[];
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  error?: { message?: string };
}

export default function AnalyticsDashboard() {
  const { get } = useApi();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<AnalyticsResponse>('/api/analytics');
      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        setError(response.error?.message || 'Failed to load analytics');
      }
    } catch {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-destructive">{error}</p>}

          {loading && <p>Loading analytics data...</p>}

          {analytics && (
            <>
              <h3 className="mb-4 font-semibold">
                Daily Metrics (Last 30 Days)
              </h3>
              <LineChart
                data={{
                  labels: analytics.dailyMetrics.dates,
                  datasets: [
                    {
                      label: 'Letters Delivered',
                      data: analytics.dailyMetrics.letters,
                      borderColor: 'rgb(59 130 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                      yAxisID: 'y',
                    },
                    {
                      label: 'Parcels Delivered',
                      data: analytics.dailyMetrics.parcels,
                      borderColor: 'rgb(16 185 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.5)',
                      yAxisID: 'y',
                    },
                    {
                      label: 'Revenue (₹)',
                      data: analytics.dailyMetrics.revenue,
                      borderColor: 'rgb(220, 38, 38)',
                      backgroundColor: 'rgba(220, 38, 38, 0.5)',
                      yAxisID: 'y1', // Assign to the right axis
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  // FIX 1: Removed the invalid 'stacked: false' property.
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Count',
                      },
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: {
                        drawOnChartArea: false,
                      },
                      title: {
                        display: true,
                        text: 'Revenue (₹)',
                      },
                    },
                  },
                }}
              />
              <h3 className="mt-8 mb-4 font-semibold">
                Top 5 Offices by Revenue
              </h3>
              <BarChart
                data={{
                  labels: analytics.topOffices.map((o) => o.name),
                  datasets: [
                    {
                      label: 'Revenue (₹)',
                      data: analytics.topOffices.map((o) => o.revenue),
                      backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
