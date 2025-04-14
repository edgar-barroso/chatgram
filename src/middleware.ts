import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export const publicRoutes = ['/login', '/register']

const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname)
  const isPublicApiRoute = publicApiRoutes.some(apiRoute => 
    pathname.startsWith(apiRoute)
  )
  
  const token = request.cookies.get('auth-token')?.value
  
  if (isPublicRoute || isPublicApiRoute) {
    if (isPublicRoute && token) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }
    return NextResponse.next()
  }
  
  if (!token) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    
    const userId = payload.userId as string

    const headers = new Headers(request.headers)
    headers.set('x-user-id', userId)

    const response = NextResponse.next({
      request: {
        headers,
      },
    })

    return response

  } catch (error) {
    console.error('Erro na verificação do token:', error)
    
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}