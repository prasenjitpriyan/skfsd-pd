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
import { AuditLog } from '@/types/audit';
import { useEffect, useState } from 'react';

interface AuditLogsResponse {
  success: boolean;
  data: {
    logs: AuditLog[];
    currentPage: number;
    totalPages: number;
  };
  error?: { message?: string };
}

export default function AdminAuditPage() {
  const { get, isLoading } = useApi();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async (page: number) => {
      setError(null);
      try {
        const response = await get<AuditLogsResponse>('/api/admin/audit', {
          params: { page, limit: 20 },
        });
        if (response.success && response.data) {
          setAuditLogs(response.data.logs);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        } else {
          setError(response.error?.message || 'Failed to load audit logs');
        }
      } catch {
        setError('Failed to load audit logs');
      }
    };
    fetchAuditLogs(currentPage);
  }, [get, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // FIX: Helper function to safely render values of any type
  const renderChangeValue = (value: unknown) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    // Stringify objects and arrays so they can be rendered
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    // Render primitive types as strings
    return String(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : auditLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.userEmail}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      {log.entityType} ({log.entityId})
                    </TableCell>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {/* FIX: Use the helper function to render change values */}
                      {log.changes?.map((change) => (
                        <div key={change.field}>
                          <strong>{change.field}:</strong>{' '}
                          {renderChangeValue(change.oldValue)} →{' '}
                          {renderChangeValue(change.newValue)}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between">
            <Button onClick={handlePrev} disabled={currentPage <= 1}>
              Previous
            </Button>
            <div className="flex items-center space-x-2">
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button onClick={handleNext} disabled={currentPage >= totalPages}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
