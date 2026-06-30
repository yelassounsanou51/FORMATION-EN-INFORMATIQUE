import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { genReceiptNumber, OPTIONS_INSCRIPTION } from "@/lib/config";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nom, prenom, telephone, email, sexe, profession, operateur, transactionRef, optionId } = body;

    if (!nom?.trim() || !prenom?.trim()) {
      return NextResponse.json({ error: "Le nom et le prenom sont requis." }, { status: 400 });
    }
    if (!telephone || !/^[\d+ ]{8,}$/.test(telephone.trim())) {
      return NextResponse.json({ error: "Numero de telephone invalide." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (!sexe) {
      return NextResponse.json({ error: "Le champ sexe est requis." }, { status: 400 });
    }
    if (!operateur) {
      return NextResponse.json({ error: "L operateur de paiement est requis." }, { status: 400 });
    }

    const option = OPTIONS_INSCRIPTION.find((o) => o.id === optionId);
    if (!option) {
      return NextResponse.json({ error: "Option d inscription invalide." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const id = genReceiptNumber();

    const { data, error } = await supabase
      .from("inscriptions")
      .insert({
        id,
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        sexe,
        profession: profession?.trim() || null,
        operateur,
        transaction_ref: transactionRef?.trim() || null,
        montant: option.prix,
        option_label: option.label,
        statut: "a verifier",
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase (insert):", error);
      return NextResponse.json({ error: "Impossible d enregistrer l inscription. Reessayez." }, { status: 500 });
    }

    return NextResponse.json({ record: data }, { status: 201 });
  } catch (err) {
    console.error("Erreur API inscriptions (POST):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const adminCode = request.headers.get("x-admin-code");
    if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("inscriptions")
      .select("*")
      .order("date_inscription", { ascending: false });

    if (error) {
      console.error("Erreur Supabase (select):", error);
      return NextResponse.json({ error: "Impossible de charger les inscriptions." }, { status: 500 });
    }

    return NextResponse.json({ records: data });
  } catch (err) {
    console.error("Erreur API inscriptions (GET):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
