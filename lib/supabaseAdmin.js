import { createClient } from "@supabase/supabase-js";

// Ce client utilise la clé "service role" : il ne doit JAMAIS être importé
// dans un composant ou fichier exécuté côté navigateur. Utilisé uniquement
// dans les routes API (app/api/.../route.js), qui s'exécutent sur le serveur.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Variables Supabase manquantes. Vérifie NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local"
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
