import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Lista de rotas que exigem login
  const rotasProtegidas = ['/usuarios', '/estoque', '/dashboard']

  const path = request.nextUrl.pathname

  // Verifica se a rota atual começa com alguma das rotas protegidas
  const ehRotaProtegida = rotasProtegidas.some(rota => path.startsWith(rota))

  if (ehRotaProtegida && !token) {
    // Se não está logado, manda para a tela de login (raiz '/')
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Adicionamos as novas rotas no matcher para o Next.js observar
  matcher: ['/usuarios/:path*', '/estoque/:path*', '/dashboard/:path*'],
}