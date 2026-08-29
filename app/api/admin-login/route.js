import { NextResponse } from "next/server";
import {
  safeCompare,
  createSessionToken,
  isAdminRequest,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Maximum 5 tentatives toutes les 15 minutes, par IP.
    const { allowed, retryAfterSeconds } = await checkRateLimit(`admin-login:${ip}`, {
      maxAttempts: 5,
      windowSeconds: 15 * 60,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
        { status: 429 }
      );
    }

    const { code } = await request.json();

    if (!process.env.ADMIN_CODE) {
      console.error("ADMIN_CODE n'est pas défini dans les variables d'environnement.");
      return NextResponse.json({ error: "Configuration serveur incomplète." }, { status: 500 });
    }

    if (!code || !safeCompare(code, process.env.ADMIN_CODE)) {
      return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch (err) {
    console.error("Erreur admin-login:", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

// Permet à la page /admin de savoir si une session valide existe déjà,
// sans jamais exposer le code lui-même.
export async function GET(request) {
  return NextResponse.json({ authed: isAdminRequest(request) });
}
