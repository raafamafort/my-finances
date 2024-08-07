import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAuthenticated(request: NextRequest): boolean {
  const sessionToken = request.cookies.get('next-auth.my-finance-token');
  return Boolean(sessionToken);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/resume', '/income', '/expense'];
  const publicRoutes = ['/sign-in', '/sign-up', '/'];

  if (protectedRoutes.includes(pathname)) {
    if (!isAuthenticated(request)) {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (publicRoutes.includes(pathname)) {
    if (isAuthenticated(request)) {
      const resumeUrl = new URL('/resume', request.url);
      return NextResponse.redirect(resumeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
