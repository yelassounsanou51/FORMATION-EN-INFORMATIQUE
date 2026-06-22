import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!process.env.ADMIN_CODE) {
      console.error("ADMIN_CODE n'est pas défini dans les variables d'environnement.");
      return NextResponse.json({ error: "Configuration serveur incomplète." }, { status: 500 });
    }

    if (code === process.env.ADMIN_CODE) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
