import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iChat — Realtime Chat",
  description: "Real-time chat with multiple people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
