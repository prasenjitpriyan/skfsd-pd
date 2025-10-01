'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-provider';
import { useApi } from '@/hooks/use-api';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Settings {
  siteTitle: string;
  notificationEmail: string;
  enableNotifications: boolean;
}

export default function AdminSettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { get, put } = useApi();

  const [settings, setSettings] = useState<Settings>({
    siteTitle: '',
    notificationEmail: '',
    enableNotifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get<{
        success: boolean;
        data: Settings;
        error?: { message?: string };
      }>('/admin/settings');
      if (res.success && res.data) {
        setSettings(res.data);
      } else {
        setError(res.error?.message || 'Failed to load settings.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login' as Route);
      return;
    }
    if (!user.roles.some((role) => role.role === 'Admin')) {
      router.push('/dashboard' as Route);
      return;
    }
    fetchSettings();
  }, [user, router, fetchSettings]);

  async function saveSettings() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await put<{
        success: boolean;
        data: Settings;
        error?: { message?: string };
      }>('/admin/settings', settings);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error?.message || 'Failed to save settings.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  function handleChange<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }
  if (!user) {
    return <p>Loading...</p>;
  }
  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertDescription>Settings saved successfully!</AlertDescription>
            </Alert>
          )}
          <div className="space-y-6">
            <div>
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notificationEmail">Notification Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={settings.notificationEmail}
                onChange={(e) =>
                  handleChange('notificationEmail', e.target.value)
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="enableNotifications"
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  handleChange('enableNotifications', e.target.checked)
                }
                className="cursor-pointer"
              />
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="destructive" onClick={logout}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
