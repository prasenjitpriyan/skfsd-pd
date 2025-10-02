'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useApi } from '@/hooks/use-api';
import { Report } from '@/types/index';
// FIX 1: Import useCallback
import { useCallback, useEffect, useState } from 'react';

interface ReportsResponse {
  success: boolean;
  data: Report[];
  error?: { message?: string };
}

// FIX 2: Define a specific type for the export API response
interface ExportApiResponse {
  success: boolean;
  data?: { url?: string };
  error?: { message?: string };
}

export default function ReportsExportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { get, post } = useApi();

  // FIX 1: Wrap fetchReports in useCallback to create a stable function reference
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<ReportsResponse>('/api/reports');
      if (res.success && res.data) {
        setReports(res.data);
      } else {
        setError(res.error?.message || 'Failed to load reports');
      }
    } catch {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [get]); // 'get' from useApi is the dependency for this function

  // FIX 1: Add the stable fetchReports function to the dependency array
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  }

  async function exportSelected() {
    if (selectedIds.size === 0) {
      setError('Please select at least one report to export.');
      return;
    }
    setError(null);
    setSuccess(false);
    setExporting(true);

    try {
      // FIX 2: Provide the ExportApiResponse type to the 'post' call
      const res = await post<ExportApiResponse>('/api/reports/export', {
        reportIds: Array.from(selectedIds),
      });
      if (res.success) {
        setSuccess(true);
        // Open or download the report, assuming API returns a URL
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
        }
      } else {
        setError(res.error?.message || 'Failed to export reports');
      }
    } catch {
      setError('An unexpected error occurred during export.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            // Bonus Fix: Changed invalid 'success' variant to 'default'
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                Reports exported successfully.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    No reports available.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {/* Bonus Fix: Use onCheckedChange for shadcn/ui Checkbox */}
                      <Checkbox
                        id={`report-${report.id}`}
                        checked={selectedIds.has(report.id)}
                        onCheckedChange={() => toggleSelect(report.id)}
                      />
                    </TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <Button
              onClick={exportSelected}
              disabled={exporting || selectedIds.size === 0}
            >
              {exporting
                ? 'Exporting...'
                : `Export Selected (${selectedIds.size})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
