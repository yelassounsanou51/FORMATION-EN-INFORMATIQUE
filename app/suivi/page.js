import { Suspense } from "react";
import TrackingClient from "./TrackingClient";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function SuiviPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <main style={{ flex: 1, padding: "48px 24px 64px" }}>
        <Suspense fallback={<p style={{ textAlign: "center", color: "var(--muted)" }}>Chargement...</p>}>
          <TrackingClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
