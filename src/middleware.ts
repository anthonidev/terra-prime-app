import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === '/auth/login';
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (!isAuthPage && !isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      }
    }
  }
);
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (folder with images)
     * - public (folder with public assets)
     * - image extensions (png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|imgs/|register|auth/reset-password|data/terms.md|terms.md).*)'
  ]
};
