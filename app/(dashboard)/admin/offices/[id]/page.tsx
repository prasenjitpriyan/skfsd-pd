'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/use-api';
import { Office } from '@/types/office';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function OfficeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { get, put } = useApi();

  const [office, setOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [establishedDate, setEstablishedDate] = useState('');

  const fetchOffice = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await get<{
        success: boolean;
        data: Office;
        error?: { message?: string };
      }>(`/api/dashboard/offices/${id}`);

      if (response.success && response.data) {
        setOffice(response.data);
        setName(response.data.name);
        setCode(response.data.code);
        setStreet(response.data.address.street);
        setCity(response.data.address.city);
        setState(response.data.address.state);
        setPincode(response.data.address.pincode);
        setPhone(response.data.phone);
        setEmail(response.data.email);

        if (response.data.metadata?.establishedDate) {
          const date = new Date(response.data.metadata.establishedDate);
          setEstablishedDate(date.toISOString().split('T')[0]);
        }
      } else {
        setError(response.error?.message || 'Failed to load office details');
      }
    } catch {
      setError('Failed to load office details');
    } finally {
      setLoading(false);
    }
  }, [id, get]);

  useEffect(() => {
    fetchOffice();
  }, [fetchOffice]);

  async function handleSave() {
    if (!id || !office) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedOfficePayload = {
        name,
        address: {
          street,
          city,
          state,
          pincode,
        },
        phone,
        email,
        metadata: {
          ...office.metadata,
          establishedDate: new Date(establishedDate),
        },
      };

      const response = await put<{
        success: boolean;
        data: Office;
        error?: { message?: string };
      }>(`/api/dashboard/offices/${id}`, updatedOfficePayload);

      if (response.success && response.data) {
        setOffice(response.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error?.message || 'Failed to update office');
      }
    } catch {
      setError('Failed to update office');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading office details...</p>
      </div>
    );
  }

  if (error && !office) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Office Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Modify office information for &quot;{office?.name}&quot;
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Office Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="code">Office Code (Read-only)</Label>
              <Input
                id="code"
                value={code}
                disabled
                className="cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="establishedDate">Established Date</Label>
              <Input
                id="establishedDate"
                type="date"
                value={establishedDate}
                onChange={(e) => setEstablishedDate(e.target.value)}
              />
            </div>
            {/* FIX 1: Removed the input field for 'officerInCharge' */}
          </div>

          {success && (
            <p className="text-green-600">
              Office details updated successfully.
            </p>
          )}
          {error && <p className="text-destructive">{error}</p>}

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
