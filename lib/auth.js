import crypto from "crypto";

const SESSION_COOKIE = "sahy_admin_session";
const SESSION_DURATION_SECONDS = 4 * 60 * 60; // 4 heures

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET n'est pas défini dans les variables d'environnement.");
  }
  return secret;
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

// Compare deux chaînes en temps constant, pour éviter qu'un attaquant ne
// devine le code admin caractère par caractère en mesurant le temps de réponse.
export function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // On compare quand même avec un buffer de même taille pour ne pas
    // révéler la longueur via le temps d'exécution.
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Crée un jeton de session signé (HMAC-SHA256), du type : "payload.signature".
// Pas besoin d'une base de données de sessions : la signature garantit que le
// jeton n'a pas été fabriqué ou modifié par le navigateur.
export function createSessionToken() {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_DURATION_SECONDS * 1000 });
  const payloadB64 = base64url(payload);
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payloadB64, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");

  if (!safeCompare(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function isAdminRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export const ADMIN_SESSION_COOKIE_NAME = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
