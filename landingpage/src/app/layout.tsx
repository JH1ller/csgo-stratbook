import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stratbook",
  description: "Collaborative Counterstrike Strategy & Nade Management Tool and realtime Tactics Board. Keep your Playbook organized with Stratbook.",
  icons: [
    {
      url: "/home/favicon.svg",
    },
  ],
  keywords: ["Counterstrike", "CS2", "Esport", "Tactics", "Strategies", "Nades", "Grenade", "Lineups", "Collaboration", "Playbook", "Tactics Board", "Team", "Management", "Realtime"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
