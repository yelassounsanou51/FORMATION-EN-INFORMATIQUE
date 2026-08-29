import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Route PUBLIQUE (aucune session admin requise), mais volontairement stricte :
// - elle exige le numéro de suivi ET le téléphone utilisé à l'inscription
//   (un attaquant ne peut plus se contenter de deviner l'ID) ;
// - elle est limitée en débit par IP, pour empêcher un script d'essayer
//   des milliers de combinaisons.
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

    if (!id?.trim() || !telephone?.trim()) {
      return NextResponse.json(
        { error: "Le numéro de suivi et le téléphone sont requis." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("inscriptions")
      .select("*")
      .eq("id", id.trim())
      .eq("telephone", telephone.trim())
      .maybeSingle();

    if (error) {
      console.error("Erreur Supabase (suivi):", error);
      return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
    }

    // Message volontairement générique : on ne précise jamais si c'est l'ID
    // ou le téléphone qui est incorrect, pour ne pas aider à deviner l'un
    // des deux par élimination.
    if (!data) {
      return NextResponse.json(
        { error: "Aucune inscription ne correspond à ces informations." },
        { status: 404 }
      );
    }

    return NextResponse.json({ record: data });
  } catch (err) {
    console.error("Erreur API suivi (POST):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
