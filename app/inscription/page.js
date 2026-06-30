import { Suspense } from "react";
import InscriptionClient from "./InscriptionClient";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

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
