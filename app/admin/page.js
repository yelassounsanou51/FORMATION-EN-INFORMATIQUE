import AdminClient from "./AdminClient";

// Rendu dynamique (pas figé au build) : nécessaire pour que le nonce de
// sécurité généré par middleware.js s'applique correctement. Voir
// middleware.js et app/inscription/page.js pour le détail.
export const dynamic = "force-dynamic";

export default function Page() {
  return <AdminClient />;
}
