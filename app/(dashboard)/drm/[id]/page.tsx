'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useParams, useRouter } from 'next/navigation';
// FIX 4: Import useCallback
import { useCallback, useEffect, useState } from 'react';

interface DRMEntryResponse {
  success: boolean;
  data: DRMEntry;
  error?: { message?: string };
}

export default function DRMEntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { get } = useApi();

  const [entry, setEntry] = useState<DRMEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await get<DRMEntryResponse>(`/api/drm/${id}`);
      if (response.success && response.data) {
        setEntry(response.data);
      } else {
        setError(response.error?.message || 'Failed to load DRM entry');
      }
    } catch {
      setError('Failed to load DRM entry');
    } finally {
      setLoading(false);
    }
  }, [id, get]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading entry…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p>Entry not found.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>
            DRM #{entry.entryNumber}{' '}
            <Badge
              variant={
                entry.status === 'Finalized'
                  ? 'default'
                  : entry.status === 'Rejected'
                  ? 'destructive'
                  : entry.status === 'Submitted'
                  ? 'outline'
                  : 'secondary'
              }
              className="ml-2"
            >
              {entry.status}
            </Badge>
          </CardTitle>
          <CardDescription className="mt-1">{entry.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>Office:</strong> {entry.officeName || entry.officeId}
            <br />
            <strong>Category:</strong> {entry.category}
            <br />
            <strong>Amount:</strong> ₹{entry.amount.toLocaleString()}
            <br />
            <strong>Month:</strong> {entry.month} / <strong>Year:</strong>{' '}
            {entry.year}
            <br />
            <strong>Priority:</strong>{' '}
            <Badge
              variant={
                entry.metadata?.priority === 'urgent'
                  ? 'destructive'
                  : // FIX 1: Replaced 'warning' with 'outline'
                  entry.metadata?.priority === 'high'
                  ? 'outline'
                  : 'secondary'
              }
            >
              {entry.metadata?.priority || 'normal'}
            </Badge>
            <br />
            <strong>Description:</strong>
            <p className="text-muted-foreground mt-1 mb-4">
              {entry.description}
            </p>
          </div>

          <div className="mb-4">
            <strong>Workflow:</strong>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Created</TableCell>
                  <TableCell>{entry.workflow.createdBy}</TableCell>
                  <TableCell>
                    {formatDate(entry.workflow.createdAt, 'short')}
                  </TableCell>
                  <TableCell />
                </TableRow>
                {entry.workflow.submittedAt && (
                  <TableRow>
                    <TableCell>Submitted</TableCell>
                    <TableCell>{entry.workflow.submittedBy || '-'}</TableCell>
                    <TableCell>
                      {formatDate(entry.workflow.submittedAt, 'short')}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
                {entry.workflow.scrutinizedAt && (
                  <TableRow>
                    <TableCell>Scrutinized</TableCell>
                    <TableCell>{entry.workflow.scrutinizedBy || '-'}</TableCell>
                    <TableCell>
                      {formatDate(entry.workflow.scrutinizedAt, 'short')}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
                {entry.workflow.finalizedAt && (
                  <TableRow>
                    <TableCell>Finalized</TableCell>
                    <TableCell>{entry.workflow.finalizedBy || '-'}</TableCell>
                    <TableCell>
                      {formatDate(entry.workflow.finalizedAt, 'short')}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
                {entry.workflow.rejectedAt && (
                  <TableRow>
                    <TableCell>Rejected</TableCell>
                    <TableCell>{entry.workflow.rejectedBy || '-'}</TableCell>
                    <TableCell>
                      {formatDate(entry.workflow.rejectedAt, 'short')}
                    </TableCell>
                    <TableCell>
                      {entry.workflow.rejectionReason || '-'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {entry.comments && entry.comments.length > 0 && (
            <div className="mb-4">
              <strong>Comments:</strong>
              <ul className="pl-4 mt-2 text-muted-foreground list-disc">
                {entry.comments.map((comment, index) => (
                  <li key={index}>
                    <span className="font-medium">{comment.userId}:</span>{' '}
                    {comment.comment}{' '}
                    <span className="text-xs text-gray-400">
                      ({formatDate(comment.timestamp, 'short')})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button className="mt-3" onClick={() => router.back()}>
            Back to List
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
