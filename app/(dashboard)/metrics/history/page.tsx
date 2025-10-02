'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useApi } from '@/hooks/use-api';
import { formatDate } from '@/lib/utils';
import { DailyMetric } from '@/types/metrics';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface MetricsHistoryResponse {
  success: boolean;
  data: DailyMetric[];
  error?: { message?: string };
}

export default function MetricsHistoryPage() {
  const { get } = useApi();
  const router = useRouter();
  const [history, setHistory] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<MetricsHistoryResponse>(
        '/api/metrics/history'
      );
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        setError(response.error?.message || 'Failed to load metrics history');
      }
    } catch {
      setError('Failed to load metrics history');
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  function handleDetails(id: string) {
    router.push(`/dashboard/metrics/history/${id}` as Route);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Metrics Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-destructive">{error}</div>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Letters</TableHead>
                <TableHead>Parcels</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    No history found.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date, 'date-only')}</TableCell>
                    <TableCell>
                      {/* FIX 1: Replaced invalid 'success' variant with 'default' */}
                      <Badge variant={entry.isLocked ? 'default' : 'outline'}>
                        {entry.isLocked ? 'Submitted' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.metrics.lettersDelivered}</TableCell>
                    <TableCell>{entry.metrics.parcelsDelivered}</TableCell>
                    <TableCell>
                      ₹{entry.metrics.revenueCollected?.toLocaleString() ?? '0'}
                    </TableCell>
                    <TableCell>{entry.createdBy}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleDetails(entry.id)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
