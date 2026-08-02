import { NextResponse } from "next/server";

const COOKIE_NAME = "achadivou_session";

// Roda no Edge Runtime: aqui só verificamos se o cookie de sessão existe.
// A validação criptográfica completa do token acontece nas rotas de API (Node runtime),
// então mesmo que alguém forje o cookie, nenhuma ação/admin de verdade funciona sem um
// token válido.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
