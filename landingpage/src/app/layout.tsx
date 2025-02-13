import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stratbook - Free CS2 Strats & Nade Management Tool",
  description: "Free Counterstrike Strategy & Nade Lineup Management Tool and real-time Tactics Board. Collaborate with your team and Keep your Playbook organized with Stratbook.",
  icons: [
    {
      url: "/home/favicon.svg",
    },
  ],
  keywords: ["Counterstrike", "CS2", "Esport", "Tactics", "Strategies", "Nades", "Grenade", "Lineups", "Collaboration", "Playbook", "Tactics Board", "Team", "Management", "Realtime"],
  metadataBase: new URL("https://jstin.dev/home/"),
  openGraph: {
    title: "Stratbook - Free CS2 Strats & Nade Management Tool",
    description: "Free Counterstrike Strategy & Nade Management Tool and real-time Tactics Board. Collaborate with your team and Keep your Playbook organized with Stratbook.",
    images: [
      {
        url: "/home/stratbook_icon.svg",
        width: 40,
        height: 40,
        alt: "Stratbook Logo",
      },
    ],
    siteName: "Stratbook",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "overflow-x-hidden")}>
        <div className="flex flex-col min-h-screen">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
