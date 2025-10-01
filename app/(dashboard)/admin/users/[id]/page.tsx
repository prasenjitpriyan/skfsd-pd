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
import { User, UserRole } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
// FIX 2: Import useCallback
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name too short'),
  lastName: z.string().min(2, 'Last name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  isActive: z.boolean(),
});

type UserForm = z.infer<typeof userSchema>;

const availableRoles: UserRole['role'][] = [
  'Admin',
  'Supervisor',
  'OfficeUser',
  'DeliveryCenterUser',
];

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { get, put } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const fetchUser = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await get<{
        success: boolean;
        data: User;
        error?: { message?: string };
      }>(`/admin/users/${id}`);
      if (res.success && res.data) {
        setUser(res.data);
        const { firstName, lastName, email, phone, roles, isActive } = res.data;
        setValue('firstName', firstName);
        setValue('lastName', lastName);
        setValue('email', email);
        setValue('phone', phone || '');
        setValue(
          'roles',
          roles.map((r) => r.role)
        );
        setValue('isActive', isActive);
      } else {
        setError(res.error?.message || 'Failed to load user');
      }
    } catch {
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [id, get, setValue]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const onSubmit = async (data: UserForm) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await put<{
        success: boolean;
        data: User;
        error?: { message?: string };
      }>(`/admin/users/${id}`, data);

      if (res.success && res.data) {
        setUser(res.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error?.message || 'Failed to update user');
      }
    } catch {
      setError('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-4">Loading user data...</p>;
  }

  if (error && !user) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>
            Modify details and roles for {user?.firstName} {user?.lastName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label>Roles</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {/* FIX 1: All these errors are now fixed because 'role' is a string */}
                {availableRoles.map((role) => (
                  <label
                    key={role}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={role}
                      checked={watch('roles')?.includes(role)}
                      onChange={(e) => {
                        const currentRoles = watch('roles') || [];
                        if (e.target.checked) {
                          setValue('roles', [...currentRoles, role]);
                        } else {
                          setValue(
                            'roles',
                            currentRoles.filter((r) => r !== role)
                          );
                        }
                      }}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
              {errors.roles && (
                <p className="text-destructive text-sm mt-1">
                  {errors.roles.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="form-checkbox h-4 w-4"
              />
              <Label htmlFor="isActive">User is Active</Label>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              // FIX 3: Changed variant from "success" to "default"
              <Alert variant="default">
                <AlertDescription>User updated successfully!</AlertDescription>
              </Alert>
            )}
            <div className="flex space-x-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
