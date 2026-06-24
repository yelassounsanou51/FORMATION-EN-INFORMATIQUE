import { Suspense } from "react";
import PendingClient from "./PendingClient";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function EnAttentePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <main style={{ flex: 1, padding: "48px 24px 64px" }}>
        <Suspense fallback={<p style={{ textAlign: "center", color: "var(--muted)" }}>Chargement...</p>}>
          <PendingClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
