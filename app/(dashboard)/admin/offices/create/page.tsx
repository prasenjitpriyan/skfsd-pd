'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/use-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const officeSchema = z.object({
  name: z.string().min(3, 'Office name must be at least 3 characters'),
  code: z.string().min(2, 'Office code must be at least 2 characters'),
  address: z.object({
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(5, 'Pincode must be at least 5 characters'),
  }),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  metadata: z.object({
    establishedDate: z.string().optional(),
  }),
});

type OfficeFormData = z.infer<typeof officeSchema>;

interface ApiResponse {
  success: boolean;
  error?: { message?: string };
}

export default function CreateOfficePage() {
  const router = useRouter();
  const { post } = useApi();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfficeFormData>({
    resolver: zodResolver(officeSchema),
  });

  const onSubmit = async (data: OfficeFormData) => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        metadata: {
          establishedDate: data.metadata?.establishedDate
            ? new Date(data.metadata.establishedDate)
            : undefined,
        },
      };

      const response = await post<ApiResponse>(
        '/api/dashboard/offices',
        payload
      );
      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard/offices' as Route), 1500);
      } else {
        setError(response.error?.message || 'Failed to create office');
      }
    } catch (err) {
      console.error('Failed to create office:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Office</CardTitle>
          <p className="text-muted-foreground">
            Fill in the details to add a new office
          </p>
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
                Office created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Office Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="code">Office Code</Label>
                <Input id="code" {...register('code')} />
                {errors.code && (
                  <p className="text-sm text-destructive">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="street">Street</Label>
                <Input id="street" {...register('address.street')} />
                {errors.address?.street && (
                  <p className="text-sm text-destructive">
                    {errors.address.street.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('address.city')} />
                {errors.address?.city && (
                  <p className="text-sm text-destructive">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('address.state')} />
                {errors.address?.state && (
                  <p className="text-sm text-destructive">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" {...register('address.pincode')} />
                {errors.address?.pincode && (
                  <p className="text-sm text-destructive">
                    {errors.address.pincode.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" {...register('phone')} />
              </div>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="establishedDate">
                  Established Date (optional)
                </Label>
                <Input
                  id="establishedDate"
                  type="date"
                  {...register('metadata.establishedDate')}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Office'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
