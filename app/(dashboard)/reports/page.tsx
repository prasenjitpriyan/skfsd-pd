'use client';

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
import { useEffect, useState } from 'react';

interface Report {
  id: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  description?: string;
}

interface ReportsResponse {
  success: boolean;
  data: Report[];
  error?: { message?: string };
}

export default function ReportsPage() {
  const { get } = useApi();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchReports() {
    setLoading(true);
    setError(null);

    try {
      const response = await get<ReportsResponse>('/api/reports');
      if (response.success && response.data) {
        setReports(response.data);
      } else {
        setError(response.error?.message || 'Failed to load reports');
      }
    } catch {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-destructive">{error}</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.description || 'N/A'}</TableCell>
                    <TableCell>
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </TableCell>
                    <TableCell>
                      {formatDate(report.createdAt, 'short')}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/dashboard/reports/${report.id}`,
                            '_blank'
                          )
                        }
                      >
                        View
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
