import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Tenta pegar o token dos cookies (LocalStorage não funciona no middleware)
  const token = request.cookies.get('token')?.value

  // Se o usuário tenta acessar /usuarios sem estar logado
  if (request.nextUrl.pathname.startsWith('/usuarios')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configura em quais caminhos o middleware deve agir
export const config = {
  matcher: ['/usuarios/:path*'],
}