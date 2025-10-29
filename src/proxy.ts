import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get token from cookies or headers
  const accessToken = request.cookies.get('accessToken')?.value;

  // If accessing a public route
  if (isPublicRoute) {
    // If already authenticated and trying to access login, redirect to home
    if (accessToken && pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  // Note: Since we're using localStorage for tokens in the client,
  // we'll rely on client-side checks for now
  // This proxy primarily prevents direct URL access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
