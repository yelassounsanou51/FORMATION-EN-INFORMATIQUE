import { NextResponse } from "next/server";

// Pourquoi un middleware plutôt qu'un CSP fixe dans next.config.js ?
// Next.js (App Router) injecte de petits scripts inline pour afficher le
// contenu progressivement (Suspense, streaming). Un CSP "script-src 'self'"
// fixe bloque silencieusement ces scripts : la page reste bloquée sur son
// état de chargement, sans erreur visible pour l'utilisateur.
//
// La solution correcte est un "nonce" : une clé aléatoire différente à
// chaque visite, qui autorise uniquement les scripts que Next.js a
// lui-même générés pour cette requête précise — jamais un script injecté
// par un attaquant.
export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: [
    // S'applique à toutes les pages, sauf les fichiers statiques internes
    // (images optimisées, favicon, assets compilés) qui n'en ont pas besoin.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
