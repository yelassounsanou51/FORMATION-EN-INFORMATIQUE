import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Route PUBLIQUE (aucune session admin requise). Le numéro de téléphone
// utilisé à l'inscription suffit désormais à retrouver son inscription — le
// numéro de suivi reste accepté en complément si on le connaît, pour
// affiner la recherche, mais n'est plus obligatoire (plus simple à l'usage).
//
// Compromis assumé : un numéro de téléphone est moins facile à deviner en
// masse qu'un identifiant séquentiel, et la route reste limitée en débit
// par IP — mais quelqu'un qui connaît déjà le numéro d'une personne précise
// peut voir son inscription. C'est un choix délibéré de simplicité plutôt
// que d'anonymat total, adapté à une petite formation locale.
export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = await checkRateLimit(`suivi:${ip}`, {
      maxAttempts: 10,
      windowSeconds: 15 * 60,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
        { status: 429 }
      );
    }

    const { id, telephone } = await request.json();

    if (!telephone?.trim()) {
      return NextResponse.json({ error: "Le numéro de téléphone est requis." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let query = supabase.from("inscriptions").select("*").eq("telephone", telephone.trim());
    if (id?.trim()) {
      query = query.eq("id", id.trim());
    }

    const { data, error } = await query.order("date_inscription", { ascending: false });

    if (error) {
      console.error("Erreur Supabase (suivi):", error);
      return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Aucune inscription ne correspond à ces informations." },
        { status: 404 }
      );
    }

    // Toujours un tableau : une seule inscription la plupart du temps, mais
    // plusieurs si le même numéro a servi à inscrire plusieurs personnes
    // (ex: un parent inscrivant sa famille avec son propre téléphone).
    return NextResponse.json({ records: data });
  } catch (err) {
    console.error("Erreur API suivi (POST):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
