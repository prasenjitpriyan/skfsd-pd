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
import { Office } from '@/types/office';
import { useCallback, useEffect, useState } from 'react';

export default function OfficesPage() {
  const { get } = useApi();
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<{
        success: boolean;
        data: Office[];
        error?: { message?: string };
      }>('/api/dashboard/offices');

      if (response.success && response.data) {
        setOffices(response.data);
      } else {
        setError(response.error?.message || 'Failed to load offices');
      }
    } catch {
      setError('Failed to load offices');
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Offices</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-destructive">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Established</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : offices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    No offices found.
                  </TableCell>
                </TableRow>
              ) : (
                offices.map((office) => (
                  <TableRow key={office.id}>
                    <TableCell>{office.name}</TableCell>
                    <TableCell>{office.code}</TableCell>
                    <TableCell>
                      {office.address.street}, {office.address.city},{' '}
                      {office.address.state} - {office.address.pincode}
                    </TableCell>
                    <TableCell>
                      <div>{office.phone}</div>
                      <div>{office.email}</div>
                    </TableCell>
                    <TableCell>
                      {formatDate(office.metadata.establishedDate, 'date-only')}
                    </TableCell>
                    {/* FIX 1: Use office.isActive for status, as officerInCharge does not exist on the type. */}
                    <TableCell>
                      {office.isActive ? 'Active' : 'Inactive'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={fetchOffices} disabled={loading}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
