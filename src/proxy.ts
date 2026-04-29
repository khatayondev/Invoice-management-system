import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const sessionCookie = request.cookies.get('session')?.value;
  let session = null;

  if (sessionCookie) {
    try {
      session = await decrypt(sessionCookie);
    } catch (err) {
      session = null;
    }
  }

  // Redirect to login if accessing a protected route without a session
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing a public auth route with a valid session
  if (session && isPublicRoute && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
