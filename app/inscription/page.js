import { Suspense } from "react";
import InscriptionClient from "./InscriptionClient";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

// Cette page doit être rendue à chaque requête (pas figée au moment du build) :
// c'est nécessaire pour que le "nonce" de sécurité généré par middleware.js
// (qui change à chaque visite) puisse être appliqué correctement aux scripts
// internes de Next.js. Voir middleware.js pour le détail.
export const dynamic = "force-dynamic";

export default function InscriptionPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <main style={{ flex: 1, padding: "48px 24px 64px" }}>
        <Suspense fallback={<p style={{ textAlign: "center", color: "var(--muted)" }}>Chargement...</p>}>
          <InscriptionClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
