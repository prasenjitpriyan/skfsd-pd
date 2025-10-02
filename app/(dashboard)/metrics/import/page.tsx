'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useRef, useState } from 'react';

interface ImportResponse {
  success: boolean;
  data?: {
    imported: number;
    errors?: Array<{ row: number; message: string }>;
    preview?: Array<Record<string, string | number>>;
  };
  error?: { message?: string };
}

export default function MetricsImportPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { post } = useApi();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<Array<
    Record<string, string | number>
  > | null>(null);
  const [importCount, setImportCount] = useState<number | null>(null);
  const [rowErrors, setRowErrors] = useState<Array<{
    row: number;
    message: string;
  }> | null>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!inputRef.current || !inputRef.current.files?.[0]) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    setPreview(null);
    setRowErrors(null);
    setImportCount(null);
    try {
      const file = inputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await post<ImportResponse>(
        '/api/metrics/import',
        formData
      );
      if (response.success && response.data) {
        setSuccess(true);
        setImportCount(response.data.imported);
        setPreview(response.data.preview || null);
        setRowErrors(response.data.errors || null);
      } else {
        setError(response.error?.message || 'Failed to import metrics.');
      }
    } catch {
      setError('Failed to import metrics.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Import Daily Metrics (CSV)</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>
                {importCount
                  ? `Import complete! ${importCount} entries processed.`
                  : 'File imported successfully.'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleImport} className="space-y-4">
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:font-semibold file:cursor-pointer"
              required
              disabled={uploading}
            />
            <div>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Import CSV'}
              </Button>
            </div>
          </form>

          {preview && preview.length > 0 && (
            <div className="my-6">
              <h3 className="font-semibold mb-2">Preview (first 5 rows):</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(preview[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.slice(0, 5).map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.values(row).map((val, j) => (
                        <TableCell key={j}>{String(val)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {rowErrors && rowErrors.length > 0 && (
            <div className="my-6">
              <h3 className="font-semibold text-destructive mb-1">
                Row Errors:
              </h3>
              <ul className="list-disc pl-6 text-sm text-destructive">
                {rowErrors.map((e) => (
                  <li key={e.row}>
                    Row {e.row}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 text-muted-foreground text-xs italic">
            Expected columns:{' '}
            <span className="font-mono">
              date, lettersDelivered, parcelsDelivered, speedPostItems,
              moneyOrders, revenueCollected, savingsAccounts, insurancePolicies
            </span>
            <br />
            <span>
              The CSV should have a header row and use either comma or tab as
              the separator.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
