import { Providers } from "@/lib/providers/providers";
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
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
