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
import { DRMEntry } from '@/types/drm';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
// FIX 2: Import useCallback
import { useCallback, useEffect, useState } from 'react';

interface DRMReviewResponse {
  success: boolean;
  data: DRMEntry[];
  error?: { message?: string };
}

export default function DRMReviewPage() {
  const [entries, setEntries] = useState<DRMEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { get } = useApi();

  // FIX 2: Wrap fetchEntries in useCallback to create a stable function reference.
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<DRMReviewResponse>('/api/drm/review');
      if (response.success && response.data) {
        setEntries(response.data);
      } else {
        setError(response.error?.message || 'Failed to load DRM entries');
      }
    } catch {
      setError('Failed to load DRM entries');
    } finally {
      setLoading(false);
    }
  }, [get]); // 'get' from useApi is the dependency for this function

  // FIX 2: Add the stable fetchEntries function to the dependency array.
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  function handleReview(id: string) {
    router.push(`/dashboard/drm/review/${id}` as Route);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>DRM Entries For Review</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-destructive">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry #</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No DRM entries pending review.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.entryNumber}</TableCell>
                    <TableCell>{entry.officeName || entry.officeId}</TableCell>
                    <TableCell>{entry.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          entry.status === 'Submitted'
                            ? 'outline'
                            : // FIX 1: Replaced 'success' with 'default'
                            entry.status === 'Scrutinized'
                            ? 'default'
                            : entry.status === 'Rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{entry.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {formatDate(
                        entry.workflow.submittedAt ?? entry.createdAt,
                        'short'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleReview(entry.id)}>
                        Review
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
