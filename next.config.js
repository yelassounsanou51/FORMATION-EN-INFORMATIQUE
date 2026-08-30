/** @type {import('next').NextConfig} */
// Remarque : la Content-Security-Policy (script-src) n'est plus définie ici,
// mais dans middleware.js, car elle a besoin d'un "nonce" différent à chaque
// requête pour autoriser les scripts internes de Next.js sans ouvrir la
// porte à n'importe quel script (voir middleware.js pour le détail).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
