import { Suspense } from "react";
import PendingClient from "./PendingClient";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function EnAttentePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <main style={{ flex: 1, padding: "32px 20px 56px" }}>
        <Suspense fallback={<p style={{ textAlign: "center", color: "#64748b" }}>Chargement...</p>}>
          <PendingClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
