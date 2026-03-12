import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compooss",
  description: "Compooss is a MongoDB Compass alternative for MongoDB Atlas.",
  authors: [{ name: "Abdullah Mia" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasBasicAuth =
    !!process.env.BASIC_AUTH_USER && !!process.env.BASIC_AUTH_PASSWORD;
  const hasHttps = process.env.HTTPS_ENABLED === "true";

  const isProtected = hasBasicAuth || hasHttps;

  const bannerMessage = isProtected
    ? "Protected environment: access is gated (Basic Auth / HTTPS configured)."
    : "Local-only: compooss is intended for local development. Do not expose this container publicly.";

  return (
    <html lang="en">
      <body>
        <div className="w-full px-4 py-2 text-xs border-b border-border bg-warning/10 text-warning">
          {bannerMessage}
        </div>
        {children}
      </body>
    </html>
  );
}
