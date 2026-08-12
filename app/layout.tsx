import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XCDGOC PVT LTD - Logistics & Dispatch Solutions",
  description:
    "Extreme Canada Dispatch Group Of Companies. Complete dispatch solutions across Canada & USA.",
  icons: {
    icon: "/finalLogo.jpeg",
    shortcut: "/finalLogo.jpeg",
    apple: "/finalLogo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white dark:bg-black">
        {children}
      </body>
    </html>
  );
}