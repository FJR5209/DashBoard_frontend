import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token'); // Obtém o token do cookie

  // Redireciona para /login se o usuário não tiver um token válido
  if (!token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Permite o acesso à página de login sem redirecionamento
  if (!token && request.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  // Se o usuário estiver autenticado, permite o acesso a outras páginas
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/protected-route*'], // Aplica o middleware nas rotas definidas
};
