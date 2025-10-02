'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/use-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const targetSchema = z.object({
  financialYear: z.number().min(2023).max(2100),
  monthlyTargets: z.record(
    z.string(),
    z.object({
      lettersDelivered: z.number().min(0),
      parcelsDelivered: z.number().min(0),
      revenueCollected: z.number().min(0),
    })
  ),
});

type MonthlyTarget = {
  lettersDelivered: number;
  parcelsDelivered: number;
  revenueCollected: number;
};

type TargetForm = {
  financialYear: number;
  monthlyTargets: Record<string, MonthlyTarget>;
};

const months = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

interface ApiResponse {
  success: boolean;
  data?: TargetForm;
  error?: { message?: string };
}

export default function TargetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { get, put } = useApi();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TargetForm>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      financialYear: new Date().getFullYear(),
      monthlyTargets: months.reduce((acc, m) => {
        acc[m.value] = {
          lettersDelivered: 0,
          parcelsDelivered: 0,
          revenueCollected: 0,
        };
        return acc;
      }, {} as Record<string, MonthlyTarget>),
    },
  });

  const loadTarget = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<ApiResponse>(`/target/${id}`);
      if (res.success && res.data) {
        setValue('financialYear', res.data.financialYear);
        Object.entries(res.data.monthlyTargets).forEach(([month, data]) => {
          setValue(`monthlyTargets.${month}`, data);
        });
      } else {
        setError(res.error?.message || 'Failed to load target data.');
      }
    } catch (err) {
      console.error('Failed to load target:', err);
      setError('An unexpected error occurred while loading the target.');
    } finally {
      setLoading(false);
    }
  }, [id, get, setValue]);

  useEffect(() => {
    if (id) loadTarget();
  }, [id, loadTarget]);

  async function onSubmit(data: TargetForm) {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await put<ApiResponse>(`/target/${id}`, data);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push('/targets' as Route), 1500);
      } else {
        setError(res.error?.message || 'Failed to save target data.');
      }
    } catch (err) {
      console.error('Failed to save target:', err);
      setError('An unexpected error occurred while saving the target.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Target for Year {new Date().getFullYear()}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default">
              <AlertDescription>Target saved successfully.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4">
              <Label htmlFor="financialYear">Financial Year</Label>
              <Input
                id="financialYear"
                type="number"
                {...register('financialYear', { valueAsNumber: true })}
                disabled={saving}
              />
              {errors.financialYear && (
                <p className="text-sm text-destructive mt-1">
                  {errors.financialYear.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {months.map((month) => (
                <div key={month.value} className="border p-4 rounded-lg">
                  <h4 className="mb-2 font-semibold">{month.label}</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`lettersDelivered_${month.value}`}>
                        Letters Delivered
                      </Label>
                      <Input
                        id={`lettersDelivered_${month.value}`}
                        type="number"
                        {...register(
                          `monthlyTargets.${month.value}.lettersDelivered`,
                          { valueAsNumber: true }
                        )}
                        disabled={saving}
                      />
                      {/* FIX: Use optional chaining to safely access nested error message */}
                      {errors.monthlyTargets?.[month.value]?.lettersDelivered
                        ?.message && (
                        <p className="text-sm text-destructive mt-1">
                          {
                            errors.monthlyTargets[month.value]?.lettersDelivered
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`parcelsDelivered_${month.value}`}>
                        Parcels Delivered
                      </Label>
                      <Input
                        id={`parcelsDelivered_${month.value}`}
                        type="number"
                        {...register(
                          `monthlyTargets.${month.value}.parcelsDelivered`,
                          { valueAsNumber: true }
                        )}
                        disabled={saving}
                      />
                      {/* FIX: Use optional chaining to safely access nested error message */}
                      {errors.monthlyTargets?.[month.value]?.parcelsDelivered
                        ?.message && (
                        <p className="text-sm text-destructive mt-1">
                          {
                            errors.monthlyTargets[month.value]?.parcelsDelivered
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`revenueCollected_${month.value}`}>
                        Revenue Collected (₹)
                      </Label>
                      <Input
                        id={`revenueCollected_${month.value}`}
                        type="number"
                        {...register(
                          `monthlyTargets.${month.value}.revenueCollected`,
                          { valueAsNumber: true }
                        )}
                        disabled={saving}
                      />
                      {/* FIX: Use optional chaining to safely access nested error message */}
                      {errors.monthlyTargets?.[month.value]?.revenueCollected
                        ?.message && (
                        <p className="text-sm text-destructive mt-1">
                          {
                            errors.monthlyTargets[month.value]?.revenueCollected
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Target'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
