'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';
import { Route } from 'next';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user.roles.some((role) => role.role === 'Admin')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">
          Access denied. You do not have admin permissions.
        </p>
      </div>
    );
  }

  const navItems = [
    { label: 'User Management', path: '/admin/users' },
    { label: 'Audit Logs', path: '/admin/audit' },
    { label: 'System Settings', path: '/admin/settings' },
    { label: 'Offices', path: '/dashboard/offices' },
    { label: 'Reports', path: '/admin/reports' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Welcome, {user.firstName}! Manage the SKFSD portal administration
            here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => router.push(item.path as Route)}
                className="w-full"
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="destructive" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
