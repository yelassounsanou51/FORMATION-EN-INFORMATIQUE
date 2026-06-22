import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function checkAdmin(request) {
  const adminCode = request.headers.get("x-admin-code");
  return adminCode && adminCode === process.env.ADMIN_CODE;
}

// Récupère UNE inscription par son id (utilisé par la page de reçu juste après
// l'inscription). Pas besoin d'être admin : l'id généré (IB-AAAAMMJJ-XXXX) agit
// comme un jeton d'accès non-devinable et cette route ne permet jamais de lister
// l'ensemble des inscriptions, seulement d'en récupérer une si on connaît déjà l'id.
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("inscriptions").select("*").eq("id", id).single();

    if (error || !data) {
      return NextResponse.json({ error: "Inscription non trouvée." }, { status: 404 });
    }

    return NextResponse.json({ record: data });
  } catch (err) {
    console.error("Erreur API inscriptions/[id] (GET):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

// Met à jour le statut d'une inscription (ex: "confirmé")
export async function PATCH(request, { params }) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { statut } = body;

    if (!["à vérifier", "confirmé"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("inscriptions")
      .update({ statut })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase (update):", error);
      return NextResponse.json({ error: "Impossible de mettre à jour." }, { status: 500 });
    }

    return NextResponse.json({ record: data });
  } catch (err) {
    console.error("Erreur API inscriptions/[id] (PATCH):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

// Supprime une inscription
export async function DELETE(request, { params }) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { id } = params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("inscriptions").delete().eq("id", id);

    if (error) {
      console.error("Erreur Supabase (delete):", error);
      return NextResponse.json({ error: "Impossible de supprimer." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur API inscriptions/[id] (DELETE):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
