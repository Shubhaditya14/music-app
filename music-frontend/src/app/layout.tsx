import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import PlayerBar from "@/components/PlayerBar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music App",
  description: "A Spotify-like app in development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PlayerProvider>
          <Sidebar>{children}</Sidebar>
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
