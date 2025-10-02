import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/health') ||
    pathname === '/' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
    const token = await verifyToken(request);

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          },
          { status: 401 }
        );
      } else {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
