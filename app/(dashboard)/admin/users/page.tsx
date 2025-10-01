'use client';

import { Badge } from '@/components/ui/badge';
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
import { User } from '@/types/user';
import { format } from 'date-fns';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    pageCount: number;
  };
  error?: {
    message: string;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { get } = useApi();

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await get<UsersResponse>(`/admin/users?page=${page}`);
        if (res.success) {
          setUsers(res.data.users);
          setPage(page);
          setPageCount(res.data.pageCount);
        } else {
          setError(res.error?.message ?? 'Failed to load users');
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('An unexpected error occurred while loading users.');
      } finally {
        setLoading(false);
      }
    },
    [get]
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  function handleEditUser(userId: string) {
    router.push(`/admin/users/${userId}` as Route);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles.map((r) => r.role).join(', ')}
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt
                        ? format(new Date(user.lastLoginAt), 'PPpp')
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleEditUser(user.id)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button disabled={page <= 1} onClick={() => fetchUsers(page - 1)}>
              Previous
            </Button>
            <span>
              Page {page} of {pageCount}
            </span>
            <Button
              disabled={page >= pageCount}
              onClick={() => fetchUsers(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
