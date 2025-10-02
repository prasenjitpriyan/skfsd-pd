'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/use-api';
import { zodResolver } from '@hookform/resolvers/zod';
// FIX 2: Import useCallback
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const targetSchema = z.object({
  financialYear: z.number().min(2023).max(2099),
  monthlyTargets: z.record(
    z.string(), // month keys e.g. '01', '02'
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

// Bonus: Define a clear type for API responses
interface ApiResponse {
  success: boolean;
  data?: TargetForm;
  error?: { message?: string };
}

const months = [
  { label: 'Jan', value: '01' },
  { label: 'Feb', value: '02' },
  { label: 'Mar', value: '03' },
  { label: 'Apr', value: '04' },
  { label: 'May', value: '05' },
  { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' },
  { label: 'Aug', value: '08' },
  { label: 'Sep', value: '09' },
  { label: 'Oct', value: '10' },
  { label: 'Nov', value: '11' },
  { label: 'Dec', value: '12' },
];

export default function TargetPage() {
  const { get, put } = useApi();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // FIX 1: Removed unused 'watch' variable
    setValue,
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

  // FIX 2: Wrap loadTarget in useCallback to create a stable function reference
  const loadTarget = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<ApiResponse>('/target/current');
      // Bonus: Improved response handling
      if (res.success && res.data) {
        if (res.data.financialYear)
          setValue('financialYear', res.data.financialYear);
        if (res.data.monthlyTargets) {
          Object.entries(res.data.monthlyTargets).forEach(([month, data]) => {
            setValue(`monthlyTargets.${month}`, data);
          });
        }
      } else {
        // Handle cases where API returns success: false but doesn't throw
        setError(res.error?.message || 'Failed to load current target');
      }
    } catch {
      setError('An unexpected error occurred while loading the target.');
    } finally {
      setLoading(false);
    }
  }, [get, setValue]);

  // FIX 2: Add the stable loadTarget function to the dependency array
  useEffect(() => {
    loadTarget();
  }, [loadTarget]);

  async function onSubmit(data: TargetForm) {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Bonus: Typed the put call for better safety
      const res = await put<ApiResponse>('/target', data);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error?.message || 'Failed to save targets');
      }
    } catch {
      setError('An unexpected error occurred while saving targets.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Monthly Targets</CardTitle>
          <CardDescription>
            Define your monthly targets for letters, parcels, and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            // Bonus: Changed invalid 'success' variant to 'default'
            <Alert variant="default" className="mb-4">
              <AlertDescription>Targets saved successfully.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {months.map(({ label, value }) => (
                <div key={value} className="border p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{label}</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`lettersDelivered_${value}`}>
                        Letters Delivered
                      </Label>
                      <Input
                        id={`lettersDelivered_${value}`}
                        type="number"
                        {...register(
                          `monthlyTargets.${value}.lettersDelivered`,
                          { valueAsNumber: true }
                        )}
                        disabled={saving}
                      />
                      {errors.monthlyTargets?.[value]?.lettersDelivered && (
                        <p className="text-sm text-destructive mt-1">
                          {
                            errors.monthlyTargets[value].lettersDelivered
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`parcelsDelivered_${value}`}>
                        Parcels Delivered
                      </Label>
                      <Input
                        id={`parcelsDelivered_${value}`}
                        type="number"
                        {...register(
                          `monthlyTargets.${value}.parcelsDelivered`,
                          { valueAsNumber: true }
                        )}
                        disabled={saving}
                      />
                      {errors.monthlyTargets?.[value]?.parcelsDelivered && (
                        <p className="text-sm text-destructive mt-1">
                          {
                            errors.monthlyTargets[value].parcelsDelivered
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`revenueCollected_${value}`}>
                        Revenue Collected (₹)
                      </Label>
                      <Input
                        id={`revenueCollected_${value}`}
                        type="number"
                        {...register(
                          `monthlyTargets.${value}.revenueCollected`,
                          { valueAsNumber: true }
                        )}
                        disabled={saving}
                      />
                      {errors.monthlyTargets?.[value]?.revenueCollected && (
                        <p className="text-sm text-destructive mt-1">
                          {
                            errors.monthlyTargets[value].revenueCollected
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button type="submit" disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save Targets'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
