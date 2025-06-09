import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '') ||
                new URL(request.url).searchParams.get('token'); // URL'den token'ı da kontrol et
  
  const path = request.nextUrl.pathname;
  console.log('Middleware checking path:', path, 'Token exists:', !!token);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/auth/callback/google'];
  
  // Dashboard sayfasına token ile erişime izin ver
  if (path === '/dashboard' && new URL(request.url).searchParams.get('token')) {
    console.log('Allowing access to dashboard with token in URL');
    return NextResponse.next();
  }
  
  if (publicRoutes.includes(path)) {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          // If user is already logged in, redirect to dashboard
          console.log('User already logged in, redirecting to dashboard');
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch {
        // Invalid token, continue to login page
        console.log('Invalid token, continuing to login page');
      }
    }
    return NextResponse.next();
  }

  // Protected routes - check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login page');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired, redirect to login
      console.log('Token expired, redirecting to login page');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  } catch {
    // Invalid token, redirect to login
    console.log('Invalid token, redirecting to login page');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};