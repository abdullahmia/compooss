import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compooss Docs",
  description: "Documentation for Compooss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
