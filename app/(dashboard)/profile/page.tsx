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
import { useAuth } from '@/context/auth-provider';
import { useApi } from '@/hooks/use-api';
import { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
// FIX 2: Import useCallback
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

// FIX 1: Define a type for the API response
interface ApiResponse {
  success: boolean;
  data?: User;
  error?: { message?: string };
}

export default function MetricsProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { get, put } = useApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // FIX 2: Wrap fetchProfile in useCallback to create a stable function reference
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<ApiResponse>('/api/profile');
      if (res.success && res.data) {
        reset({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone || '',
        });
      } else {
        setError(res.error?.message || 'Failed to load profile');
      }
    } catch (err) {
      // FIX 3: Log the actual error for debugging
      console.error('Failed to fetch profile:', err);
      setError('An unexpected error occurred while loading your profile.');
    } finally {
      setLoading(false);
    }
  }, [get, reset]);

  // FIX 2 & 4: Handle dependencies and move side effects into useEffect
  useEffect(() => {
    if (!user) {
      // Move redirect side effect here
      router.push('/auth/login' as Route);
      return;
    }
    fetchProfile();
  }, [user, fetchProfile, router]);

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // FIX 1: Provide the ApiResponse type to the 'put' call
      const res = await put<ApiResponse>('/api/profile', data);
      if (res.success) {
        setSuccess(true);
        // Bonus: Reset form with new data from the API response instead of re-fetching
        if (res.data) {
          reset({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            phone: res.data.phone || '',
          });
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error?.message || 'Failed to update profile');
      }
    } catch (err) {
      // FIX 3: Log the actual error for debugging
      console.error('Failed to update profile:', err);
      setError('An unexpected error occurred while saving your profile.');
    } finally {
      setSaving(false);
    }
  };

  // Handle the initial loading state while the user is being checked
  if (loading || !user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            // FIX 4: Changed invalid 'success' variant to 'default'
            <Alert variant="default" className="mb-4">
              <AlertDescription>Profile updated successfully.</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email (Read-only)</Label>
              <Input id="email" type="email" {...register('email')} disabled />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  logout();
                  router.push('/' as Route);
                }}
              >
                Log out
              </Button>
              <Button type="submit" disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
