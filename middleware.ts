import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/aprendiz', '/expert', '/cliente']
const protectedApiRoutes = ['/api/pagamento/criar', '/api/pagamento/status']
const publicApiRoutes = ['/api/pagamento/webhook']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Webhook is always public — skip auth entirely
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected page routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Protected API routes
  const isProtectedApi = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if ((isProtectedRoute || isProtectedApi) && !user) {
    if (isProtectedApi) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/entrar'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
