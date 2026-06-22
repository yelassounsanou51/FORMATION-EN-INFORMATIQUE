import { createClient } from "@supabase/supabase-js";

// Clé publique : peut être exposée au navigateur. Grâce aux règles RLS
// définies dans supabase_setup.sql, cette clé ne permet QUE d'insérer
// de nouvelles inscriptions — pas de lire ou modifier les données existantes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);
