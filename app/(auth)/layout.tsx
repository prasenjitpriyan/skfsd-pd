import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login to SKFSD Portal',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            SKFSD Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            South Kolkata First Sub Division
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
