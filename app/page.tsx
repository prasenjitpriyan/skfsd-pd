import { Metadata, Route } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'SKFSD Portal - Official portal for South Kolkata First Sub Division',
};

export default async function HomePage() {
  // Check if user is authenticated
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken');

  // Redirect to dashboard if authenticated, otherwise to login
  if (accessToken) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login' as Route);
  }
}
