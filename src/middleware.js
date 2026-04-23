import { NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'

// This middleware protects all routes under /admin
export function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-admin routes and static files
  if (!pathname.startsWith('/admin') || 
      pathname.startsWith('/admin/login') ||
      pathname.includes('.') || // Skip static files
      pathname.startsWith('/_next') || // Skip Next.js internals
      pathname.startsWith('/api/auth')) { // Skip auth API routes
    return NextResponse.next()
  }

  try {
    // Get token from request
    const token = getTokenFromRequest(request)

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token
    const user = verifyToken(token)

    // Check if user has admin role
    if (user.role !== 'admin') {
      // Redirect to login with error
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(loginUrl)
    }

    // User is authenticated and has admin role, continue
    const response = NextResponse.next()

    // Add user info to headers for use in server components
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-username', user.username)
    response.headers.set('x-user-role', user.role)

    return response

  } catch (error) {
    console.error('Middleware authentication error:', error)

    // Redirect to login on any authentication error
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('error', 'invalid_token')
    return NextResponse.redirect(loginUrl)
  }
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
    '/admin/:path*',
  ],
}
