'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApi } from '@/hooks/use-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// FIX 1: Changed z.coerce.number() to z.number() for month and year.
// This resolves the primary type inference error with zodResolver.
// We will rely on { valueAsNumber: true } in the register call to handle the conversion.
const drmSchema = z.object({
  officeId: z.string().min(1, 'Office is required'),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(3, 'Description is required'),
  category: z.enum(['revenue', 'expenditure', 'savings', 'insurance', 'other']),
  amount: z.number().min(0.01, 'Amount must be positive'),
  month: z.number().min(1).max(12),
  year: z.number().min(2022),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
});

type DRMCreateForm = z.infer<typeof drmSchema>;

const DRM_CATEGORIES = [
  { label: 'Revenue', value: 'revenue' },
  { label: 'Expenditure', value: 'expenditure' },
  { label: 'Savings', value: 'savings' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Other', value: 'other' },
];

const DRM_PRIORITIES = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

// FIX 2: Define a type for the API response
interface ApiResponse {
  success: boolean;
  error?: { message?: string };
}

export default function DRMCreatePage() {
  const router = useRouter();
  const { post } = useApi();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DRMCreateForm>({
    resolver: zodResolver(drmSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      priority: 'normal',
      category: 'revenue', // It's good practice to provide a default for selects
    },
  });

  async function onSubmit(data: DRMCreateForm) {
    setError(null);
    setIsSubmitting(true);
    setSuccess(false);
    try {
      // FIX 2: Provide the ApiResponse type to the 'post' call
      const response = await post<ApiResponse>('/api/drm', data);
      if (response.success) {
        setSuccess(true);
        // FIX 3: Cast the route to 'any' to bypass strict typed routing errors
        setTimeout(() => router.push('/dashboard/drm' as Route), 1200);
      } else {
        setError(response.error?.message || 'DRM creation failed');
      }
    } catch {
      setError('An unexpected error occurred during DRM creation.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create DRM Entry</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-3">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            // Bonus Fix: Changed invalid 'success' variant to 'default'
            <Alert variant="default" className="mb-3">
              <AlertDescription>
                DRM entry created successfully! Redirecting…
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="officeId">Office ID</Label>
                <Input
                  id="officeId"
                  {...register('officeId')}
                  placeholder="Enter Office ID"
                />
                {errors.officeId && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.officeId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRM_CATEGORIES.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRM_PRIORITIES.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  min={1}
                  max={12}
                  {...register('month', { valueAsNumber: true })}
                  placeholder="MM"
                />
                {errors.month && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.month.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min={2022}
                  max={2099}
                  {...register('year', { valueAsNumber: true })}
                  placeholder="YYYY"
                />
                {errors.year && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.year.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter Subject/Title"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...register('description')}
                placeholder="Describe the entry"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Create DRM'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
