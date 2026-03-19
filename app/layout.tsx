import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoTicket Demo - Next.js",
  description: "Demo web for customer, admin, and vendor portals with fake data",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
