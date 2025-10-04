import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/context/auth-provider';
import { ThemeProvider } from '@/context/theme-provider';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SKFSD Portal - South Kolkata First Sub Division',
    template: '%s | SKFSD Portal',
  },
  description:
    'Official portal for South Kolkata First Sub Division postal office management system',
  keywords: [
    'SKFSD',
    'South Kolkata',
    'Postal Office',
    'India Post',
    'Government Portal',
    'Document Management',
    'Daily Metrics',
  ],
  authors: [
    {
      name: 'SKFSD IT Team',
      url: 'https://skfsd.gov.in',
    },
  ],
  creator: 'SKFSD IT Department',
  publisher: 'India Post - Department of Posts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://skfsd.gov.in',
    siteName: 'SKFSD Portal',
    title: 'SKFSD Portal - South Kolkata First Sub Division',
    description:
      'Official portal for South Kolkata First Sub Division postal office management',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SKFSD Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IndiaPostOffice',
    creator: '@SKFSDOfficial',
    title: 'SKFSD Portal',
    description:
      'Official portal for South Kolkata First Sub Division postal office management',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
