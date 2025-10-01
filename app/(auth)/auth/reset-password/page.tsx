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
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState as useReactState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [showPassword, setShowPassword] = useReactState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useReactState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing token');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Password reset failed');
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Password reset failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto w-full">
        <CardHeader>
          <CardTitle>Password Reset Successful</CardTitle>
          <CardDescription>
            You can now login with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/login">
            <a>Go to Login</a>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 relative">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              className="pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
