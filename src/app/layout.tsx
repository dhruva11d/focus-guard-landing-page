import type { Metadata, Viewport } from "next";
import { Reenie_Beanie } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const absans = localFont({
  src: "../../public/font/absans-main/fonts/Absans-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
});
const hand = Reenie_Beanie({ subsets: ["latin"], weight: "400", variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  title: "FocusGuard | Phones down, focus together",
  description:
    "A focus timer in your browser. Focus on your own, or join a room, put your phone face down and let the host see who stays focused.",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#dcdcd8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${absans.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
