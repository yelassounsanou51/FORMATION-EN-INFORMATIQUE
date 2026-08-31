import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { genReceiptNumber, OPTIONS_INSCRIPTION } from "@/lib/config";
import { isAdminRequest } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // Maximum 5 inscriptions toutes les 30 minutes par IP : assez large pour
    // un usage normal (une famille, une connexion partagée), assez strict
    // pour bloquer un script qui remplirait la base de fausses inscriptions.
    const { allowed, retryAfterSeconds } = await checkRateLimit(`inscription:${ip}`, {
      maxAttempts: 5,
      windowSeconds: 30 * 60,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${Math.ceil(retryAfterSeconds / 60)} minute(s).` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { nom, prenom, telephone, email, sexe, profession, operateur, transactionRef, optionId } = body;

    if (!nom?.trim() || !prenom?.trim()) {
      return NextResponse.json({ error: "Le nom et le prénom sont requis." }, { status: 400 });
    }
    if (!telephone || !/^[\d+ ]{8,}$/.test(telephone.trim())) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (!sexe) {
      return NextResponse.json({ error: "Le champ sexe est requis." }, { status: 400 });
    }
    if (!operateur) {
      return NextResponse.json({ error: "L'opérateur de paiement est requis." }, { status: 400 });
    }

    const option = OPTIONS_INSCRIPTION.find((o) => o.id === optionId);
    if (!option) {
      return NextResponse.json({ error: "Option d'inscription invalide." }, { status: 400 });
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
        statut: "à vérifier",
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur Supabase (insert):", error);
      return NextResponse.json({ error: "Impossible d'enregistrer l'inscription. Réessayez." }, { status: 500 });
    }

    return NextResponse.json({ record: data }, { status: 201 });
  } catch (err) {
    console.error("Erreur API inscriptions (POST):", err);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
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
