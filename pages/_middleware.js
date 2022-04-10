import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Token will exists if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })
  const { pathname } = req.nextUrl
  // Allow the request if the following is true
  // 1. Its a request for next-auth session & provider fetching
  // 2. Token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  if (!token && pathname !== '/login') {
    return NextResponse.rewrite(new URL('/login', req.url))
  }
}
