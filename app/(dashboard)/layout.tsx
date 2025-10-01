import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Metadata, Route } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    template: '%s | SKFSD Dashboard',
    default: 'Dashboard',
  },
  description:
    'SKFSD Portal Dashboard - Manage daily metrics, DRM entries, and more',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication server-side
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken');

  if (!accessToken) {
    redirect('/auth/login' as Route);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
