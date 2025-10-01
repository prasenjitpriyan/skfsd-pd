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
import { UserRole } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// FIX 1: Removed Controller as it's no longer needed for roles
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// FIX 4: Made role names consistent
const userSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    employeeId: z.string().min(3, 'Employee ID must be at least 3 characters'),
    department: z.string().min(1, 'Department is required'),
    roles: z
      .array(
        z.enum(['Admin', 'Supervisor', 'OfficeUser', 'DeliveryCenterUser'])
      )
      .min(1, 'At least one role is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type CreateUserForm = z.infer<typeof userSchema>;

const roleOptions: UserRole['role'][] = [
  'Admin',
  'Supervisor',
  'OfficeUser',
  'DeliveryCenterUser',
];

// FIX 2: Define a type for the API response
interface ApiResponse {
  success: boolean;
  error?: { message?: string };
}

export default function CreateUserPage() {
  const router = useRouter();
  const { post } = useApi();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch, // Use watch to monitor the roles array
    setValue, // Use setValue to update the roles array
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      roles: [], // Initialize roles as an empty array
    },
  });

  async function onSubmit(data: CreateUserForm) {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    // FIX 3: Disable ESLint warning for this line as this is an intentional pattern
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data;

    try {
      // FIX 2: Provide the ApiResponse type to the 'post' call
      const response = await post<ApiResponse>('/api/admin/users', payload);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push('/admin/users' as Route), 1500);
      } else {
        setError(response.error?.message || 'Failed to create user');
      }
    } catch {
      setError('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>
            Fill in the details to create a new user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            // Bonus Fix: 'success' is not a default variant, 'default' is correct.
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                User created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" {...register('employeeId')} />
                {errors.employeeId && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...register('department')} />
                {errors.department && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.department.message}
                  </p>
                )}
              </div>
              {/* FIX 1: Replaced Select with a group of checkboxes for multi-selection */}
              <div className="md:col-span-2">
                <Label>Roles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {roleOptions.map((role) => (
                    <label
                      key={role}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={role}
                        checked={watch('roles').includes(role)}
                        onChange={(e) => {
                          const currentRoles = watch('roles');
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
                  <p className="text-sm text-destructive mt-1">
                    {errors.roles.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
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
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
