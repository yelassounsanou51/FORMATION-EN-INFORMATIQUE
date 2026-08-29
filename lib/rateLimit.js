import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Limiteur de débit simple, stocké dans Supabase (fonctionne sur un hébergement
// serverless comme Vercel, où la mémoire du processus n'est pas partagée entre
// les requêtes). Une ligne par clé (ex: "admin-login:1.2.3.4"), avec un compteur
// et l'heure de la première tentative dans la fenêtre en cours.
//
// Utilisation :
//   const { allowed, retryAfterSeconds } = await checkRateLimit(`inscription:${ip}`, {
//     maxAttempts: 5,
//     windowSeconds: 900,
//   });

export async function checkRateLimit(key, { maxAttempts, windowSeconds }) {
  const supabase = getSupabaseAdmin();
  const now = new Date();

  const { data: existing } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (!existing) {
    await supabase.from("rate_limits").insert({ key, count: 1, window_start: now.toISOString() });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  const windowStart = new Date(existing.window_start);
  const elapsedSeconds = (now.getTime() - windowStart.getTime()) / 1000;

  if (elapsedSeconds > windowSeconds) {
    // La fenêtre précédente est expirée : on repart à zéro.
    await supabase
      .from("rate_limits")
      .update({ count: 1, window_start: now.toISOString() })
      .eq("key", key);
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (existing.count >= maxAttempts) {
    const retryAfterSeconds = Math.ceil(windowSeconds - elapsedSeconds);
    return { allowed: false, retryAfterSeconds };
  }

  await supabase
    .from("rate_limits")
    .update({ count: existing.count + 1 })
    .eq("key", key);

  return { allowed: true, remaining: maxAttempts - existing.count - 1 };
}

// Récupère une adresse IP "raisonnable" côté serveur à partir des en-têtes
// habituels sur Vercel. Ce n'est jamais infalsifiable à 100 %, mais c'est
// suffisant pour freiner un abus automatisé basique.
export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
